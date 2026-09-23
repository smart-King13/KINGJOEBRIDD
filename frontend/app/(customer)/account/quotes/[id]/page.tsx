import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Quote, ApiResponse } from '@/types/api';
import { formatMoney, formatDateTime, formatDate } from '@/lib/utils/format';
import { QuoteDetailClient } from '@/components/quotes/QuoteDetailClient';

export const metadata = {
  title: 'Quote Detail | KINGJOEBRIDD FASHION',
};

async function getQuote(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/quotes/${id}`, {
    headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) return null;
    throw new Error('Failed to fetch quote');
  }

  const json = await res.json() as ApiResponse<Quote>;
  return json.data;
}

export default async function QuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = await getQuote(params.id);

  if (!quote) {
    notFound();
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-[var(--color-ash)]/10 text-[var(--color-ash)]',
    sent: 'bg-[var(--color-white)] text-[var(--color-black)] border border-[var(--color-black)]',
    accepted: 'bg-green-50 text-green-700',
    expired: 'bg-red-50 text-red-700',
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href="/account/quotes" className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO QUOTES
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-2">
          <h1 className="font-display text-3xl font-medium text-[var(--color-black)] uppercase">
            QUOTE
          </h1>
          <span className={`inline-block text-xs font-medium tracking-widest px-4 py-2 uppercase w-fit ${statusColors[quote.status] || statusColors.draft}`}>
            {quote.status}
          </span>
        </div>
        <p className="text-sm text-[var(--color-ash)]">
          Created on {formatDateTime(quote.created_at)}
        </p>
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          <div>
            <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
              Items
            </h3>
            <div className="space-y-4">
              {quote.items && quote.items.length > 0 ? (
                <ul className="divide-y divide-[var(--color-ash)]/20">
                  {quote.items.map(item => (
                    <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-[var(--color-black)]">{item.description}</p>
                        <p className="text-xs text-[var(--color-ash)] mt-1 uppercase tracking-wider">{item.type} &times; {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[var(--color-black)]">{formatMoney(item.total_price)}</p>
                        <p className="text-xs text-[var(--color-ash)] mt-1">{formatMoney(item.unit_price)} each</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--color-ash)]">No items in this quote.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
              Pricing
            </h3>
            <div className="flex justify-end">
              <div className="w-full sm:w-1/2 md:w-1/3 space-y-3 text-sm">
                <div className="flex justify-between text-[var(--color-ash)]">
                  <span>Subtotal</span>
                  <span>{formatMoney(quote.subtotal)}</span>
                </div>
                {quote.discount > 0 && (
                  <div className="flex justify-between text-[var(--color-black)] font-bold">
                    <span>Discount</span>
                    <span>-{formatMoney(quote.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg text-[var(--color-black)] pt-3 border-t border-[var(--color-ash)]/20">
                  <span>Total</span>
                  <span>{formatMoney(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div>
              <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
                Notes
              </h3>
              <p className="text-sm text-[var(--color-ash)] whitespace-pre-line leading-relaxed">
                {quote.notes}
              </p>
            </div>
          )}

          {quote.expires_at && (
            <div>
              <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
                Expiration
              </h3>
              <p className={`text-sm ${quote.status === 'expired' ? 'text-red-600' : 'text-[var(--color-ash)]'}`}>
                Quote valid until {formatDate(quote.expires_at)}
              </p>
            </div>
          )}

          {quote.conversation_id && (
            <div>
              <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-ash)]/20 pb-2">
                Questions?
              </h3>
              <Link 
                href={`/account/conversations/${quote.conversation_id}`}
                className="inline-flex items-center text-sm font-medium tracking-widest text-[var(--color-black)] hover:opacity-70 transition-colors border border-[var(--color-black)] px-6 py-3"
              >
                MESSAGE TAILOR
              </Link>
            </div>
          )}

        </div>
      </div>

      <QuoteDetailClient quote={quote} />
    </div>
  );
}
