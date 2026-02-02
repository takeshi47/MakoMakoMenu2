import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
