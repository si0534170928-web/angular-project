















import { inject, Injectable, signal, computed } from "@angular/core";
import { ApiService } from "./api.service";
import {type loginDTO, type RegisterDTO, type  AuthResponseDTO} from "../../features/auth/auth.DTOs";
import { Observable, pipe, tap } from "rxjs";
import { TokenService } from "./token.service";
import { User } from "../DTOs/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiservice=inject(ApiService);  
  private tokenService=inject(TokenService);
  private currentUser=signal<User|null>(null);
  
  // Reactive isAuthorized signal for template binding
  isAuthorized = computed(() => this.tokenService.isLoggedIn() && this.currentUser() !== null);
  
  constructor() {
    // Initialize user from sessionStorage on service creation
    const storedUser = this.tokenService.getUser();
    if (storedUser && this.tokenService.isLoggedIn()) {
      this.currentUser.set(storedUser);
    }
  }
  
  register(data:RegisterDTO):Observable<AuthResponseDTO>
 {
   return this.apiservice.post<AuthResponseDTO,RegisterDTO>('/auth/register',data).
    pipe(
      tap((response) => {
         this.tokenService.setToken(response.token);
         this.tokenService.setUser(response.user);
          this.currentUser.set(response.user);
      })
    );
    
 }
 login(data:loginDTO):Observable<AuthResponseDTO>
 {
     return this.apiservice.post<AuthResponseDTO,loginDTO>('/auth/login',data).
    pipe(
      tap((response) =>{
         this.tokenService.setToken(response.token);
         this.tokenService.setUser(response.user);
         this.currentUser.set(response.user);
  })
    );
 }
 logout(): void {
   this.tokenService.removeToken();
   this.currentUser.set(null);
 }
  getCurrentUser() {
   return this.currentUser.asReadonly();
 }
 
 isAuthenticated(): boolean {
   return this.tokenService.isLoggedIn() && this.currentUser() !== null;
 }
}
