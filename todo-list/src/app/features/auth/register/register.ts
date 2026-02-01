import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {  RegisterDTO } from '../auth.DTOs';
import { AuthForm } from '../auth-form/auth-form';
@Component({
  selector: 'app-register',
  imports: [AuthForm],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  private readonly service=inject(AuthService);
 onSubmit(form: RegisterDTO) {
    // Handle registration logic here
   this.service.register(form).subscribe({
        next:(res)=>{
            console.log('Registration successful',res);
        },
        error:(err)=>{
            console.error('status',err.status);
            console.error('message',err.message);
        }
    });
    
}
}
