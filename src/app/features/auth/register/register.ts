import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterDTO } from '../auth.DTOs';
import { AuthForm } from '../auth-form/auth-form';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-register',
    imports: [AuthForm, CommonModule, MatIconModule],
    templateUrl: './register.html',
    styleUrl: './register.css',
})

export class Register {
    private readonly service = inject(AuthService);
    private readonly router = inject(Router);
    
    isLoading = signal(false);
    errorMessage = signal<string>('');
    
    onSubmit(form: RegisterDTO) {
        this.isLoading.set(true);
        this.errorMessage.set('');
        
        this.service.register(form).subscribe({
            next: (res) => {
                console.log('Registration successful', res);
                this.isLoading.set(false);
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Registration error:', err);
                
                // Provide user-friendly error messages
                if (err.status === 409) {
                    this.errorMessage.set('Email address is already registered. Please try logging in instead.');
                } else if (err.status === 400) {
                    this.errorMessage.set('Please provide valid registration information.');
                } else {
                    this.errorMessage.set('Registration failed. Please try again later.');
                }
            }
        });
    }
}
