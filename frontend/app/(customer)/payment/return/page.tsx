'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { paymentsApi } from '@/lib/api/payments';
import { Button } from '@/components/ui/Button';

function PaymentReturnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const verify = async () => {
      // Typically the mock provider or real provider redirects back with a payment_id or reference in query params.
      // Let's assume `payment_id` is passed. (The mock provider usually returns the payment DB ID or reference).
      const paymentId = searchParams.get('payment_id');

      if (!paymentId) {
        setStatus('error');
        setErrorMessage('Invalid payment return URL. No payment reference found.');
        return;
      }

      try {
        const res = await paymentsApi.verify(paymentId);
        
        if (res.data.status === 'successful') {
          setStatus('success');
          setOrderId(res.data.order_id);
        } else {
          setStatus('error');
          setErrorMessage('Payment verification failed or is still pending.');
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Failed to verify payment with the server.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 p-8 md:p-12 text-center max-w-md w-full space-y-6 shadow-sm">
      
      {status === 'verifying' && (
        <>
          <div className="w-12 h-12 border-2 border-[var(--color-black)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="font-display text-2xl font-medium text-[var(--color-black)] uppercase">
            Verifying Payment
          </h2>
          <p className="text-[var(--color-ash)] text-sm">
            Please wait while we confirm your payment securely with our provider. Do not close this page.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-medium text-[var(--color-black)] uppercase">
            Payment Successful
          </h2>
          <p className="text-[var(--color-ash)] text-sm mb-8">
            Your payment has been successfully recorded. Thank you.
          </p>
          <Button 
            onClick={() => router.push(`/account/orders/${orderId}`)}
            variant="primary"
            size="lg"
            className="w-full"
          >
            RETURN TO ORDER
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-medium text-[var(--color-black)] uppercase">
            Payment Error
          </h2>
          <p className="text-red-700 text-sm bg-red-50 p-4 border border-red-200">
            {errorMessage}
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <Button 
              onClick={() => router.push('/account/orders')}
              variant="primary"
              size="lg"
              className="w-full"
            >
              MY ORDERS
            </Button>
          </div>
        </>
      )}

    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="w-12 h-12 border-2 border-[var(--color-black)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      }>
        <PaymentReturnContent />
      </Suspense>
    </div>
  );
}
