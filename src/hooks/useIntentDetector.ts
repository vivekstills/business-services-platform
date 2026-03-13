import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const GST_PATTERNS = [
  /\/service\/gst/,
  /\/gst-filing/,
  /\/gst-registration/,
  /\/gst-return/,
];

const SERVICE_PATTERN = /\/service\//;

type TriggerReason = 'time_on_page' | 'scroll_depth' | 'pricing_click' | 'exit_intent';

type IntentState = {
  isGstPage: boolean;
  isServicePage: boolean;
  shouldShowPopup: boolean;
  triggerReason: TriggerReason | null;
  timeOnPage: number;
  serviceName: string;
  dismiss: () => void;
};

function trackAnalytics(event: string, pageUrl: string, metadata?: Record<string, unknown>) {
  try {
    navigator.sendBeacon(
      '/api/analytics',
      new Blob([JSON.stringify({ event, pageUrl, metadata })], { type: 'application/json' })
    );
  } catch {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, pageUrl, metadata }),
      keepalive: true,
    }).catch(() => {});
  }
}

function getServiceNameFromUrl(pathname: string): string {
  const match = pathname.match(/\/service\/(.+)/);
  if (!match) return '';
  return match[1]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const POPUP_COOLDOWN_KEY = 'lead_popup_last_shown';
const POPUP_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes
const LEAD_SUBMITTED_KEY = 'lead_submitted';

export function useIntentDetector(): IntentState {
  const location = useLocation();
  const pathname = location.pathname;
  const [shouldShowPopup, setShouldShowPopup] = useState(false);
  const [triggerReason, setTriggerReason] = useState<TriggerReason | null>(null);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const triggeredRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const isGstPage = GST_PATTERNS.some((p) => p.test(pathname));
  const isServicePage = SERVICE_PATTERN.test(pathname);
  const serviceName = getServiceNameFromUrl(pathname);

  const canShowPopup = useCallback(() => {
    if (localStorage.getItem(LEAD_SUBMITTED_KEY)) return false;
    const last = localStorage.getItem(POPUP_COOLDOWN_KEY);
    if (last && Date.now() - Number(last) < POPUP_COOLDOWN_MS) return false;
    return true;
  }, []);

  const trigger = useCallback(
    (reason: TriggerReason) => {
      if (triggeredRef.current || !canShowPopup()) return;
      triggeredRef.current = true;
      setTriggerReason(reason);
      setShouldShowPopup(true);
      localStorage.setItem(POPUP_COOLDOWN_KEY, String(Date.now()));
      trackAnalytics('chatbot_triggered', pathname, { reason, serviceName });
    },
    [canShowPopup, pathname, serviceName]
  );

  const dismiss = useCallback(() => {
    setShouldShowPopup(false);
  }, []);

  useEffect(() => {
    triggeredRef.current = false;
    setShouldShowPopup(false);
    setTriggerReason(null);
    startTimeRef.current = Date.now();
    setTimeOnPage(0);
  }, [pathname]);

  // Track page visits for service pages
  useEffect(() => {
    if (!isServicePage) return;
    trackAnalytics('page_visit', pathname, { isGstPage, serviceName });
  }, [pathname, isServicePage, isGstPage, serviceName]);

  // Time-on-page tracker (triggers at 15s for GST pages, 30s for other service pages)
  useEffect(() => {
    if (!isServicePage) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeOnPage(elapsed);

      const threshold = isGstPage ? 15 : 30;
      if (elapsed >= threshold) {
        trigger('time_on_page');
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [pathname, isServicePage, isGstPage, trigger]);

  // Scroll depth tracking (triggers at 50%)
  useEffect(() => {
    if (!isServicePage) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = (scrollTop / docHeight) * 100;
      if (pct >= 50) {
        trigger('scroll_depth');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname, isServicePage, trigger]);

  // Pricing click detection
  useEffect(() => {
    if (!isServicePage) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pricingEl = target.closest('[data-pricing], [id*="pricing"], [class*="pricing"]');
      if (pricingEl) {
        trigger('pricing_click');
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname, isServicePage, trigger]);

  // Exit intent detection (desktop: cursor leaves viewport top; mobile: back button / visibility change)
  useEffect(() => {
    if (!isServicePage) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trigger('exit_intent');
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trigger('exit_intent');
      }
    };

    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [pathname, isServicePage, trigger]);

  return {
    isGstPage,
    isServicePage,
    shouldShowPopup,
    triggerReason,
    timeOnPage,
    serviceName,
    dismiss,
  };
}

export { trackAnalytics, LEAD_SUBMITTED_KEY };
