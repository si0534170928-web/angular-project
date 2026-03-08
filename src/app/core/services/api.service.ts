import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroment/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
  
  get<T>(url: string) {
    return this.http.get<T>(`${this.baseUrl}${url}`);
  }
  
  post<T,S>(url:string, body:S)
  {
    console.log('API POST:', `${this.baseUrl}${url}`, body); // Debug log
    return this.http.post<T>(`${this.baseUrl}${url}`, body, this.getHeaders());
  }
  
  patch<T,S>(url:string,body:S)
  {
    return this.http.patch<T>(`${this.baseUrl}${url}`, body, this.getHeaders());
  }
  
  delete<T>(url:string)
  {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }
}