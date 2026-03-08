import { Component, inject, input, output, effect, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddMemberDTO } from '../../teams.DTOs';
import { UsersService, UserLookupDTO } from '../../../../core/services/users.service';

@Component({
  selector: 'app-add-member-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-member-form.html',
  styleUrl: './add-member-form.css',
})
export class AddMemberForm implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  memberFormSubmitted = output<AddMemberDTO>();
  isLoading = input(false);
  
  users = signal<UserLookupDTO[]>([]);
  loadingUsers = signal(true);
  
  memberForm = this.fb.group({
    userId: ['', [Validators.required]],
  }, { nonNullable: true });

  constructor() {
    effect(() => {
      const userIdControl = this.memberForm.get('userId');
      this.isLoading() ? userIdControl?.disable() : userIdControl?.enable();
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingUsers.set(true);
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loadingUsers.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loadingUsers.set(false);
      }
    });
  }

  onSubmit() {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      this.memberFormSubmitted.emit({ userId: Number(formValue.userId) } as AddMemberDTO);
      this.memberForm.reset();
    }
  }

  getErrorMessage(): string {
    const control = this.memberForm.get('userId');
    if (control?.hasError('required')) return 'Please select a user';
    return '';
  }
}