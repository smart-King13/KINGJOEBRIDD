'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notificationsApi } from '@/lib/api/notifications';
import { Notification } from '@/types/api/notifications';
import { EmptyState } from '@/components/ui/EmptyState';
import { buttonClasses } from '@/components/ui/Button';

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasUnread, setHasUnread] = useState(false);
  const router = useRouter();

  const fetchNotifications = async (currentPage: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await notificationsApi.getNotifications(currentPage, 15);
      setNotifications(res.data);
      setTotalPages(res.meta.pagination.total_pages);
      setHasUnread(res.meta.unread_count > 0);
    } catch (e: any) {
      setError(e.message || 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, [page]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllNotificationsAsRead();
      setHasUnread(false);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (e) {
      console.error('Failed to mark all as read', e);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      try {
        await notificationsApi.markNotificationAsRead(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n));
      } catch (e) {
        console.error('Failed to mark as read', e);
      }
    }

    if (notification.data.action && notification.data.action_id) {
      switch (notification.data.action) {
        case 'view_conversation':
          router.push(`/account/conversations/${notification.data.action_id}`);
          break;
        case 'view_quote':
          router.push(`/account/quotes/${notification.data.action_id}`);
          break;
        case 'view_order':
          router.push(`/account/orders/${notification.data.action_id}`);
          break;
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasUnread && (
            <span className="bg-[var(--color-black)] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
              Unread
            </span>
          )}
        </div>
        {hasUnread && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] rounded-lg px-4 py-2 hover:bg-[var(--color-black)] hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse p-6 bg-[var(--color-ash)]/5 flex gap-4">
              <div className="w-3 h-3 rounded-full bg-gray-200 mt-1 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 w-1/4" />
                <div className="h-3 bg-gray-200 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="You're all caught up."
          description="We'll let you know when there's something new."
        />
      ) : (
        <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-[var(--color-light-ash)]/40">
            {notifications.map((notification) => {
              const isUnread = !notification.read_at;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left p-6 transition-colors flex items-start gap-4 hover:bg-[var(--color-background-subtle)] ${
                    isUnread ? 'bg-[var(--color-background-subtle)]' : ''
                  }`}
                >
                  <div className="mt-1">
                    {isUnread ? (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-black)]"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-ash)]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className={`text-sm ${isUnread ? 'font-bold text-[var(--color-black)]' : 'font-medium text-[var(--color-black)]'}`}>
                        {notification.data.title}
                      </p>
                    </div>
                    <p className="text-sm text-[var(--color-ash)] mt-1">
                      {notification.data.message}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {getRelativeTime(notification.created_at)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className={buttonClasses({ variant: 'ghost', size: 'sm' })}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-[var(--color-black)]/60">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className={buttonClasses({ variant: 'ghost', size: 'sm' })}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
