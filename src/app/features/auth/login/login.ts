import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { loginDTO, type RegisterDTO } from '../auth.DTOs';
import { AuthForm } from '../auth-form/auth-form';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [AuthForm, RouterLink, CommonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);
  
  isLoading = signal(false);
  errorMessage = signal<string>('');
  
  onSubmit(form: loginDTO) {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.service.login(form).subscribe({
      next: (res) => {
        console.log('Login successful', res);
        this.isLoading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Login error:', err);
        
        // Provide user-friendly error messages
        if (err.status === 401) {
          this.errorMessage.set('Invalid email or password. Please try again.');
        } else if (err.status === 404) {
          this.errorMessage.set('Email address not found. Please check your email or register for a new account.');
        } else if (err.status === 400) {
          this.errorMessage.set('Please provide valid email and password.');
        } else {
          this.errorMessage.set('Login failed. Please try again later.');
        }
      }
    });
  }
}
