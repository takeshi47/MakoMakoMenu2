import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientListItem } from './ingredient-list-item';

describe('IngredientListItem', () => {
  let component: IngredientListItem;
  let fixture: ComponentFixture<IngredientListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientListItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
