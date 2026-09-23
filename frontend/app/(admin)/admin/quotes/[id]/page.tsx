import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Quote, ApiResponse, User } from '@/types/api';
import { formatMoney, formatDateTime, formatDate } from '@/lib/utils/format';
import { QuoteDetailAdminClient } from '@/components/admin/quotes/QuoteDetailAdminClient';

export const metadata = {
  title: 'Quote Detail | Admin | KINGJOEBRIDD FASHION',
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

// Removed isolated customer fetching as it's now eagerly loaded.
export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const quote = await getQuote(params.id);

  if (!quote) {
    notFound();
  }

  const user = (quote as any).user;

  const statusColors: Record<string, string> = {
    draft: 'bg-[var(--color-ash)]/10 text-[var(--color-ash)]',
    sent: 'bg-[var(--color-white)] text-[var(--color-black)] border border-[var(--color-black)]',
    accepted: 'bg-[var(--color-black)] text-[var(--color-white)]',
    expired: 'bg-[var(--color-ash)]/20 text-[var(--color-ash)] line-through',
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <Link href="/admin/quotes" className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Quotes
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-2">
          <h1 className="font-display text-3xl font-medium text-[var(--color-black)] uppercase">
            Quote {quote.id.split('-')[0]}
          </h1>
          <span className={`inline-block text-[11px] font-bold tracking-widest px-4 py-2 uppercase w-fit ${statusColors[quote.status] || statusColors.draft}`}>
            {quote.status}
          </span>
        </div>
        <p className="text-sm text-[var(--color-ash)]">
          Created on {formatDateTime(quote.created_at)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col - Details */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              
              <div>
                <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
                  Items
                </h3>
                <div className="space-y-4">
                  {quote.items && quote.items.length > 0 ? (
                    <ul className="divide-y divide-[var(--color-light-ash)]">
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
                    <p className="text-sm text-[var(--color-ash)] italic">No items in this quote.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
                  Pricing
                </h3>
                <div className="flex justify-end">
                  <div className="w-full sm:w-2/3 md:w-1/2 space-y-3 text-sm">
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
                    <div className="flex justify-between font-bold text-lg text-[var(--color-black)] pt-3 border-t border-[var(--color-light-ash)]">
                      <span>Total</span>
                      <span>{formatMoney(quote.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {quote.notes && (
                <div>
                  <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-[var(--color-ash)] whitespace-pre-line leading-relaxed">
                    {quote.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <QuoteDetailAdminClient quote={quote} />
        </div>

        {/* Right Col - Meta & Context */}
        <div className="space-y-6">
          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] p-6">
            <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
              Customer
            </h3>
            {user ? (
              <div className="space-y-1">
                <p className="font-medium text-[var(--color-black)]">{user.name}</p>
                <p className="text-sm text-[var(--color-ash)]">{user.email}</p>
                <Link href={`/admin/customers/${user.id}`} className="inline-block mt-3 text-xs tracking-widest text-[var(--color-black)] border-b border-[var(--color-black)] uppercase pb-0.5 hover:opacity-60 transition-opacity">
                  View Profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-ash)] italic">Unknown Customer ID: {quote.user_id}</p>
            )}
          </div>

          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] p-6">
            <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
              Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-ash)]">Created</span>
                <span className="text-[var(--color-black)] font-medium">{formatDate(quote.created_at)}</span>
              </div>
              {quote.expires_at && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-ash)]">Expires</span>
                  <span className={`font-medium ${quote.status === 'expired' ? 'text-red-700 line-through' : 'text-[var(--color-black)]'}`}>
                    {formatDate(quote.expires_at)}
                  </span>
                </div>
              )}
              {quote.accepted_at && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-ash)]">Accepted</span>
                  <span className="text-[var(--color-black)] font-medium">{formatDate(quote.accepted_at)}</span>
                </div>
              )}
            </div>
          </div>

          {quote.conversation_id && (
            <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] p-6">
              <h3 className="font-bold tracking-widest text-[var(--color-black)] text-xs mb-4 uppercase border-b border-[var(--color-light-ash)] pb-2">
                Context
              </h3>
              <p className="text-sm text-[var(--color-ash)] mb-3">Linked to a customer conversation.</p>
              <Link href={`/admin/conversations/${quote.conversation_id}`} className="inline-block text-xs tracking-widest text-[var(--color-black)] border-b border-[var(--color-black)] uppercase pb-0.5 hover:opacity-60 transition-opacity">
                View Conversation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
