import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientForm } from './ingredient-form';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { IngredientService } from '../../../services/ingredient-service';

describe('IngredientForm', () => {
  let component: IngredientForm;
  let fixture: ComponentFixture<IngredientForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('フォームが初期化されること', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')).toBeDefined();
    expect(component.form.get('isStock')).toBeDefined();
  });

  it('isStock の初期値が false であること', () => {
    expect(component.form.get('isStock')?.value).toBe(false);
  });

  it('サーバーエラー時に errorMessages が表示されること', () => {
    const ingredientService = TestBed.inject(IngredientService);
    const mockError = { error: { name: ['すでに存在します'] } };
    spyOn(ingredientService, 'create').and.returnValue(
      new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)),
    );

    component.form.get('name')?.setValue('Onion');
    component.onSubmit();
    fixture.detectChanges();

    expect(component['errorMessages']).not.toBeNull();

    const errorMsg = fixture.nativeElement.querySelector('.invalid-tooltip');
    expect(errorMsg.textContent).toContain('すでに存在します');
  });
});
