'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote } from '@/types/api';
import { quotesApi } from '@/lib/api/quotes';
import { Button } from '@/components/ui/Button';

interface QuoteDetailClientProps {
  quote: Quote;
}

export function QuoteDetailClient({ quote }: QuoteDetailClientProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  const handleAccept = async () => {
    const confirm = window.confirm('Ready to make it yours? Accepting this quote confirms the agreed pricing and allows your order to proceed.');
    if (!confirm) return;

    setIsAccepting(true);
    setError(null);

    try {
      const res = await quotesApi.accept(quote.id);
      setSuccessOrderId(res.data.order_id);
    } catch (err: any) {
      if (err.message?.includes('already been accepted') || err.message?.includes('Only sent quotes can be accepted')) {
        setError('This quote has already been accepted or is no longer actionable.');
      } else {
        setError(err.message || 'Failed to accept quote.');
      }
      setIsAccepting(false);
    }
  };

  // User just successfully accepted this quote in the current session
  if (successOrderId) {
    return (
      <div className="bg-white border border-[var(--color-ash)]/20 p-8 md:p-12 text-center space-y-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="font-display text-3xl font-medium text-[var(--color-black)]">QUOTE ACCEPTED</h2>
        <p className="text-[var(--color-ash)] text-sm max-w-md mx-auto">
          Your quote has been accepted and your order has been created successfully. 
          Please proceed to your order to manage payments.
        </p>
        <div className="pt-4">
          <Button 
            onClick={() => router.push(`/account/orders/${successOrderId}`)}
            className="bg-[var(--color-black)] text-[var(--color-white)] hover:bg-[var(--color-off-black)] px-8 py-3 tracking-widest"
          >
            VIEW ORDER
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-ash)]/20 p-6 md:p-8 space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-sm">
          {error}
        </div>
      )}

      {quote.status === 'sent' && (
        <div className="border-t border-[var(--color-ash)]/20 pt-8 flex flex-col items-center text-center">
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-2">Ready to make it yours?</h3>
          <p className="text-sm text-[var(--color-ash)] mb-8 max-w-lg">
            Review the items and total above. Accepting this quote confirms the agreed pricing and officially initiates your order.
          </p>
          <Button 
            onClick={handleAccept}
            isLoading={isAccepting}
            className="w-full sm:w-auto bg-[var(--color-black)] text-[var(--color-white)] hover:bg-[var(--color-off-black)] px-12 py-4 tracking-widest font-medium"
          >
            ACCEPT QUOTE
          </Button>
        </div>
      )}

      {quote.status === 'accepted' && (
        <div className="border-t border-[var(--color-ash)]/20 pt-8 flex flex-col items-center text-center">
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-2">Accepted</h3>
          <p className="text-sm text-[var(--color-ash)] mb-8 max-w-lg">
            You have already accepted this quote. Your tailoring order is in progress.
          </p>
          <Button 
            onClick={() => router.push(`/account/orders`)}
            className="w-full sm:w-auto border border-[var(--color-black)] text-[var(--color-black)] hover:bg-[var(--color-ash)]/10 px-12 py-4 tracking-widest font-medium transition-colors"
          >
            VIEW MY ORDERS
          </Button>
        </div>
      )}

      {quote.status === 'expired' && (
        <div className="border-t border-[var(--color-ash)]/20 pt-8 flex flex-col items-center text-center">
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-2">Expired</h3>
          <p className="text-sm text-[var(--color-ash)] max-w-lg">
            This quote has expired. Contact the tailor if you'd like an updated quote.
          </p>
        </div>
      )}
    </div>
  );
}
