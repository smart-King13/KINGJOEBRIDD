export type NotificationAction =
  | "view_conversation"
  | "view_quote"
  | "view_order";

export interface Notification {
  id: string;
  type: string;
  data: {
    title: string;
    message: string;
    action?: NotificationAction;
    action_id?: string;
    [key: string]: any;
  };
  read_at: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  status: "success";
  data: Notification[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
    unread_count: number;
  };
}

export interface NotificationMarkReadResponse {
  status: "success";
  message: string;
  data: Notification;
}

export interface NotificationMarkAllReadResponse {
  status: "success";
  message: string;
  data: {
    unread_count: number;
  };
}
