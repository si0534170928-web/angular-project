import { Component, effect, inject, input, signal, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { TasksService } from '../../tasks.service';
import { CommentsService } from '../../comments.service';
import { UsersService, UserLookupDTO } from '../../../../core/services/users.service';
import { Task, UpdateTaskDTO } from '../../tasks.DTOs';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetail {
  // Route params via input()
  id = input.required<string>();       // projectId
  taskId = input.required<string>();   // taskId

  private router = inject(Router);
  private tasksService = inject(TasksService);
  private commentsService = inject(CommentsService);
  private usersService = inject(UsersService);

  // State signals
  task = signal<Task | undefined>(undefined);
  users = signal<UserLookupDTO[]>([]);
  isLoading = signal(true);
  showDeleteConfirm = signal(false);
  newComment = signal('');
  
  // ViewChild for scroll target
  @ViewChild('commentsBottom') commentsBottom!: ElementRef;

  // Expose comments from service
  comments = this.commentsService.comments;

  readonly statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ];

  constructor() {
    effect(() => {
      const taskId = Number(this.taskId());
      if (taskId) {
        this.loadData(taskId);
      }
    });
  }

  private loadData(taskId: number) {
    this.isLoading.set(true);
    this.commentsService.clearComments();

    // Load tasks, comments, and users
    this.tasksService.loadAllTasksAndFind(taskId).subscribe({
      next: (task) => {
        this.task.set(task);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });

    this.commentsService.loadComments(taskId);
    this.usersService.getAllUsers().subscribe(users => this.users.set(users));
  }

  onStatusChange(newStatus: string) {
    const taskId = Number(this.taskId());
    this.tasksService.updateTask(taskId, { status: newStatus as UpdateTaskDTO['status'] });
    this.task.update(t => t ? { ...t, status: newStatus as Task['status'] } : t);
  }

  onAssigneeChange(userId: number) {
    const taskId = Number(this.taskId());
    this.tasksService.updateTask(taskId, { assignee_id: userId });
    this.task.update(t => t ? { ...t, assignee_id: userId } : t);
  }

  onDeleteClick() {
    this.showDeleteConfirm.set(true);
  }

  onConfirmDelete() {
    this.tasksService.deleteTask(Number(this.taskId()));
    this.router.navigate(['/projects', this.id()]);
  }

  onCancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  onSubmitComment() {
    const body = this.newComment().trim();
    if (!body) return;
    this.commentsService.addComment({ taskId: Number(this.taskId()), body });
    this.newComment.set('');
    
    // Scroll to new comment after Angular renders it
    setTimeout(() => {
      this.commentsBottom?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  goBack() {
    this.router.navigate(['/projects', this.id()]);
  }

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = { high: 'warn', normal: 'primary', low: 'accent' };
    return map[priority] ?? 'primary';
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getAssigneeName(assigneeId: number | undefined): string {
    if (!assigneeId) return 'Unassigned';
    return this.users().find(u => u.id === assigneeId)?.name ?? 'Unknown';
  }
  
  getAuthorInitials(authorName: string): string {
    if (!authorName) return '?';
    const names = authorName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
}
