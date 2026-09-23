import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Order, PaginatedResponse, ApiResponse, User } from '@/types/api';
import { formatMoney, formatDateTime, formatDate } from '@/lib/utils/format';
import { Package } from 'lucide-react';

export const metadata = {
  title: 'Orders | Admin | KINGJOEBRIDD FASHION',
};

async function getOrders(page: number = 1) {
  const cookieStore = await cookies();
  const token = cookieStore.get('kb_session')?.value;
  
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000').replace('localhost', '127.0.0.1');
  const headers: HeadersInit = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${apiUrl}/api/v1/orders?page=${page}`, {
    headers,
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403 || res.status === 404) return null;
    throw new Error('Failed to fetch orders');
  }

  const json = await res.json() as PaginatedResponse<Order>;
  return json;
}

// Removed isolated customer fetching as it's now eagerly loaded.
export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const response = await getOrders(page);

  if (!response) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-medium tracking-widest text-[var(--color-black)] uppercase">Orders</h1>
        <div className="p-4 bg-red-50 text-red-600 border border-red-200">
          Failed to load orders. Ensure you have admin privileges.
        </div>
      </div>
    );
  }

  const orders = response.data;
  const paymentColors: Record<string, string> = {
    pending_payment: 'text-[var(--color-ash)]',
    partially_paid: 'text-[var(--color-black)] font-bold',
    paid_in_full: 'text-[var(--color-black)] font-bold bg-[var(--color-black)]/5 px-2 py-1',
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
    <div className="space-y-6">

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {orders.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <Package className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm uppercase tracking-widest">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--color-background-subtle)] text-[var(--color-ash)] border-b border-[var(--color-light-ash)]/40">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Order ID</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Customer</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Payment</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Production</th>
                  <th className="px-6 py-4 text-right font-medium uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                {orders.map((order) => {
                  const user = (order as any).user;
                  const total = order.snapshot?.quote?.total || 0;
                  
                  return (
                    <tr key={order.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--color-black)] mb-1">{order.id.split('-')[0].toUpperCase()}</div>
                        <div className="text-[11px] uppercase tracking-wider text-[var(--color-ash)]">{formatDate(order.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {user ? (
                          <div>
                            <div className="font-medium text-[var(--color-black)] mb-1">{user.name}</div>
                            <div className="text-[11px] text-[var(--color-ash)]">{user.email}</div>
                          </div>
                        ) : (
                          <span className="text-[var(--color-ash)] text-xs italic">Unknown Customer</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="mb-1">{formatMoney(total)}</div>
                        <div className={`text-[10px] uppercase tracking-widest ${paymentColors[order.payment_status] || 'text-[var(--color-ash)]'}`}>
                          {order.payment_status.replace(/_/g, ' ')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest border border-[var(--color-light-ash)] bg-[var(--color-white)] rounded-lg px-2 py-1 w-fit text-[var(--color-black)] shadow-sm">
                          {productionSteps[order.production_status] || order.production_status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 text-[var(--color-ash)] hover:text-[var(--color-black)] hover:border-[var(--color-black)] transition-colors inline-block"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {response.meta && response.meta.last_page > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Link
            href={`/admin/orders?page=${page - 1}`}
            className={`text-xs font-bold uppercase tracking-widest border border-[var(--color-black)] px-4 py-2 ${page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--color-black)] hover:text-white transition-colors'}`}
          >
            Previous
          </Link>
          <span className="text-xs text-[var(--color-ash)] tracking-widest uppercase">
            Page {response.meta.current_page} of {response.meta.last_page}
          </span>
          <Link
            href={`/admin/orders?page=${page + 1}`}
            className={`text-xs font-bold uppercase tracking-widest border border-[var(--color-black)] px-4 py-2 ${page >= response.meta.last_page ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--color-black)] hover:text-white transition-colors'}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
