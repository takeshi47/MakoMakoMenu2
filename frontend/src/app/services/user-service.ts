import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private baseUrl = '/api/user';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  create(data: Partial<User> & { _token: string }): Observable<Record<string, string[]>> {
    return this.http.post<Record<string, string[]>>(`${this.baseUrl}/new`, data);
  }

  update(
    userId: number,
    data: Partial<User> & { _token: string },
  ): Observable<Record<string, string[]>> {
    return this.http.post<Record<string, string[]>>(`${this.baseUrl}/${userId}`, data);
  }

  fetchCsrfToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.baseUrl}/csrf-token`);
  }
}
