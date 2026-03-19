export type AlertLevel = 'info' | 'success' | 'warning' | 'error' | 'urgent';
export type NotificationChannel = 'in_app' | 'email' | 'sms';

export interface Notification {
  id: string;
  title: string;
  message: string;
  level: AlertLevel;
  channel: NotificationChannel;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ToastNotification {
  id: string;
  title: string;
  message?: string;
  level: AlertLevel;
  duration?: number;
}
