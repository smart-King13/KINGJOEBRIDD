'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { notificationsApi } from '@/lib/api/notifications';
import { Notification } from '@/types/api/notifications';
import { useRouter } from 'next/navigation';

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.getNotifications(1, 5); // Fetch top 5 for the dropdown
      setNotifications(res.data);
      setUnreadCount(res.meta.unread_count);
    } catch (e) {
      // Silently fail if notifications cannot be fetched (e.g., due to auth token expiration)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await notificationsApi.markAllNotificationsAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (e) {
      console.error('Failed to mark all as read', e);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false);

    if (!notification.read_at) {
      try {
        await notificationsApi.markNotificationAsRead(notification.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--color-black)]/80 hover:text-[var(--color-black)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-black)] focus:ring-offset-2 rounded-full"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-black)] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm tracking-widest text-[var(--color-black)]">NOTIFICATIONS</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-[var(--color-ash)] hover:text-[var(--color-black)] transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-gray-200 mt-2 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500">You're all caught up.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => {
                  const isUnread = !notification.read_at;
                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                        isUnread ? 'bg-[var(--color-white)]/30' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isUnread ? 'bg-[var(--color-black)]' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isUnread ? 'font-bold text-[var(--color-black)]' : 'font-medium text-gray-600'}`}>
                          {notification.data.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">
                          {notification.data.message}
                        </p>
                        <p className="text-xs text-[var(--color-ash)] mt-1">
                          {getRelativeTime(notification.created_at)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
            <Link 
              href="/account/notifications" 
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-[var(--color-black)] hover:opacity-70 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
