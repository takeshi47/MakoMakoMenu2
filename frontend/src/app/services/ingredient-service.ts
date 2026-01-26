import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private http = inject(HttpClient);

  private baseUrl = '/api/ingredient';

  create(data: Ingredient & { _token: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/new`, data);
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.baseUrl}`);
  }

  getCsrfToken(): Observable<string> {
    return this.http
      .get<{ token: string }>(`${this.baseUrl}/csrf-token`)
      .pipe(map((csrfToken) => csrfToken.token));
  }
}
