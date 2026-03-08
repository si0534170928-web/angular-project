import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Comment, CreateCommentDTO } from './comments.DTOs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private api = inject(ApiService);
  private notifications = inject(NotificationService);

  private _comments = signal<Comment[]>([]);
  comments = this._comments.asReadonly();

  loadComments(taskId: number): void {
    this.api.get<Comment[]>(`/comments?taskId=${taskId}`).subscribe({
      next: (comments) => this._comments.set(comments),
      error: () => {} // handled by interceptor
    });
  }

  addComment(data: CreateCommentDTO): void {
    this.api.post<Comment, CreateCommentDTO>('/comments', data).subscribe({
      next: (comment) => {
        this._comments.update(list => [...list, comment]);
        this.notifications.success('Your comment was added.');
      },
      error: () => {} // handled by interceptor
    });
  }

  clearComments(): void {
    this._comments.set([]);
  }
}
