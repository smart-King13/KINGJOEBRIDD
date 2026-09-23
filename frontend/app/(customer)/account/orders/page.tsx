import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { buttonClasses } from '@/components/ui/Button';
import { Order, PaginatedResponse } from '@/types/api';
import { formatMoney, formatDateTime } from '@/lib/utils/format';

export const metadata = {
  title: 'My Orders | KINGJOEBRIDD FASHION',
};

async function getOrders() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/orders?page=1`, {
    headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error('Failed to fetch orders');
  }

  const json = await res.json() as PaginatedResponse<Order>;
  return json.data;
}

const paymentLabels: Record<string, string> = {
  pending_payment: 'Payment Pending',
  partially_paid: 'Partially Paid',
  paid_in_full: 'Paid in Full',
};

const paymentColors: Record<string, string> = {
  pending_payment: 'bg-transparent text-[var(--color-black)] border border-[var(--color-black)]',
  partially_paid: 'bg-[var(--color-black)]/5 text-[var(--color-black)] border border-transparent',
  paid_in_full: 'bg-[var(--color-black)] text-[var(--color-white)] border border-[var(--color-black)]',
};

const productionLabels: Record<string, string> = {
  not_started: 'Not Started',
  cutting: 'Cutting',
  sewing: 'Sewing',
  finishing: 'Finishing',
  quality_check: 'Quality Check',
  ready: 'Ready',
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
          Your Order History
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-xl bg-[var(--color-white)]/80 backdrop-blur-md shadow-lg border border-[var(--color-light-ash)] group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-light-ash)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto text-[var(--color-ash)] mb-6 animate-float relative z-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <h3 className="font-display text-2xl text-[var(--color-black)] mb-3 relative z-10 tracking-wide">Your tailoring journey starts here.</h3>
          <p className="text-[var(--color-ash)] text-sm max-w-md mx-auto relative z-10">
            Your accepted quotes will become orders and can be tracked here.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-background-subtle)] border-b border-[var(--color-light-ash)]/40 text-[10px] font-bold uppercase tracking-widest text-[var(--color-ash)]">
                <tr>
                  <th className="px-6 py-4 font-bold">Order Details</th>
                  <th className="px-6 py-4 font-bold">Total</th>
                  <th className="px-6 py-4 font-bold">Payment</th>
                  <th className="px-6 py-4 font-bold">Production</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {orders.map((order) => {
                  const quoteTotal = order.snapshot?.quote?.total || 0;
                  return (
                    <tr key={order.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ash)]"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                          </div>
                          <div>
                            <div className="font-bold text-[var(--color-black)] uppercase tracking-wide">
                              {order.id.split('-')[0]}
                            </div>
                            <div className="text-[var(--color-ash)] text-[10px] mt-1 uppercase tracking-widest">
                              {formatDateTime(order.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-display tracking-wider text-[var(--color-black)]">
                          {formatMoney(quoteTotal)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-background-subtle)] text-[var(--color-black)] border border-[var(--color-light-ash)]/40`}>
                          {paymentLabels[order.payment_status] || order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-black)] text-[var(--color-white)]`}>
                          {productionLabels[order.production_status] || order.production_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.payment_status !== 'paid_in_full' && (
                            <Link 
                              href={`/account/orders/${order.id}/pay`}
                              className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] rounded-lg px-4 py-2 hover:bg-[var(--color-black)] hover:text-white text-[var(--color-black)] transition-colors inline-block"
                            >
                              Pay
                            </Link>
                          )}
                          <Link 
                            href={`/account/orders/${order.id}`}
                            className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
