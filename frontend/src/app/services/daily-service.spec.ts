import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { DailyService, DailyInitData } from './daily-service';
import { Daily } from '../models/daily';

describe('DailyService', () => {
  let service: DailyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DailyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('インスタンスが作成されること', () => {
    expect(service).toBeTruthy();
  });

  it('getInitData() が初期データを返すこと', () => {
    const mockInitData: DailyInitData = {
      mealTypes: [{ value: 'breakfast', label: 'Breakfast' }],
      config: { mealsMax: 3, mealsMin: 1, menusMin: 1 },
    };

    service.getInitData().subscribe((data: DailyInitData) => {
      expect(data).toEqual(mockInitData);
    });

    const req = httpMock.expectOne('/api/daily/init-data');
    expect(req.request.method).toBe('GET');
    req.flush(mockInitData);
  });

  it('create() が日次データを作成すること', () => {
    const mockData: Partial<Daily> & { _token: string } = { date: '2023-10-01', _token: 'token' };
    service.create(mockData).subscribe();

    const req = httpMock.expectOne('/api/daily/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(null);
  });

  it('update() が日次データを更新すること', () => {
    const mockData: Partial<Daily> & { _token: string } = { date: '2023-10-01', _token: 'token' };
    service.update(1, mockData).subscribe();

    const req = httpMock.expectOne('/api/daily/update/1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockData);
    req.flush(null);
  });

  it('fetchCsrfToken() がCSRFトークンを返すこと', () => {
    const mockResponse = { token: 'csrf-token' };
    service.fetchCsrfToken().subscribe((token: string) => {
      expect(token).toBe('csrf-token');
    });

    const req = httpMock.expectOne('/api/daily/csrf-token/daily_create');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('fetch() が指定した条件の日付データを返すこと', () => {
    const mockDailies: Daily[] = [{ id: 1, date: '2023-10-01', meals: null }];
    service.fetch('2023-10-01', 'day').subscribe((dailies: Daily[]) => {
      expect(dailies).toEqual(mockDailies);
    });

    const req = httpMock.expectOne('/api/daily');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ baseDate: '2023-10-01', viewMode: 'day' });
    req.flush(mockDailies);
  });

  it('fetchById() が指定した日次データを返すこと', () => {
    const mockDaily: Daily = { id: 1, date: '2023-10-01', meals: null };
    service.fetchById(1).subscribe((daily: Daily) => {
      expect(daily).toEqual(mockDaily);
    });

    const req = httpMock.expectOne('/api/daily/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockDaily);
  });

  it('getInitData() でサーバーエラーが発生した場合、エラーが返されること', () => {
    service.getInitData().subscribe({
      next: () => fail('エラーが発生するはずです'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/daily/init-data');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
