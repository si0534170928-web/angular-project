import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { loginDTO, type RegisterDTO } from '../auth.DTOs';
import { AuthForm } from '../auth-form/auth-form';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [AuthForm,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private readonly service=inject(AuthService);
 onSubmit(form: loginDTO) {
    // Handle registration logic here
   this.service.login(form).subscribe({
          next:(res)=>{
            console.log('Login successful',res);
        },
        error:(err)=>{
            console.error('status',err.status);
            console.error('message',err.message);
        }
    });
    
}
}
