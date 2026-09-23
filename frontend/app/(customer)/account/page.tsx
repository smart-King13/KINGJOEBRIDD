'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { ShoppingBag, FileText, MessageCircle, Clock, Inbox, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { Order, Quote, PaginatedResponse, Conversation, StyleRequest } from '@/types/api';

function timeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type ActivityItem = {
  id: string;
  type: 'order' | 'quote' | 'conversation' | 'request';
  title: string;
  dateStr: string;
  dateObj: Date;
  status: string;
};

export default function AccountOverview() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    pendingQuotes: 0,
    unreadMessages: 0,
    pendingRequests: 0,
  });

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [ordersRes, quotesRes, requestsRes, conversationsRes] = await Promise.all([
          apiClient<PaginatedResponse<Order>>('/orders?page=1&per_page=5'),
          apiClient<PaginatedResponse<Quote>>('/quotes?page=1&per_page=5'),
          apiClient<PaginatedResponse<StyleRequest>>('/style-requests?page=1&per_page=5'),
          apiClient<PaginatedResponse<Conversation>>('/conversations?page=1&per_page=5'),
        ]);

        // Aggregate counts (we rely on the backend paginated total)
        // For accurate metrics in a real app, you'd use exact status filters. We'll use the total for now.
        const activeOrders = ordersRes?.meta?.total || (Array.isArray(ordersRes?.data) ? ordersRes.data.length : 0);
        const pendingQuotes = quotesRes?.meta?.total || (Array.isArray(quotesRes?.data) ? quotesRes.data.length : 0);
        const pendingRequests = requestsRes?.meta?.total || (Array.isArray(requestsRes?.data) ? requestsRes.data.length : 0);
        
        // For unread messages, if conversation has an 'unread_count' we could sum it. 
        // For now, we just count total active conversations.
        const unreadMessages = conversationsRes?.meta?.total || (Array.isArray(conversationsRes?.data) ? conversationsRes.data.length : 0);

        setMetrics({ activeOrders, pendingQuotes, pendingRequests, unreadMessages });

        // Build Activity Feed
        let activities: ActivityItem[] = [];

        if (Array.isArray(ordersRes?.data)) {
          ordersRes.data.forEach(order => {
            activities.push({
              id: `order-${order.id}`,
              type: 'order',
              title: `Order ${order.id.split('-')[0]} placed`,
              dateObj: new Date(order.created_at),
              dateStr: timeAgo(order.created_at),
              status: order.production_status.replace('_', ' '),
            });
          });
        }

        if (Array.isArray(quotesRes?.data)) {
          quotesRes.data.forEach(quote => {
            activities.push({
              id: `quote-${quote.id}`,
              type: 'quote',
              title: `Quote prepared for you`,
              dateObj: new Date(quote.created_at),
              dateStr: timeAgo(quote.created_at),
              status: quote.status,
            });
          });
        }

        if (Array.isArray(requestsRes?.data)) {
          requestsRes.data.forEach(req => {
            activities.push({
              id: `req-${req.id}`,
              type: 'request',
              title: req.description ? req.description.substring(0, 30) + '...' : `Style Request submitted`,
              dateObj: new Date(req.created_at),
              dateStr: timeAgo(req.created_at),
              status: req.status,
            });
          });
        }

        if (Array.isArray(conversationsRes?.data)) {
          conversationsRes.data.forEach(conv => {
            activities.push({
              id: `conv-${conv.id}`,
              type: 'conversation',
              title: `Conversation regarding ${conv.context_type.replace('_', ' ')}`,
              dateObj: new Date(conv.updated_at || conv.created_at),
              dateStr: timeAgo(conv.updated_at || conv.created_at),
              status: 'Active',
            });
          });
        }

        // Sort by newest first and take top 5
        activities.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
        setRecentActivity(activities.slice(0, 5));

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-12">
      
      {/* Welcome Section */}
      <section className="mb-12">
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-black)]">
          Welcome back, {user?.name?.split(' ')[0] || 'Client'}.
        </h1>
        <p className="mt-3 text-lg text-[var(--color-ash)] font-light">
          Your bespoke journey, elegantly summarized.
        </p>
      </section>

      {/* Action / Attention */}
      <section>
        <div className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase mb-4">
          Pending Actions
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/account/orders" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
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
            </div>
          </Link>
          
          <Link href="/account/quotes" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
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
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Pending Quotes</h3>
            </div>
          </Link>

          <Link href="/account/requests" className="relative overflow-hidden group border border-[var(--color-light-ash)]/60 bg-[var(--color-white)] p-6 hover:shadow-lg hover:border-[var(--color-light-ash)] transition-all duration-500 flex flex-col justify-between h-40 rounded-[2rem]">
            {/* Background Icon Overlay */}
            <Inbox className="absolute -bottom-4 -right-4 w-32 h-32 text-[var(--color-ash)] opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="w-10 h-10 rounded-full bg-[var(--color-black)] flex items-center justify-center shadow-md">
                <Inbox className="w-4 h-4 text-white" />
              </div>
              {isLoading ? (
                <div className="w-8 h-8 bg-[var(--color-light-ash)]/50 animate-pulse rounded-lg" />
              ) : (
                <span className="font-display text-4xl text-[var(--color-black)]">{metrics.pendingRequests}</span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-[var(--color-black)]">Style Requests</h3>
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
          <Link href="/account/orders" className="text-xs tracking-widest uppercase text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors border-b border-transparent hover:border-[var(--color-black)]">
            View All
          </Link>
        </div>
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-[var(--color-ash)] flex flex-col items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mb-4 text-[var(--color-light-ash)]" />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase">Syncing your journey...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="p-16 text-center">
              <Clock className="w-8 h-8 text-[var(--color-light-ash)] mx-auto mb-4" />
              <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-ash)] uppercase">No recent activity</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-[var(--color-light-ash)]/40">
                  {recentActivity.map(activity => (
                    <tr key={activity.id} className="hover:bg-[var(--color-background-subtle)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center shrink-0">
                            {activity.type === 'order' && <ShoppingBag className="w-4 h-4 text-[var(--color-ash)]" />}
                            {activity.type === 'quote' && <FileText className="w-4 h-4 text-[var(--color-ash)]" />}
                            {activity.type === 'request' && <Inbox className="w-4 h-4 text-[var(--color-ash)]" />}
                            {activity.type === 'conversation' && <MessageCircle className="w-4 h-4 text-[var(--color-ash)]" />}
                          </div>
                          <div>
                            <div className="font-medium text-[var(--color-black)]">{activity.title}</div>
                            <div className="text-[var(--color-ash)] text-[10px] mt-1 uppercase tracking-widest">{activity.dateStr}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--color-background-subtle)] text-[var(--color-black)]">
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/account/${activity.type}s`} className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-light-ash)] rounded-lg px-4 py-2 hover:border-[var(--color-black)] hover:text-[var(--color-black)] text-[var(--color-ash)] transition-colors inline-block">
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
