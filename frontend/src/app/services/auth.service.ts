import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

interface CsrfToken {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  fetchCsrfToken(): Observable<CsrfToken> {
    return this.http.get<CsrfToken>('/api/login/csrf-token');
  }

  getMe(): Observable<User> {
    return this.http.get<User>('/api/me');
  }

  login(credentials: { email: string; password: string; csrfToken: string }): Observable<void> {
    const loginData = {
      ...credentials,
    };

    return this.http
      .post<void>('/api/login', loginData, {})
      .pipe(tap(() => this.router.navigate(['/home'])));
  }

  logout(): void {
    this.http.get('/logout', { responseType: 'text' }).subscribe({
      complete: () => {
        alert('ログアウトしました。');
        this.router.navigate(['/login']);
      },
    });
  }
}
