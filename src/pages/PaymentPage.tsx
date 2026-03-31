import React from 'react';
import { useContent } from '../context/ContentContext';
import PaymentForm from '../components/PaymentForm';

export default function PaymentPage() {
  const { content } = useContent();
  const footer = content.footer;

  const paymentFootnote = (footer.paymentFootnote ?? 'Secured by Razorpay · 256-bit SSL encryption').trim();
  const payBtn = (footer.paymentPayButtonLabel ?? 'Pay Now').trim() || 'Pay Now';
  const successTitle = (footer.paymentSuccessTitle ?? 'Payment successful!').trim() || 'Payment successful!';
  const successSub = (footer.paymentSuccessSub ?? "You'll receive a confirmation shortly.").trim();
  const checkoutBrand = (footer.paymentCheckoutBrandName ?? 'Mridhuv Associates').trim() || 'Mridhuv Associates';
  const payPh = {
    amount: (footer.paymentPlaceholderAmount ?? 'Amount (₹)').trim() || 'Amount (₹)',
    name: (footer.paymentPlaceholderName ?? 'Your name').trim() || 'Your name',
    phone: (footer.paymentPlaceholderPhone ?? 'Phone number').trim() || 'Phone number',
    email: (footer.paymentPlaceholderEmail ?? 'Email (optional, for receipt)').trim() || 'Email (optional, for receipt)',
    note: (footer.paymentPlaceholderNote ?? 'Payment note / reference (optional)').trim() || 'Payment note / reference (optional)',
  };

  return (
    <div className="min-h-screen pt-16 px-4 sm:px-6 lg:px-8 bg-[#f5f9ff]">
      <div className="min-h-[calc(100vh-4rem)] flex items-start md:items-center justify-center pt-16 md:pt-0">
        <div className="w-full max-w-[460px] mx-auto">
          <h1 className="text-center text-3xl font-semibold text-gray-900 mb-7">Make a Payment</h1>
          <PaymentForm
            footnote={paymentFootnote}
            payButtonLabel={payBtn}
            successTitle={successTitle}
            successSub={successSub}
            checkoutBrandName={checkoutBrand}
            placeholders={payPh}
          />
        </div>
      </div>
    </div>
  );
}
