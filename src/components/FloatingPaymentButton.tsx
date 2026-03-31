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
      className="fixed right-4 bottom-20 sm:right-6 sm:bottom-[5.3rem] z-50 group"
    >
      <div className="pointer-events-none absolute right-0 -top-10 rounded-full bg-gray-900 text-white text-[calc(11px+3pt)] px-3 py-1.5 shadow-lg opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 whitespace-nowrap">
        Make a Payment
      </div>
      <button
        type="button"
        onClick={() => navigate('/payment')}
        className="pulse-soft w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-2xl shadow-blue-300 hover:shadow-[0_16px_30px_rgba(245,158,11,0.22)] hover:-translate-y-0.5 transition-all duration-300"
        aria-label="Make a Payment"
        title="Make a Payment"
      >
        <IndianRupee className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
