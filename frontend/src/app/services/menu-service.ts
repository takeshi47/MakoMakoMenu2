import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Menu } from '../models/menu';

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

  fetchAll(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.baseUrl);
  }

  fetch(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.baseUrl}/${id}`);
  }

  edit(id: number, data: Partial<MenuRequest> & { _token: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  fetchCsrfToken(): Observable<string> {
    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token`)
      .pipe(map((csrfToken) => csrfToken.token));
  }
}
