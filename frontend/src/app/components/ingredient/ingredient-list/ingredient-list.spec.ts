import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientList } from './ingredient-list';
import { IngredientService } from '../../../services/ingredient-service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { of, Observable, Subscriber } from 'rxjs';

describe('IngredientList', () => {
  let component: IngredientList;
  let fixture: ComponentFixture<IngredientList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientList],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientList);
    component = fixture.componentInstance;

    const ingredientService = TestBed.inject(IngredientService);
    spyOn(ingredientService, 'getIngredients').and.returnValue(of([]));
    spyOn(ingredientService, 'fetchCsrfToken').and.returnValue(of('mock-token'));

    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit で食材が初期化されること', () => {
    component.ngOnInit();
    expect(component['ingredients']).toBeDefined();
  });

  it('削除に失敗した場合、アラートが表示されること', () => {
    const ingredientService = TestBed.inject(IngredientService);
    const mockError = { error: '削除 失敗' };
    spyOn(ingredientService, 'delete').and.returnValue(
      new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)),
    );
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.delete(1);

    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(window.alert).toHaveBeenCalledWith('削除 失敗');
  });
});
