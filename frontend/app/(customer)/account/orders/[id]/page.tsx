import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Order, Fulfillment, ApiResponse } from '@/types/api';
import { formatMoney, formatDateTime, formatDate } from '@/lib/utils/format';
import { buttonClasses } from '@/components/ui/Button';

export const metadata = {
  title: 'Order Detail | KINGJOEBRIDD FASHION',
};

async function getOrderData(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
  
  const headers = { 'Cookie': cookieHeader, 'Accept': 'application/json' };

  // Fetch Order
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const orderRes = await fetch(`${apiUrl}/api/v1/orders/${id}`, {
    headers,
    cache: 'no-store'
  });

  if (!orderRes.ok) {
    if (orderRes.status === 401 || orderRes.status === 404) return { order: null, fulfillment: null };
    throw new Error('Failed to fetch order');
  }

  const orderJson = await orderRes.json() as ApiResponse<Order>;
  const order = orderJson.data;

  // Fetch Fulfillment (gracefully handling 404)
  let fulfillment: Fulfillment | null = null;
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
    const fulfillRes = await fetch(`${apiUrl}/api/v1/orders/${id}/fulfillment`, {
      headers,
      cache: 'no-store'
    });
    if (fulfillRes.ok) {
      const fulfillJson = await fulfillRes.json() as ApiResponse<Fulfillment>;
      fulfillment = fulfillJson.data;
    }
  } catch (e) {
    // ignore
  }

  return { order, fulfillment };
}

const paymentLabels: Record<string, string> = {
  pending_payment: 'Payment Pending',
  partially_paid: 'Partially Paid',
  paid_in_full: 'Paid in Full',
};

const paymentColors: Record<string, string> = {
  pending_payment: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  partially_paid: 'bg-blue-50 text-blue-800 border-blue-200',
  paid_in_full: 'bg-green-50 text-green-700 border-green-200',
};

import { ProductionTimeline } from '@/components/orders/ProductionTimeline';
import { FulfillmentTimeline } from '@/components/orders/FulfillmentTimeline';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { order, fulfillment } = await getOrderData(params.id);

  if (!order) {
    notFound();
  }

  const quote = order.snapshot.quote;
  
  // Handled inside components
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <Link href="/account/orders" className="inline-flex items-center text-xs tracking-widest text-[var(--color-ash)] hover:text-[var(--color-black)] mb-6 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO ORDERS
        </Link>
        
        <div className="flex flex-col mb-2">
          <h1 className="font-display text-3xl md:text-4xl font-medium text-[var(--color-black)] uppercase mb-2">
            Order {order.id.split('-')[0]}
          </h1>
          <p className="text-sm text-[var(--color-ash)]">
            Created on {formatDateTime(order.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline & Fulfillment */}
        <div className="lg:col-span-1 space-y-8 order-2 lg:order-1">
          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 p-6 md:p-8">
             <ProductionTimeline currentStatus={order.production_status} updates={order.production_updates || []} />
             <FulfillmentTimeline fulfillment={fulfillment} />
          </div>
        </div>
        
        {/* Right Column: Payment & Details */}
        <div className="lg:col-span-2 space-y-8 order-1 lg:order-2">
          
          {/* PAYMENT */}
          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-[var(--color-ash)]/20 pb-4 gap-4">
              <h2 className="font-display text-xl text-[var(--color-black)] uppercase tracking-widest">
                Payment
              </h2>
              <span className={`inline-block text-xs font-bold tracking-widest px-4 py-2 uppercase border ${paymentColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                {paymentLabels[order.payment_status] || order.payment_status}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div>
                <p className="text-[var(--color-ash)] text-sm mb-1">Order Total</p>
                <p className="text-3xl font-display text-[var(--color-black)]">{formatMoney(quote?.total || 0)}</p>
              </div>
              
              {order.payment_status !== 'paid_in_full' && (
                <Link 
                  href={`/account/orders/${order.id}/pay`}
                  className={buttonClasses({ variant: 'primary', size: 'lg', className: 'w-full sm:w-auto text-center' })}
                >
                  MAKE PAYMENT
                </Link>
              )}
            </div>
          </div>

          {/* ORDER DETAILS (Snapshot) */}
          <div className="bg-[var(--color-white)] border border-[var(--color-ash)]/20 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="font-display text-xl text-[var(--color-black)] mb-6 uppercase tracking-widest border-b border-[var(--color-ash)]/20 pb-4">
                Order Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  {quote?.items && quote.items.length > 0 ? (
                    <ul className="divide-y divide-[var(--color-ash)]/20">
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
                    <p className="text-sm text-[var(--color-ash)]">Items unavailable in snapshot.</p>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--color-ash)]/20">
                  <div className="w-full sm:w-1/2 text-sm space-y-3">
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
                    <div className="flex justify-between font-bold text-lg text-[var(--color-black)] pt-3 border-t border-[var(--color-ash)]/20">
                      <span>Total</span>
                      <span>{formatMoney(quote?.total || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
