import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  get<T>(url: string) {
    return this.http.get<T>(`${this.baseUrl}${url}`);
  }
  post<T,S>(url:string,body:S)
  {
    return this.http.post<T>(`${this.baseUrl}${url}`,body);
  }
  patch<T,S>(url:string,body:S)
  {
    return this.http.patch<T>(`${this.baseUrl}${url}`,body);
  }
  delete<T>(url:string)
  {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }
}