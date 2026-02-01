import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
    console.log(1);

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

  delete(id: number, token: string): Observable<void> {
    console.log(id, token);

    const headers = new HttpHeaders({
      'X-CSRF-TOKEN': token,
    });
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }

  fetchCsrfToken(): Observable<{ token: string }> {
    const tokenId = 'user_create';
    return this.http.get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`);
  }

  fetchCsrfTokenDelete(userId: number): Observable<string> {
    const tokenId = `user_delete_${userId}`;

    return this.http.get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`).pipe(
      map((csrfToken) => {
        return csrfToken.token;
      }),
    );
  }
}
