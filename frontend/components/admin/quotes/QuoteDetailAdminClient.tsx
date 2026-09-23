'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote } from '@/types/api';
import { apiClient } from '@/lib/api/apiClient';
import { Button } from '@/components/ui/Button';

interface Props {
  quote: Quote;
}

export function QuoteDetailAdminClient({ quote }: Props) {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!confirm('Are you sure you want to send this quote to the customer? They will be notified.')) return;
    setIsSending(true);
    setError(null);
    try {
      await apiClient(`/quotes/${quote.id}/send`, { method: 'POST' });
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to send quote.');
    } finally {
      setIsSending(false);
    }
  };



  return (
    <div className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 pt-6 border-t border-[var(--color-light-ash)]">
        {quote.status === 'draft' && (
          <>
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/quotes/${quote.id}/edit`)}
              disabled={isSending}
            >
              EDIT DRAFT
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              isLoading={isSending}
            >
              SEND QUOTE TO CUSTOMER
            </Button>
          </>
        )}
        
        {quote.status === 'sent' && (
          <div className="text-sm text-[var(--color-ash)] italic">
            Waiting for customer acceptance.
          </div>
        )}
      </div>
    </div>
  );
}
