'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notificationsApi } from '@/lib/api/notifications';
import { Notification } from '@/types/api/notifications';
import { Bell, Check, Clock, ChevronRight } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setIsLoading(true);
      const response = await notificationsApi.getNotifications(1, 50);
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await notificationsApi.markAllNotificationsAsRead();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await notificationsApi.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-[var(--color-white)] rounded-2xl"></div>
          <div className="h-24 bg-[var(--color-white)] rounded-2xl"></div>
          <div className="h-24 bg-[var(--color-white)] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <span className="bg-[var(--color-black)] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
              {unreadCount} Unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-[10px] font-bold tracking-widest uppercase border border-[var(--color-black)] rounded-lg px-4 py-2 hover:bg-[var(--color-black)] hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-[var(--color-white)] border border-[var(--color-light-ash)]/60 rounded-2xl overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center text-[var(--color-ash)]">
            <Bell className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm">You have no notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-light-ash)]/40">
            {notifications.map((notification) => {
              const isUnread = !notification.read_at;
              const { title, message, action, action_id } = notification.data;
              
              let href = '#';
              if (action === 'view_conversation' && action_id) href = `/admin/requests/${action_id}`;
              else if (action === 'view_quote' && action_id) href = `/admin/quotes/${action_id}`;
              else if (action === 'view_order' && action_id) href = `/admin/orders/${action_id}`;

              return (
                <div 
                  key={notification.id} 
                  className={`p-6 transition-colors flex items-start gap-4 ${isUnread ? 'bg-[var(--color-background-subtle)]' : 'hover:bg-[var(--color-background-subtle)]'}`}
                >
                  <div className="mt-1">
                    {isUnread ? (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-black)]"></div>
                    ) : (
                      <Check className="w-4 h-4 text-[var(--color-ash)]" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-sm ${isUnread ? 'font-bold text-[var(--color-black)]' : 'font-medium text-[var(--color-black)]'}`}>
                      {title}
                    </h3>
                    <p className="text-sm text-[var(--color-ash)] mt-1">{message}</p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {href !== '#' && (
                      <Link 
                        href={href}
                        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[var(--color-black)] hover:text-[var(--color-ash)] transition-colors"
                      >
                        View Details <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                    {isUnread && (
                      <button 
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-[10px] font-medium text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
