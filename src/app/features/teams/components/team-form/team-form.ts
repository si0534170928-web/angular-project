import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface CreateTeamDTO {
  name: string;
}

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './team-form.html',
  styleUrl: './team-form.css',
})
export class TeamForm {
  private fb = inject(FormBuilder);
  teamFormSubmitted = output<CreateTeamDTO>();
  isLoading = input(false);
  
  teamForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
  }, { nonNullable: true });

  constructor() {
    effect(() => {
      const nameControl = this.teamForm.get('name');
      this.isLoading() ? nameControl?.disable() : nameControl?.enable();
    });
  }

  onSubmit() {
    if (this.teamForm.valid) {
      this.teamFormSubmitted.emit(this.teamForm.value as CreateTeamDTO);
      this.teamForm.reset();
    }
  }

  getErrorMessage(): string {
    const control = this.teamForm.get('name');
    if (control?.hasError('required')) return 'Team name is required';
    if (control?.hasError('minlength')) return 'Team name must be at least 3 characters';
    if (control?.hasError('maxlength')) return 'Team name cannot exceed 50 characters';
    return '';
  }
}
