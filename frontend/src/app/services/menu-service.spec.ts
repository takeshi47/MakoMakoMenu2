import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { MenuService } from './menu-service';
import { Menu } from '../models/menu';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('インスタンスが作成されること', () => {
    expect(service).toBeTruthy();
  });

  it('fetchAll() がメニュー一覧の Observable を返すこと', () => {
    const mockMenus = [{ id: 1, name: 'Test Menu' }] as Menu[];
    service.fetchAll().subscribe((menus: Menu[]) => {
      expect(menus.length).toBe(1);
      expect(menus).toEqual(mockMenus);
    });

    const req = httpMock.expectOne('/api/menu');
    expect(req.request.method).toBe('GET');
    req.flush(mockMenus);
  });

  it('fetch() が特定のメニューを返すこと', () => {
    const mockMenu = { id: 1, name: 'Test Menu' } as Menu;
    service.fetch(1).subscribe((menu: Menu) => {
      expect(menu).toEqual(mockMenu);
    });

    const req = httpMock.expectOne('/api/menu/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMenu);
  });

  it('create() がメニューを作成すること', () => {
    const mockData = { name: 'New Menu', ingredients: [1, 2], _token: 'token' };
    service.create(mockData).subscribe();

    const req = httpMock.expectOne('/api/menu/new');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(null);
  });

  it('edit() がメニューを更新すること', () => {
    const mockData = { name: 'Updated Menu', ingredients: [1, 2], _token: 'token' };
    service.edit(1, mockData).subscribe();

    const req = httpMock.expectOne('/api/menu/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockData);
    req.flush(null);
  });

  it('delete() がメニューを削除すること', () => {
    const token = 'token';
    service.delete(1, token).subscribe();

    const req = httpMock.expectOne('/api/menu/delete/1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('X-CSRF-TOKEN')).toBe(token);
    req.flush(null);
  });

  it('fetchCsrfToken() がCSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token' };
    service.fetchCsrfToken().subscribe((token: string) => {
      expect(token).toBe('csrf-token');
    });

    const req = httpMock.expectOne('/api/menu/csrf-token/menu_create');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetchCsrfTokenDelete() が削除用CSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token-delete' };
    service.fetchCsrfTokenDelete().subscribe((token: string) => {
      expect(token).toBe('csrf-token-delete');
    });

    const req = httpMock.expectOne('/api/menu/csrf-token/menu_delete');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetchAll() でサーバーエラーが発生した場合、エラーが返されること', () => {
    service.fetchAll().subscribe({
      next: () => fail('エラーが発生するはずです'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/menu');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
