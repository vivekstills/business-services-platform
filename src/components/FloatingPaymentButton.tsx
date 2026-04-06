import React from 'react';
import { motion } from 'motion/react';
import { IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingPaymentButton() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="fixed right-3 bottom-[82px] sm:right-6 sm:bottom-[5.3rem] z-50 group"
    >
      <div className="pointer-events-none absolute right-0 -top-10 rounded-full bg-gray-900 text-white text-[calc(11px+3pt)] px-3 py-1.5 shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap">
        Make a Payment
      </div>
      <button
        type="button"
        onClick={() => navigate('/payment')}
        className="pulse-soft h-[46px] w-[46px] sm:h-12 sm:w-[126px] px-2.5 sm:px-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white inline-flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.15)] sm:shadow-lg hover:shadow-[0_16px_30px_rgba(245,158,11,0.22)] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
        aria-label="Make a Payment"
        title="Make a Payment"
      >
        <IndianRupee className="w-5 h-5" />
        <span className="hidden sm:inline font-semibold text-sm">Pay</span>
      </button>
    </motion.div>
  );
}
