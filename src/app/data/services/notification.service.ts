import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification, NotificationChannel } from '../../domain/models';

export interface CreateNotificationRequest {
  userId: string;
  incidentId?: string;
  channel: NotificationChannel;
  title: string;
  message: string;
}

export interface NotificationFilter {
  userId?: string;
  incidentId?: string;
  isRead?: boolean;
  channel?: NotificationChannel;
}

/**
 * RF6.3: Notification Service
 * Manages notifications for users about assignments and incident changes
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = `${environment.url}api/Notifications`;

  constructor(private http: HttpClient) { }

  /**
   * Get all notifications with optional filters
   */
  getAll(filter?: NotificationFilter): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, { params: filter as any });
  }

  /**
   * Get notifications for the current user
   */
  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/me`);
  }

  /**
   * Get unread notification count for the current user
   */
  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/me/unread/count`);
  }

  /**
   * Get notification by ID
   */
  getById(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new notification
   * Used to notify users about:
   * - Incident assignments
   * - Status changes
   * - New comments
   * - Priority/severity changes
   */
  create(request: CreateNotificationRequest): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, request);
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  /**
   * Mark all notifications as read for the current user
   */
  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/me/read-all`, {});
  }

  /**
   * Delete a notification
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Helper: Create notification for incident assignment
   */
  notifyAssignment(userId: string, incidentId: string, incidentTitle: string): Observable<Notification> {
    return this.create({
      userId,
      incidentId,
      channel: NotificationChannel.InApp,
      title: 'Nueva Asignación',
      message: `Se te ha asignado la incidencia: ${incidentTitle}`
    });
  }

  /**
   * Helper: Create notification for incident status change
   */
  notifyStatusChange(
    userId: string, 
    incidentId: string, 
    incidentTitle: string, 
    oldStatus: string, 
    newStatus: string
  ): Observable<Notification> {
    return this.create({
      userId,
      incidentId,
      channel: NotificationChannel.InApp,
      title: 'Cambio de Estado',
      message: `La incidencia "${incidentTitle}" cambió de ${oldStatus} a ${newStatus}`
    });
  }

  /**
   * Helper: Create notification for new comment
   */
  notifyComment(
    userId: string, 
    incidentId: string, 
    incidentTitle: string, 
    commenterName: string
  ): Observable<Notification> {
    return this.create({
      userId,
      incidentId,
      channel: NotificationChannel.InApp,
      title: 'Nuevo Comentario',
      message: `${commenterName} comentó en: ${incidentTitle}`
    });
  }
}
