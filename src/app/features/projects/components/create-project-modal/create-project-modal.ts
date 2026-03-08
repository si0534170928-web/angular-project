import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActionButton } from '../../../../shared/components/action-button/action-button';
import { CreateProjectDTO } from '../../projects.DTOs';

@Component({
  selector: 'app-create-project-modal',
  imports: [CommonModule, ReactiveFormsModule, ActionButton],
  templateUrl: './create-project-modal.html',
  styleUrl: './create-project-modal.css'
})
export class CreateProjectModal implements OnInit {
  @Input() isOpen = false;
  @Input() teamId!: number;
  @Input() teamName!: string;
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<CreateProjectDTO>();

  private fb = inject(FormBuilder);
  
  projectForm!: FormGroup;
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
    });
  }

  get formControls() {
    return this.projectForm.controls;
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const projectData: CreateProjectDTO = {
        teamId: this.teamId,
        name: this.projectForm.value.name.trim(),
        description: this.projectForm.value.description?.trim() || ''
      };

      this.projectCreated.emit(projectData);
    }
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.resetForm();
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  resetForm(): void {
    this.projectForm.reset();
    this.isSubmitting = false;
  }

  setSubmitting(value: boolean): void {
    this.isSubmitting = value;
  }
}