import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyFormComponent } from './daily-form';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DailyService } from '../../../services/daily-service';
import { MenuService } from '../../../services/menu-service';
import { of, Observable, Subscriber } from 'rxjs';
import { FormArray } from '@angular/forms';

describe('DailyFormComponent', () => {
  let component: DailyFormComponent;
  let fixture: ComponentFixture<DailyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), NgbActiveModal],
    }).compileComponents();

    const dailyService = TestBed.inject(DailyService);
    const menuService = TestBed.inject(MenuService);

    spyOn(dailyService, 'getInitData').and.returnValue(
      of({
        mealTypes: [{ value: 'breakfast', label: '朝食' }],
        config: { mealsMax: 3, mealsMin: 1, menusMin: 1 },
      }),
    );
    spyOn(dailyService, 'fetchCsrfToken').and.returnValue(of('token'));
    spyOn(menuService, 'fetchAll').and.returnValue(of([]));

    fixture = TestBed.createComponent(DailyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('initForm() がデフォルト値でフォームを初期化すること', () => {
    expect(component['form']).toBeDefined();
    expect(component['form'].get('date')).toBeDefined();
    expect(component.meals).toBeDefined();
    expect(component.meals.length).toBeGreaterThan(0);
  });

  it('addMeal() で食事フォームが追加されること', () => {
    const initialCount = component.meals.length;
    component.addMeal();
    expect(component.meals.length).toBe(initialCount + 1);
  });

  describe('Validation', () => {
    it('必須項目（日付）が未入力の場合、フォームが不当（invalid）であること', () => {
      component['form'].get('date')?.setValue('');
      expect(component['form'].valid).toBeFalse();
    });

    it('必須項目（食事タイプ）が未選択の場合、フォームが不当（invalid）であること', () => {
      const firstMeal = component.meals.at(0);
      firstMeal.get('mealType')?.setValue(null);
      expect(component['form'].valid).toBeFalse();
    });

    it('必須項目（メニュー）が未選択の場合、フォームが不当（invalid）であること', () => {
      const firstMeal = component.meals.at(0);
      const menuArray = firstMeal.get('menu') as FormArray;
      menuArray.at(0).setValue(null);
      expect(component['form'].valid).toBeFalse();
    });

    it('フォームが不当（invalid）な場合、決定ボタンが非活性であること', () => {
      component['form'].get('date')?.setValue('');
      fixture.detectChanges();
      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBeTrue();
    });

    it('すべての必須項目が入力されている場合、決定ボタンが活性であること', () => {
      component['form'].get('date')?.setValue('2023-10-01');
      const firstMeal = component.meals.at(0);
      firstMeal.get('mealType')?.setValue('breakfast');
      const menuArray = firstMeal.get('menu') as FormArray;
      menuArray.at(0).setValue(1);
      fixture.detectChanges();

      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitBtn.disabled).toBeFalse();
    });
  });

  it('フォームが不正な状態で onSubmit が呼ばれた場合、アラートが表示されること', () => {
    spyOn(window, 'alert');
    component['form'].get('date')?.setValue('');
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('フォーム入力に誤りがあります。');
  });

  it('サーバーエラー時に errorMessages が表示されること', () => {
    const dailyService = TestBed.inject(DailyService);
    const mockError = { error: { date: { error: '無効な日付です' } } };
    spyOn(dailyService, 'create').and.returnValue(
      new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)),
    );

    component['form'].get('date')?.setValue('2023-10-01');
    const firstMeal = component.meals.at(0);
    const menuArray = firstMeal.get('menu') as FormArray;
    menuArray.at(0).setValue(1);

    component.onSubmit();
    fixture.detectChanges();

    expect(component['errorMessages']).not.toBeNull();

    const errorMsg = fixture.nativeElement.querySelector('.invalid-feedback');
    expect(errorMsg.textContent).toContain('無効な日付です');
  });
});
