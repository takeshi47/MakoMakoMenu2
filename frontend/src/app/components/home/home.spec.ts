import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home, ViewMode } from './home';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { DailyService } from '../../services/daily-service';
import { of } from 'rxjs';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let dailyService: DailyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    dailyService = TestBed.inject(DailyService);
    // API呼び出しをモック
    spyOn(dailyService, 'fetch').and.returnValue(of([]));

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    
    // テスト用の基準日を固定 (2026-03-01)
    component['baseDate'] = new Date(2026, 2, 1);
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('初期状態のビューモードが WEEK であること', () => {
    expect(component.selectedViewMode).toBe(ViewMode.Week);
  });

  describe('ナビゲーションロジック', () => {
    it('Week モードで next() を呼ぶと日付が7日進むこと', () => {
      const initialDate = new Date(component['baseDate']);
      component.next();
      const expectedDate = new Date(initialDate);
      expectedDate.setDate(initialDate.getDate() + 7);
      
      expect(component['baseDate'].getTime()).toBe(expectedDate.getTime());
    });

    it('Month モードで next() を呼ぶと翌月になること', () => {
      component.selectedViewMode = ViewMode.Month;
      component['baseDate'] = new Date(2026, 2, 15); // 3月
      component.next();
      
      expect(component['baseDate'].getMonth()).toBe(3); // 4月
      expect(component['baseDate'].getFullYear()).toBe(2026);
    });

    it('Day モードで next() を呼ぶと日付が1日進むこと', () => {
      component.selectedViewMode = ViewMode.Day;
      const initialDate = new Date(component['baseDate']);
      component.next();
      const expectedDate = new Date(initialDate);
      expectedDate.setDate(initialDate.getDate() + 1);
      
      expect(component['baseDate'].getTime()).toBe(expectedDate.getTime());
    });

    it('prev() を呼ぶと日付が適切に戻ること (Weekモード)', () => {
      const initialDate = new Date(component['baseDate']);
      component.prev();
      const expectedDate = new Date(initialDate);
      expectedDate.setDate(initialDate.getDate() - 7);
      
      expect(component['baseDate'].getTime()).toBe(expectedDate.getTime());
    });
  });

  describe('ビュー切り替え', () => {
    it('selectedViewMode を変更して onViewModeChange() を呼ぶとデータが再ロードされること', () => {
      const fetchSpy = spyOn(component as any, 'load').and.callThrough();
      
      component.selectedViewMode = ViewMode.Day;
      component.onViewModeChange();
      
      expect(component.selectedViewMode).toBe(ViewMode.Day);
      expect(fetchSpy).toHaveBeenCalled();
    });
  });
});
