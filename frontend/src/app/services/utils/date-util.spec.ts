import { TestBed } from '@angular/core/testing';

import { DateUtil } from './date-util';

describe('DateUtil', () => {
  let service: DateUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtil);
  });

  it('インスタンスが作成されること', () => {
    expect(service).toBeTruthy();
  });

  it('getFormattedDate() が YYYY-MM-DD 形式の文字列を返すこと', () => {
    const date = new Date('2026-03-08T00:00:00Z');
    expect(DateUtil.getFormattedDate(date)).toBe('2026-03-08');
  });

  it('addDays() で指定した日数が加算されること', () => {
    const date = new Date('2026-03-08');
    const newDate = DateUtil.addDays(date, 5);
    expect(newDate.getDate()).toBe(13);
  });

  it('addMonths() で指定した月数が加算されること', () => {
    const date = new Date('2026-03-08');
    const newDate = DateUtil.addMonths(date, 2);
    expect(newDate.getMonth()).toBe(4);
  });
});
