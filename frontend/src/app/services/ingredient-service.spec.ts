import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { IngredientService } from './ingredient-service';
import { Ingredient } from '../models/ingredient';

describe('IngredientService', () => {
  let service: IngredientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(IngredientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('インスタンスが作成されること', () => {
    expect(service).toBeTruthy();
  });

  it('getIngredients() が材料一覧の Observable を返すこと', () => {
    const mockIngredients = [{ id: 1, name: 'Tomato' }] as Ingredient[];
    service.getIngredients().subscribe((ingredients: Ingredient[]) => {
      expect(ingredients.length).toBe(1);
      expect(ingredients).toEqual(mockIngredients);
    });

    const req = httpMock.expectOne('/api/ingredient');
    expect(req.request.method).toBe('GET');
    req.flush(mockIngredients);
  });

  it('getIngredient() が特定の材料を返すこと', () => {
    const mockIngredient = { id: 1, name: 'Tomato' } as Ingredient;
    service.getIngredient(1).subscribe((ingredient: Ingredient) => {
      expect(ingredient).toEqual(mockIngredient);
    });

    const req = httpMock.expectOne('/api/ingredient/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockIngredient);
  });

  it('create() が材料を作成すること', () => {
    const mockData = { name: 'Onion', _token: 'token' };
    service.create(mockData).subscribe();

    const req = httpMock.expectOne('/api/ingredient/new');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(null);
  });

  it('edit() が材料を更新すること', () => {
    const mockData = { name: 'Updated Onion', _token: 'token' };
    service.edit(1, mockData).subscribe();

    const req = httpMock.expectOne('/api/ingredient/edit/1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(null);
  });

  it('delete() が材料を削除すること', () => {
    const token = 'token';
    service.delete(1, token).subscribe();

    const req = httpMock.expectOne('/api/ingredient/delete/1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('X-CSRF_TOKEN')).toBe(token);
    req.flush(null);
  });

  it('fetchCsrfToken() がCSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token' };
    service.fetchCsrfToken().subscribe((token: string) => {
      expect(token).toBe('csrf-token');
    });

    const req = httpMock.expectOne('/api/ingredient/csrf-token/ingredient_form');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetchCsrfTokenDelete() が削除用CSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token-delete' };
    service.fetchCsrfTokenDelete(1).subscribe((token: string) => {
      expect(token).toBe('csrf-token-delete');
    });

    const req = httpMock.expectOne('/api/ingredient/csrf-token/ingredient_delete_1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getIngredients() でサーバーエラーが発生した場合、エラーが返されること', () => {
    service.getIngredients().subscribe({
      next: () => fail('エラーが発生するはずです'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/ingredient');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
