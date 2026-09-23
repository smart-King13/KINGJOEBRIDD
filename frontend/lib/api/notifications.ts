import { apiClient } from './apiClient';
import {
  NotificationListResponse,
  NotificationMarkReadResponse,
  NotificationMarkAllReadResponse
} from '@/types/api/notifications';

export const notificationsApi = {
  /**
   * Fetch a paginated list of notifications.
   * @param page Current page
   * @param perPage Notifications per page
   */
  getNotifications: (page: number = 1, perPage: number = 15) => {
    return apiClient<NotificationListResponse>(`/notifications?page=${page}&per_page=${perPage}`);
  },

  /**
   * Mark a specific notification as read.
   * @param id The notification UUID
   */
  markNotificationAsRead: (id: string) => {
    return apiClient<NotificationMarkReadResponse>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Mark all unread notifications as read.
   */
  markAllNotificationsAsRead: () => {
    return apiClient<NotificationMarkAllReadResponse>('/notifications/read-all', {
      method: 'POST',
    });
  }
};
