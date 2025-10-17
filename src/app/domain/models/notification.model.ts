export enum NotificationChannel {
  InApp = 'InApp',
  Email = 'Email',
  Webhook = 'Webhook'
}

export interface Notification {
  id: string; // Guid
  userId: string; // Guid
  user: any; // User reference
  incidentId?: string; // Guid
  incident?: any; // Incident reference
  channel: NotificationChannel;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}
