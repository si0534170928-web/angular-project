import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationMessage } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications {
  private notificationService = inject(NotificationService);

  get notifications(): NotificationMessage[] {
    return this.notificationService.notifications$();
  }

  onClose(id: string): void {
    this.notificationService.removeNotification(id);
  }
}