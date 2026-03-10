import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredientListItem } from './ingredient-list-item';
import { Ingredient } from '../../../models/ingredient';
import { Observable, of, Subscriber } from 'rxjs';
import { IngredientService } from '../../../services/ingredient-service';

describe('IngredientListItem', () => {
  let component: IngredientListItem;
  let fixture: ComponentFixture<IngredientListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientListItem],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredientListItem);
    component = fixture.componentInstance;
    const ingredientService = TestBed.inject(IngredientService);
    spyOn(ingredientService, 'getIngredients').and.returnValue(of([]));
    spyOn(ingredientService, 'fetchCsrfToken').and.returnValue(of('mock-token'));

    component.ingredient = { id: 1, name: 'Tomato' } as Ingredient;
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('食材名が表示されること', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tomato');
  });

  it('canDelete が false の時、削除ボタンが表示されないこと', () => {
    component.ingredient.canDelete = false;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('.btn-outline-danger');
    expect(deleteButton).toBeNull();
  });

  it('canDelete が true の時、削除ボタンが表示されること', () => {
    component.ingredient.canDelete = true;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const deleteButton = compiled.querySelector('.btn-outline-danger');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton?.textContent).toContain('削除');
  });

  it('削除に失敗した場合、アラートが表示されること', () => {
    const ingredientService = TestBed.inject(IngredientService);
    const mockError = { error: '削除 失敗' };

    // confirm と alert をモックしてダイアログを抑制
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');

    spyOn(ingredientService, 'delete').and.returnValue(
      new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)),
    );

    component.delete();

    expect(window.confirm).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(window.alert).toHaveBeenCalledWith('削除 失敗');
  });
});
