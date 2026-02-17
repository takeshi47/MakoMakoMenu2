import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IngredientService } from '../../../services/ingredient-service';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';
import { IngredientListItem } from '../ingredient-list-item/ingredient-list-item';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredient-list',
  imports: [CommonModule, IngredientListItem, ReactiveFormsModule],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList implements OnInit {
  private ingredientService = inject(IngredientService);
  protected ingredients!: Ingredient[];
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  protected isAdd = false;
  protected form = this.fb.group({
    name: [],
    isStock: false,
  });

  ngOnInit(): void {
    this.ingredientService.getIngredients().subscribe((i) => {
      this.ingredients = i;
      this.cdr.markForCheck();
    });
  }

  enableAdd(): void {
    this.isAdd = true;
  }

  cancel(): void {
    this.isAdd = false;
  }

  onSubmit(): void {
    console.log(this.form.value);
  }
}
