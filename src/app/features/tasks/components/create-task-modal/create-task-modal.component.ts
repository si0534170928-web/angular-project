import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TasksService } from '../../tasks.service';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.css'
})
export class CreateTaskModalComponent {
  // Input signals
  isOpen = input<boolean>(false);
  projectId = input.required<number>();
  
  // Output signals
  close = output<void>();
  taskCreated = output<void>();
  
  // Form data signals
  title = signal('');
  description = signal('');
  priority = signal<'low' | 'normal' | 'high'>('normal');
  status = signal<'todo' | 'in_progress' | 'done'>('todo');
  dueDate = signal<Date | null>(null);
  isSubmitting = signal(false);

  // Options
  priorities = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' }
  ] as const;

  statuses = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' }
  ] as const;

  constructor(private tasksService: TasksService) {}

  onSubmit() {
    if (!this.title().trim() || this.isSubmitting()) return;
    
    this.isSubmitting.set(true);
    
    const taskData = {
      projectId: this.projectId(),
      title: this.title().trim(),
      description: this.description().trim(),
      priority: this.priority(),
      status: this.status(),
      dueDate: this.dueDate() ? this.dueDate()!.toISOString().split('T')[0] : undefined
    };

    this.tasksService.createTask(taskData);
    this.resetForm();
    this.taskCreated.emit();
    this.close.emit();
  }

  onCancel() {
    this.resetForm();
    this.close.emit();
  }

  private resetForm() {
    this.title.set('');
    this.description.set('');
    this.priority.set('normal');
    this.status.set('todo');
    this.dueDate.set(null);
    this.isSubmitting.set(false);
  }

  isFormValid(): boolean {
    return this.title().trim().length >= 3;
  }
}