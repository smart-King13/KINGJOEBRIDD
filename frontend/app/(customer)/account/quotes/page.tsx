import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Quote, PaginatedResponse } from '@/types/api';
import { formatMoney, formatDateTime } from '@/lib/utils/format';

export const metadata = {
  title: 'My Quotes | KINGJOEBRIDD FASHION',
};

async function getQuotes() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/quotes?page=1`, {
    headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Failed to fetch quotes');
  }

  const json = await res.json() as PaginatedResponse<Quote>;
  return json.data; // The backend wraps PaginatedResource correctly 
}

const statusColors: Record<string, string> = {
  draft: 'bg-[var(--color-ash)]/10 text-[var(--color-ash)]',
  sent: 'bg-transparent text-[var(--color-black)] border border-[var(--color-black)]',
  accepted: 'bg-[var(--color-black)] text-[var(--color-white)]',
  expired: 'bg-transparent text-[var(--color-ash)] border border-[var(--color-ash)]/50 line-through decoration-[var(--color-ash)]/30',
};

export default async function QuotesPage() {
  const quotes = await getQuotes();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
          Your Quotes & Invoices
        </div>
      </div>

      {!quotes || quotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-ash)] mb-6 animate-float relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">No quotes yet</h3>
          <p className="text-[var(--color-ash)] text-sm max-w-md mx-auto relative z-10">
            Your quotes will appear here once KINGJOEBRIDD prepares one for you after your consultation.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-bold">Quote Details</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ash)]"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                        </div>
                        <div>
                          <div className="font-bold text-[var(--color-black)] uppercase tracking-wide">
                            {quote.items && quote.items.length > 0 ? quote.items[0].description.substring(0, 30) : 'Custom Quote'}
                          </div>
                          <div className="text-[var(--color-ash)] text-[10px] mt-1 uppercase tracking-widest">
                            Created: {formatDateTime(quote.created_at)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-background-subtle)] border border-[var(--color-light-ash)]/40 ${quote.status === 'accepted' ? 'bg-[var(--color-black)] text-[var(--color-white)] border-transparent' : 'text-[var(--color-black)]'}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-display tracking-wider text-[var(--color-black)]">
                        {formatMoney(quote.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/account/quotes/${quote.id}`}
                        className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
