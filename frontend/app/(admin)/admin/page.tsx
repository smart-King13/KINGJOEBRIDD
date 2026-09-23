'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/apiClient';
import { StyleRequest, Order, PaginatedResponse } from '@/types/api';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Clock, MessageSquare, Ruler, FileText, ShoppingBag } from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    pendingRequests: 0,
    unreadConversations: 0,
    measurementsToReview: 0,
    pendingQuotes: 0,
    activeOrders: 0,
  });

  const [recentRequests, setRecentRequests] = useState<StyleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch lightweight counts using per_page=1 to extract meta.total
        const [
          requestsRes,
          ordersRes
        ] = await Promise.all([
          apiClient<PaginatedResponse<StyleRequest>>('/style-requests?status=pending&per_page=5'),
          apiClient<PaginatedResponse<Order>>('/orders?production_status=sewing,cutting,finishing,quality_check&per_page=1')
        ]);

        // In a real app we'd fetch specific counts, but we use the general ones for now to avoid breaking contracts
        const pendingReqTotal = requestsRes?.meta?.total || (Array.isArray(requestsRes.data) ? requestsRes.data.length : 0);
        const activeOrdersTotal = ordersRes?.meta?.total || (Array.isArray(ordersRes.data) ? ordersRes.data.length : 0);

        setMetrics({
          pendingRequests: pendingReqTotal,
          unreadConversations: 0, // Fallback for aesthetic if no endpoint
          measurementsToReview: 0,
          pendingQuotes: 0,
          activeOrders: activeOrdersTotal,
        });

        // Use the first 5 requests as recent activity
        if (requestsRes.data && Array.isArray(requestsRes.data)) {
          setRecentRequests(requestsRes.data.slice(0, 5));
        }

      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      {/* Attention / Customer Operations */}
      <section>
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-4">
          Attention / Customer Operations
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/requests" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
            {/* Background Icon Overlay */}
            <Clock className="absolute -bottom-4 -right-4 w-32 h-32 text-[var(--color-ash)] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--color-black)] flex items-center justify-center shadow-md">
                <Clock className="w-4 h-4 text-white" />
              </div>
              {isLoading ? (
                <div className="w-8 h-8 bg-[var(--color-light-ash)]/50 animate-pulse rounded-lg" />
              ) : (
                <span className="font-display text-4xl text-[var(--color-black)]">{metrics.pendingRequests}</span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Pending Requests</h3>
            </div>
          </Link>
          
          <Link href="/admin/conversations" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
            {/* Background Icon Overlay */}
            <MessageSquare className="absolute -bottom-4 -right-4 w-32 h-32 text-[var(--color-ash)] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--color-black)] flex items-center justify-center shadow-md">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              {isLoading ? (
                <div className="w-8 h-8 bg-[var(--color-light-ash)]/50 animate-pulse rounded-lg" />
              ) : (
                <span className="font-display text-4xl text-[var(--color-black)]">{metrics.unreadConversations}</span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Conversations</h3>
            </div>
          </Link>

          <Link href="/admin/measurements" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
            {/* Background Icon Overlay */}
            <Ruler className="absolute -bottom-4 -right-4 w-32 h-32 text-[var(--color-ash)] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--color-black)] flex items-center justify-center shadow-md">
                <Ruler className="w-4 h-4 text-white" />
              </div>
              {isLoading ? (
                <div className="w-8 h-8 bg-[var(--color-light-ash)]/50 animate-pulse rounded-lg" />
              ) : (
                <span className="font-display text-4xl text-[var(--color-black)]">{metrics.measurementsToReview}</span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Measurements</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Order Operations */}
      <section>
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-4">
          Order Operations
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/quotes" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
            {/* Background Icon Overlay */}
            <FileText className="absolute -bottom-4 -right-4 w-32 h-32 text-[var(--color-ash)] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--color-black)] flex items-center justify-center shadow-md">
                <FileText className="w-4 h-4 text-white" />
              </div>
              {isLoading ? (
                <div className="w-8 h-8 bg-[var(--color-light-ash)]/50 animate-pulse rounded-lg" />
              ) : (
                <span className="font-display text-4xl text-[var(--color-black)]">{metrics.pendingQuotes}</span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Quotes Awaiting Reply</h3>
            </div>
          </Link>

          <Link href="/admin/orders" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
            {/* Background Icon Overlay */}
            <ShoppingBag className="absolute -bottom-4 -right-4 w-32 h-32 text-[var(--color-ash)] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--color-black)] flex items-center justify-center shadow-md">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              {isLoading ? (
                <div className="w-8 h-8 bg-[var(--color-light-ash)]/50 animate-pulse rounded-lg" />
              ) : (
                <span className="font-display text-4xl text-[var(--color-black)]">{metrics.activeOrders}</span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Active Orders</h3>
              <p className="text-[10px] text-[var(--color-ash)] mt-1 tracking-[0.1em] uppercase">Production & Fulfillment</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">
            Recent Activity
          </div>
          <Link href="/admin/requests" className="text-xs tracking-widest uppercase text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors border-b border-transparent hover:border-[var(--color-black)]">
            View All
          </Link>
        </div>
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-[var(--color-ash)] text-sm animate-pulse">Loading recent activity...</div>
          ) : recentRequests.length === 0 ? (
            <div className="p-16 text-center text-[var(--color-ash)] text-sm uppercase tracking-widest">No recent activity found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                  {recentRequests.map(req => (
                    <tr key={req.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--color-black)]">{req.user?.name || 'Customer'}</div>
                        <div className="text-[var(--color-ash)] text-[10px] mt-1 uppercase tracking-widest">New Style Request</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/requests/${req.id}`} className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      
    </div>
  );
}
