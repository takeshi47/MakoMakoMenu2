import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  delete(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders({
      'X-CSRF_TOKEN': token,
    });

    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { headers: headers });
  }

  fetchCsrfToken(): Observable<string> {
    const tokenId = 'menu_create';

    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`)
      .pipe(map((csrfToken) => csrfToken.token));
  }

  fetchCsrfTokenDelete(id: number): Observable<string> {
    const tokenId = `menu_delete_${id}`;

    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`)
      .pipe(map((csrfToken) => csrfToken.token));
  }
}
