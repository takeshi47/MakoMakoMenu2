import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

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

  login(credentials: { email: string; password: string; csrfToken: string }): Observable<void> {
    const loginData = {
      ...credentials,
    };

    return this.http
      .post<void>('/api/login', loginData, {})
      .pipe(tap(() => this.router.navigate(['/home'])));
  }
}
