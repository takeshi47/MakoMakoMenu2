import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user-service';
import { User } from '../models/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('インスタンスが作成されること', () => {
    expect(service).toBeTruthy();
  });

  it('getUsers() がユーザー一覧の Observable を返すこと', () => {
    const mockUsers: User[] = [
      {
        id: 1,
        lastLoggedInAt: null,
        displayName: null,
        email: null,
        role: null,
      },
    ] as User[];
    service.getUsers().subscribe((users: User[]) => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('getUser() が特定のユーザーを返すこと', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      lastLoggedInAt: null,
      displayName: null,
      email: null,
      role: null,
    } as User;
    service.getUser(1).subscribe((user: User) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('create() がユーザーを作成すること', () => {
    const mockData = { username: 'newuser', password: 'password', _token: 'token' };
    const mockResponse = {};
    service.create(mockData).subscribe((response: Record<string, string[]>) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/user/new');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockResponse);
  });

  it('update() がユーザーを更新すること', () => {
    const mockData = { username: 'updateduser', _token: 'token' };
    const mockResponse = {};
    service.update(1, mockData).subscribe((response: Record<string, string[]>) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/user/1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(mockResponse);
  });

  it('delete() がユーザーを削除すること', () => {
    const token = 'token';
    service.delete(1, token).subscribe();

    const req = httpMock.expectOne('/api/user/1');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('X-CSRF-TOKEN')).toBe(token);
    req.flush(null);
  });

  it('fetchCsrfToken() がCSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token' };
    service.fetchCsrfToken().subscribe((response: { token: string }) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/user/csrf-token/user_create');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetchCsrfTokenDelete() が削除用CSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token-delete' };
    service.fetchCsrfTokenDelete(1).subscribe((token: string) => {
      expect(token).toBe('csrf-token-delete');
    });

    const req = httpMock.expectOne('/api/user/csrf-token/user_delete_1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('getUsers() でサーバーエラーが発生した場合、エラーが返されること', () => {
    service.getUsers().subscribe({
      next: () => fail('エラーが発生するはずです'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/user');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
