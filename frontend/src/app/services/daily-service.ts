import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Daily } from '../models/daily';

@Injectable({
  providedIn: 'root',
})
export class DailyService {
  private http = inject(HttpClient);
  private baseUrl = '/api/daily';

  create(data: Partial<Daily> & { _token: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create`, data);
  }

  fetchCsrfToken(): Observable<string> {
    const tokenId = 'daily_create';

    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`)
      .pipe(map((csrfToken) => csrfToken.token));
  }
}
