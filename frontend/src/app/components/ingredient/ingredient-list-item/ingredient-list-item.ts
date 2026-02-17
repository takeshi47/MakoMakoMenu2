import { Component, inject, Input, OnInit } from '@angular/core';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tr[app-ingredient-list-item]',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredient-list-item.html',
  styleUrl: './ingredient-list-item.scss',
})
export class IngredientListItem implements OnInit {
  @Input({ required: true }) ingredient!: Ingredient;

  private fb = inject(FormBuilder);

  protected isEdit = false;
  protected form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.ingredient.id],
      name: [this.ingredient.name],
      isStock: [this.ingredient.isStock],
    });
  }

  protected startEditing(): void {
    this.isEdit = true;
    this.form.reset(this.ingredient);
  }

  protected cancelEditing(): void {
    this.isEdit = false;
    this.form.reset(this.ingredient);
  }

  onSubmit(): void {
    console.log('submit', this.form.value);
    this.isEdit = false;
  }
}
