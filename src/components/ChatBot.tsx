import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, MessageCircle, Bot } from 'lucide-react';

type Message = {
  id: number;
  from: 'bot' | 'user';
  text: string;
};

type QuickReply = { label: string; value: string };

// ── Knowledge base ───────────────────────────────────────────────────────────
const RESPONSES: Array<{ patterns: RegExp[]; answer: string }> = [
  {
    patterns: [/gst\s*reg/i, /goods.*service.*tax/i],
    answer:
      'GST Registration is mandatory for businesses with turnover above ₹20 Lakhs (₹10 Lakhs for NE states). We handle the full process — TRN generation, ARN, and certificate — typically in 3–5 working days. Would you like to get started?',
  },
  {
    patterns: [/private\s*(limited|ltd)/i, /pvt\s*ltd/i, /company.*register/i, /incorporate/i],
    answer:
      'Incorporating a Private Limited Company requires minimum 2 directors and 2 shareholders. We handle name approval (MCA), DSC, DIN, SPICe+ filing, and deliver the Certificate of Incorporation + PAN/TAN in 7–10 working days.',
  },
  {
    patterns: [/llp/i, /limited\s*liability\s*partner/i],
    answer:
      'An LLP combines limited liability with partnership flexibility. We handle DPIN, DSC, LLP Agreement drafting, and ROC filing. Typical incorporation time is 10–15 working days.',
  },
  {
    patterns: [/trademark/i, /brand.*register/i, /tm\s*reg/i],
    answer:
      'Trademark registration protects your brand name, logo or tagline. We cover the trademark search, class selection, filing with the Trade Marks Registry, and handle objections if any. The process takes 12–18 months for registration.',
  },
  {
    patterns: [/itr|income.*tax.*return|tax.*filing/i],
    answer:
      'We handle ITR-1 through ITR-7 filings depending on your income profile. Salaried individuals (ITR-1/2), business owners (ITR-3/4), and companies (ITR-6). Share your requirements and we\'ll assign the right expert.',
  },
  {
    patterns: [/fssai|food.*licen/i],
    answer:
      'FSSAI is mandatory for all food businesses. We determine whether you need Basic Registration, State Licence or Central Licence based on your turnover and scale, and handle the complete application.',
  },
  {
    patterns: [/tds|tax.*deduct/i],
    answer:
      'TDS Returns must be filed quarterly in Form 24Q (salary), 26Q (non-salary) or 27Q (NRI payments). We handle computation, challan verification, and TRACES filing.',
  },
  {
    patterns: [/pf|provident\s*fund|epfo/i],
    answer:
      'PF Registration is mandatory for establishments with 20+ employees. We handle EPFO registration, UAN generation, and ongoing PF return filings.',
  },
  {
    patterns: [/price|cost|fee|how\s*much|charges/i],
    answer:
      'Our pricing depends on the specific service. For example: GST Registration starts at ₹999, Private Limited Company from ₹4,999, and Trademark from ₹6,999 (excluding government fees). Would you like a detailed quote for a specific service?',
  },
  {
    patterns: [/time|how\s*long|duration|days/i],
    answer:
      'Typical timelines: GST Registration 3–5 days, Company Incorporation 7–10 days, Trademark filing 2–3 weeks (registration 12–18 months), ITR Filing 2–3 days. Need a timeline for a specific service?',
  },
  {
    patterns: [/contact|call|speak|talk|phone|reach/i],
    answer:
      'You can reach us at 📞 +91 98765 43210 or email us at info@mridhuvassociates.com. Our team is available Mon–Sat, 9 AM – 7 PM. You can also fill the enquiry form on any service page.',
  },
  {
    patterns: [/document|docs\s*required|what.*need/i],
    answer:
      'Documents vary by service. Generally you\'ll need: PAN card, Aadhaar, address proof, and entity-specific documents. Tell me which service you\'re applying for and I\'ll share the exact list!',
  },
  {
    patterns: [/proprietor|sole.*owner|single.*person/i],
    answer:
      'A Proprietorship is the simplest business form — just one owner. Key registrations include MSME/Udyog Aadhaar, GST (if applicable), and a current bank account. No formal incorporation needed.',
  },
  {
    patterns: [/iec|import.*export|export.*code/i],
    answer:
      'IEC (Import Export Code) is mandatory for any import/export business. It has lifetime validity and is issued within 2–5 working days by DGFT.',
  },
  {
    patterns: [/annual.*complian|yearly.*filing|roc.*filing/i],
    answer:
      'Private Limited Companies must file AOC-4 (Financial Statements) within 30 days of AGM and MGT-7 (Annual Return) within 60 days of AGM. LLPs file Form 8 & Form 11 annually. Non-filing attracts ₹100/day penalty.',
  },
  {
    patterns: [/hello|hi\b|hey\b|namaste|good\s*(morning|afternoon|evening)/i],
    answer:
      'Hello! Welcome to Mridhuv Associates 🙏\n\nI\'m here to help you with business registrations, tax filings, trademark, compliance and more. What can I assist you with today?',
  },
  {
    patterns: [/thank/i, /thanks/i],
    answer:
      'You\'re welcome! Feel free to ask if you have any more questions. We\'re happy to help you with your business needs. 😊',
  },
];

const QUICK_REPLIES: QuickReply[] = [
  { label: '🏢 Company Registration', value: 'How do I register a Private Limited Company?' },
  { label: '📋 GST Registration',     value: 'Tell me about GST Registration' },
  { label: '™ Trademark',              value: 'How to register a trademark?' },
  { label: '💰 Pricing',               value: 'What are your prices?' },
  { label: '📞 Contact us',            value: 'How can I contact you?' },
];

let msgId = 0;
const newMsg = (from: Message['from'], text: string): Message => ({ id: ++msgId, from, text });

function getBotReply(input: string): string {
  const trimmed = input.trim();
  for (const entry of RESPONSES) {
    if (entry.patterns.some((p) => p.test(trimmed))) return entry.answer;
  }
  return `Thanks for your question! Our team specialises in GST, company registration, trademark, income tax, and compliance. Could you be more specific about which service you need? Or call us directly at +91 98765 43210.`;
}

export default function ChatBot() {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState<Message[]>([
    newMsg('bot', 'Hi there! 👋 I\'m the Mridhuv Associates assistant.\n\nAsk me about GST, company registration, trademark, tax filing, or any business compliance service. How can I help you today?'),
  ]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, newMsg('user', text)]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((m) => [...m, newMsg('bot', getBotReply(text))]);
    }, 900 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && showBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 8 }}
              className="absolute -top-10 -left-28 bg-gray-900 text-white text-[12px] font-medium px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg"
            >
              💬 Ask us anything!
              <div className="absolute bottom-0 right-6 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          whileTap={{ scale: 0.92 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-2xl shadow-indigo-300 hover:shadow-indigo-400 hover:-translate-y-0.5 transition-all"
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle className="w-6 h-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl shadow-gray-300/60 border border-gray-200 flex flex-col overflow-hidden"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-700 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-[14px] leading-tight">Mridhuv Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-indigo-200 text-[11px]">Online · Replies instantly</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.from === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-auto">
                      <Bot className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed whitespace-pre-line ${
                      msg.from === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && !isTyping && (
              <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-gray-100 bg-white flex-shrink-0">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.value}
                    onClick={() => sendMessage(qr.value)}
                    className="text-[11.5px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-full px-3 py-1 transition-colors"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                className="flex-1 h-9 rounded-xl border border-gray-200 px-3.5 text-[13.5px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
