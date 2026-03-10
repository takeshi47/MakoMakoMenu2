import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientList } from './ingredient-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { IngredientService } from '../../../services/ingredient-service';
import { of } from 'rxjs';

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

    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit で食材が初期化されること', () => {
    component.ngOnInit();
    expect(component['ingredients']).toBeDefined();
  });
});
