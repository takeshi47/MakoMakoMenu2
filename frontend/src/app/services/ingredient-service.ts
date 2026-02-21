import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private http = inject(HttpClient);

  private baseUrl = '/api/ingredient';

  create(data: Partial<Ingredient> & { _token: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/new`, data);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.baseUrl}`);
  }

  getIngredient(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.baseUrl}/${id}`);
  }

  edit(id: number, data: Partial<Ingredient> & { _token: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/edit/${id}`, data);
  }

  delete(id: number, token: string): Observable<void> {
    const headers = new HttpHeaders({
      'X-CSRF_TOKEN': token,
    });
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { headers: headers });
  }

  fetchCsrfToken(): Observable<string> {
    const tokenId = 'ingredient_form';

    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`)
      .pipe(map((csrfToken) => csrfToken.token));
  }

  fetchCsrfTokenDelete(id: number): Observable<string> {
    const tokenId = `ingredient_delete_${id}`;

    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token/${tokenId}`)
      .pipe(map((csrfToken) => csrfToken.token));
  }
}
