import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { loginDTO, RegisterDTO } from '../auth.DTOs';
@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  private fb = inject(FormBuilder);
  registerFormSubmitted=output<RegisterDTO >();
  loginFormSubmitted=output<loginDTO>();
  mode = input.required<'register' | 'login'>();
  onSubmit() {
    if(this.authForm.valid)
    {
        if(this.mode() === 'register') {
            this.registerFormSubmitted.emit(this.authForm.value);
        } else {
            this.loginFormSubmitted.emit(this.authForm.value);
        }
    }
  }

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required,
    Validators.minLength(6),
    Validators.maxLength(20),
    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)]]
    , userName: ['']
  },{ nonNullable: true }
  );
  constructor() {
    const usernameControl = this.authForm.get('userName');
    effect(() => {
      if (this.mode() === 'register') {
        usernameControl?.setValidators([Validators.required]);
      }
      else {
          usernameControl?.clearValidators();
           usernameControl?.setValue('');
      }
      usernameControl?.updateValueAndValidity();
    }
    )
  }
}