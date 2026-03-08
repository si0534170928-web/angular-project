import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<NotificationMessage[]>([]);

  get notifications$(): () => NotificationMessage[] {
    return this.notifications.asReadonly();
  }

  success(message: string, duration: number = 3000): void {
    this.addNotification(message, 'success', duration);
  }

  error(message: string, duration: number = 5000): void {
    this.addNotification(message, 'error', duration);
  }

  warning(message: string, duration: number = 4000): void {
    this.addNotification(message, 'warning', duration);
  }

  info(message: string, duration: number = 3000): void {
    this.addNotification(message, 'info', duration);
  }

  private addNotification(message: string, type: NotificationMessage['type'], duration: number): void {
    const notification: NotificationMessage = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      duration
    };

    this.notifications.update(notifications => [...notifications, notification]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  removeNotification(id: string): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}