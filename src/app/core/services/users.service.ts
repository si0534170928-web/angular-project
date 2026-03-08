import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface UserLookupDTO {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private api = inject(ApiService);

  getAllUsers() {
    return this.api.get<UserLookupDTO[]>('/users');
  }
}
