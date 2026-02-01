import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import {type loginDTO, type RegisterDTO, type  AuthResponseDTO} from "../../features/auth/auth.DTOs";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiservice=inject(ApiService);  
  register(data:RegisterDTO):Observable<AuthResponseDTO>
 {
    const response=this.apiservice.post<AuthResponseDTO,RegisterDTO>('/auth/register',data);
    return response;
 }
 login(data:loginDTO):Observable<AuthResponseDTO>
 {
    const response=this.apiservice.post<AuthResponseDTO,loginDTO>('/auth/login',data);
    return response;
 }
}
