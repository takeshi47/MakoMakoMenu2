import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientDetail } from './ingredient-detail';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('IngredientDetail', () => {
  let component: IngredientDetail;
  let fixture: ComponentFixture<IngredientDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('deleteメソッドを持っていること', () => {
    expect(component['delete']).toBeDefined();
  });
});
