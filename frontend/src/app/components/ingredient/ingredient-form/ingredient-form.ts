import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Ingredient } from '../../../models/ingredient';

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}

@Component({
  selector: 'tr[app-ingredient-form]',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm implements OnInit {
  @Input() id: number | null = null;
  @Input() ingredient: Ingredient | null = null;

  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: '',
    isStock: false,
  });

  ngOnInit(): void {
    if (this.ingredient) {
      this.form.patchValue(this.ingredient);
    }
    console.log('onInit');
    console.log(this.form.value);
    console.log(this.ingredient);
  }

  onSubmit(id: number | null = null): void {
    console.log('onSubmit', id);
    console.log(this.form.value);
  }

  cancelEditing(id: number): void {
    console.log('cancelEditing', id);
  }

  cancelAdd(): void {
    console.log('cancel');
  }
}
