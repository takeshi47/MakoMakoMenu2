import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface MenuRequest {
  name: string;
  ingredients: number[];
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private baseUrl = '/api/menu';

  create(data: Partial<MenuRequest> & { _token: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/new`, data);
  }

  fetchCsrfToken(): Observable<string> {
    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token`)
      .pipe(map((csrfToken) => csrfToken.token));
  }
}
