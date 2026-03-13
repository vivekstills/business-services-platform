import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MapPin } from 'lucide-react';
import type { FAQ } from '../data/faqs';

type Props = {
  faqs: FAQ[];
  stateFAQs?: FAQ[];
  serviceName: string;
  selectedState?: string;
};

function FAQItem({ faq, index, openIndex, setOpenIndex }: {
  faq: FAQ;
  index: number;
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
  key?: React.Key;
}) {
  const isOpen = openIndex === index;
  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isOpen
          ? 'bg-blue-50/60 border-blue-200'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`text-[14px] font-medium leading-snug transition-colors ${isOpen ? 'text-blue-800' : 'text-gray-700'}`}>
          {faq.q}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px bg-blue-100 mb-4" />
              <p className="text-[13.5px] text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServiceFAQ({ faqs, stateFAQs = [], serviceName, selectedState }: Props) {
  const [genOpen, setGenOpen]     = useState<number | null>(0);
  const [stateOpen, setStateOpen] = useState<number | null>(0);

  // Auto-open first state FAQ when state changes
  useEffect(() => {
    if (stateFAQs.length > 0) setStateOpen(0);
  }, [stateFAQs]);

  if (!faqs.length && !stateFAQs.length) return null;

  return (
    <div className="mt-14">
      {/* General FAQs */}
      {faqs.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
            <span className="ml-2 text-sm font-normal text-gray-400">— {serviceName}</span>
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                faq={faq}
                index={idx}
                openIndex={genOpen}
                setOpenIndex={setGenOpen}
              />
            ))}
          </div>
        </>
      )}

      {/* State-specific FAQs */}
      <AnimatePresence>
        {selectedState && stateFAQs.length > 0 && (
          <motion.div
            key={selectedState}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28 }}
            className="mt-10"
          >
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[12px] font-bold">{selectedState}</span>
              </div>
              <h3 className="text-[16px] font-bold text-gray-800">
                State-specific FAQs
              </h3>
            </div>

            <div className="space-y-2">
              {stateFAQs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 ${
                    stateOpen === idx
                      ? 'bg-blue-50/70 border-blue-200'
                      : 'bg-white border-gray-200 hover:bg-blue-50/30 hover:border-blue-200'
                  }`}
                >
                  <button
                    onClick={() => setStateOpen(stateOpen === idx ? null : idx)}
                    className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className={`text-[14px] font-medium leading-snug transition-colors ${stateOpen === idx ? 'text-blue-800' : 'text-gray-700'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-all duration-200 ${stateOpen === idx ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {stateOpen === idx && (
                      <motion.div
                        key="state-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="h-px bg-blue-100 mb-4" />
                          <p className="text-[13.5px] text-gray-500 leading-relaxed">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prompt when no state-specific FAQs available for the selected state */}
      <AnimatePresence>
        {selectedState && stateFAQs.length === 0 && faqs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8 flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
          >
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-[12.5px] text-gray-500">
              The FAQs above apply to <strong>{selectedState}</strong>. For state-specific queries, call us at{' '}
              <a href="tel:+919876543210" className="text-blue-600 font-semibold">+91 98765 43210</a>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
