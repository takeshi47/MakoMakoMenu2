import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientListItem } from './ingredient-list-item';
import { Ingredient } from '../../../models/ingredient';

describe('IngredientListItem', () => {
  let component: IngredientListItem;
  let fixture: ComponentFixture<IngredientListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientListItem],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientListItem);
    component = fixture.componentInstance;

    component.ingredient = { id: 1, name: 'Tomato' } as Ingredient;

    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('食材名が表示されること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tomato');
  });
});
