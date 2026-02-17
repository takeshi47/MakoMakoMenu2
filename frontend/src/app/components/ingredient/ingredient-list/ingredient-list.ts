import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IngredientService } from '../../../services/ingredient-service';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredient-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList implements OnInit {
  private ingredientService = inject(IngredientService);
  protected ingredients!: Ingredient[];
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  protected _isEdit = false;
  protected editableIds: number[] = [];

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

  cancelEditing(id: number | null): void {
    if (!id) {
      return;
    }

    this.editableIds = this.editableIds.filter((v) => v !== id);
    console.log('cancelEditing');

    console.log(this.editableIds);
  }

  enableEdit(id: number | null): void {
    if (!id) {
      return;
    }

    if (!this.editableIds.includes(id)) {
      this.editableIds.push(id);
    }
    console.log(this.editableIds);
  }

  onSubmit(id: number | null = null): void {
    console.log(id, this.form.value);
  }

  isEdit(targetId: number): boolean {
    return this.editableIds.includes(targetId);
  }
}
