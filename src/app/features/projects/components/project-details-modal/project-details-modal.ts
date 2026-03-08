import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../projects.DTOs';
import { ActionButton } from '../../../../shared/components/action-button/action-button';

@Component({
  selector: 'app-project-details-modal',
  imports: [CommonModule, ActionButton],
  templateUrl: './project-details-modal.html',
  styleUrl: './project-details-modal.css'
})
export class ProjectDetailsModal {
  @Input() isOpen = false;
  @Input() project: Project | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() seeTasks = new EventEmitter<Project>();

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSeeTasks(): void {
    if (this.project) {
      this.seeTasks.emit(this.project);
    }
  }
}