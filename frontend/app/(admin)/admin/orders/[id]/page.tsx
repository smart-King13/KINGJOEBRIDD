import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Order, Payment, ApiResponse, User, Fulfillment } from '@/types/api';
import { formatMoney, formatDateTime, formatDate } from '@/lib/utils/format';
import { ProductionUpdatePanel } from '@/components/orders/ProductionUpdatePanel';
import { FulfillmentManagementPanel } from '@/components/orders/FulfillmentManagementPanel';

export const metadata = {
  title: 'Order Detail | Admin | KINGJOEBRIDD FASHION',
};

async function getOrder(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const res = await fetch(`${apiUrl}/api/v1/orders/${id}`, {
    headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) return null;
    throw new Error('Failed to fetch order');
  }

  const json = await res.json() as ApiResponse<Order>;
  return json.data;
}

async function getPayments(id: string, cookieHeader: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
    const res = await fetch(`${apiUrl}/api/v1/orders/${id}/payments`, {
      headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json() as ApiResponse<Payment[]>;
      return json.data;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

async function getFulfillment(id: string, cookieHeader: string) {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
    const res = await fetch(`${apiUrl}/api/v1/orders/${id}/fulfillment`, {
      headers: { 'Cookie': cookieHeader, 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (res.ok) {
      const json = await res.json() as ApiResponse<Fulfillment>;
      return json.data;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Removed isolated customer fetching as it's now eagerly loaded.
export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  if (!order) {
    notFound();
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  const payments = await getPayments(order.id, cookieHeader);
  const fulfillment = await getFulfillment(order.id, cookieHeader);
  const user = (order as any).user;

  const quote = order.snapshot.quote;

  const paymentColors: Record<string, string> = {
    pending_payment: 'text-[var(--color-ash)] border-[var(--color-ash)]',
    partially_paid: 'text-[var(--color-black)] border-[var(--color-black)] bg-[var(--color-black)]/5',
    paid_in_full: 'text-[var(--color-white)] bg-[var(--color-black)] border-[var(--color-black)]',
  };

  const productionSteps: Record<string, string> = {
    not_started: 'Not Started',
    cutting: 'Cutting',
    sewing: 'Sewing',
    finishing: 'Finishing',
    quality_check: 'Quality Check',
    ready: 'Ready'
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link href="/admin/orders" className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors uppercase">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-2">
          <h1 className="font-display text-3xl font-medium text-[var(--color-black)] uppercase">
            Order {order.id.split('-')[0]}
          </h1>
          <div className="flex gap-2">
            <span className={`inline-block text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase border ${paymentColors[order.payment_status] || 'border-[var(--color-light-ash)] text-[var(--color-ash)]'}`}>
              {order.payment_status.replace(/_/g, ' ')}
            </span>
            <span className="inline-block text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase border border-[var(--color-black)] text-[var(--color-black)]">
              {productionSteps[order.production_status] || order.production_status}
            </span>
          </div>
        </div>
        <p className="text-sm text-[var(--color-ash)]">
          Created on {formatDateTime(order.created_at)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Overview & Customer & Payment */}
        <div className="space-y-6">
          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] p-6 md:p-8">
            <h2 className="font-display text-xl text-[var(--color-black)] mb-4 uppercase tracking-widest border-b border-[var(--color-light-ash)] pb-4">
              Customer
            </h2>
            {user ? (
              <div className="space-y-2">
                <p className="font-medium text-[var(--color-black)]">{user.name}</p>
                <p className="text-sm text-[var(--color-ash)]">{user.email}</p>
                <Link href={`/admin/customers/${user.id}`} className="inline-block mt-2 text-xs tracking-widest text-[var(--color-black)] border-b border-[var(--color-black)] uppercase pb-0.5 hover:opacity-60 transition-opacity">
                  View Profile
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-ash)] italic">Unknown Customer ID: {order.user_id}</p>
            )}
          </div>

          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] p-6 md:p-8">
            <ProductionUpdatePanel 
              orderId={order.id} 
              currentStatus={order.production_status} 
              updates={order.production_updates || []} 
            />
          </div>

          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] p-6 md:p-8">
            <FulfillmentManagementPanel 
              orderId={order.id} 
              fulfillment={fulfillment} 
            />
          </div>
        </div>

        {/* Right Col - Order Details (Snapshot) & Payment History */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center border-b border-[var(--color-light-ash)] pb-4 mb-6">
                <h2 className="font-display text-xl text-[var(--color-black)] uppercase tracking-widest">
                  Order Details
                </h2>
                <Link href={`/admin/quotes/${order.quote_id}`} className="text-xs tracking-widest uppercase text-[var(--color-black)] hover:opacity-60">
                  View Source Quote
                </Link>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-ash)] mb-4">Items (Snapshot)</h3>
                  {quote?.items && quote.items.length > 0 ? (
                    <ul className="divide-y divide-[var(--color-light-ash)]">
                      {quote.items.map((item: any) => (
                        <li key={item.id} className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-[var(--color-black)]">{item.description}</p>
                            <p className="text-xs text-[var(--color-ash)] mt-1 uppercase tracking-wider">{item.type} &times; {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[var(--color-black)]">{formatMoney(item.total_price)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[var(--color-ash)] italic">Items unavailable in snapshot.</p>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--color-light-ash)]">
                  <div className="w-full sm:w-2/3 md:w-1/2 text-sm space-y-3">
                    <div className="flex justify-between text-[var(--color-ash)]">
                      <span>Subtotal</span>
                      <span>{formatMoney(quote?.subtotal || 0)}</span>
                    </div>
                    {quote?.discount > 0 && (
                      <div className="flex justify-between text-[var(--color-black)] font-bold">
                        <span>Discount</span>
                        <span>-{formatMoney(quote?.discount || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg text-[var(--color-black)] pt-3 border-t border-[var(--color-light-ash)]">
                      <span>Total</span>
                      <span>{formatMoney(quote?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)] overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="font-display text-xl text-[var(--color-black)] uppercase tracking-widest border-b border-[var(--color-light-ash)] pb-4 mb-6">
                Payment History
              </h2>
              
              {payments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm tracking-widest uppercase text-[var(--color-ash)]">No payments found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[var(--color-black)]/5 text-[var(--color-ash)]">
                      <tr>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-xs">Date</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-xs">Type</th>
                        <th className="px-4 py-3 font-bold uppercase tracking-widest text-xs">Ref/Provider</th>
                        <th className="px-4 py-3 text-right font-bold uppercase tracking-widest text-xs">Amount</th>
                        <th className="px-4 py-3 text-right font-bold uppercase tracking-widest text-xs">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-light-ash)]">
                      {payments.map(payment => (
                        <tr key={payment.id} className="hover:bg-[var(--color-black)]/5">
                          <td className="px-4 py-3 text-[var(--color-black)]">
                            {formatDateTime(payment.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="capitalize text-[var(--color-black)]">{payment.type}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[var(--color-black)]">{payment.provider_reference}</div>
                            <div className="text-[10px] text-[var(--color-ash)] uppercase tracking-wider">{payment.provider}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-[var(--color-black)]">
                            {formatMoney(payment.amount)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${payment.status === 'successful' ? 'bg-[var(--color-black)] text-white' : 'bg-[var(--color-ash)]/20 text-[var(--color-black)]'}`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
