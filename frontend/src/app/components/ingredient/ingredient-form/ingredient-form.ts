import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngredientService } from '../../../services/ingredient-service';
import { CommonModule } from '@angular/common';

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}

@Component({
  selector: 'app-ingredient-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm implements OnInit {
  private ingredientService = inject(IngredientService);
  private fb = inject(NonNullableFormBuilder);

  private csrfToken = '';
  protected errorMessages: BackendFormErrors | null = null;

  form = this.fb.group({
    name: [''],
    isStock: [true, Validators.required],
  });

  ngOnInit(): void {
    this.ingredientService.getCsrfToken().subscribe((token) => (this.csrfToken = token));
  }

  onSubmit(): void {
    console.log();

    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    this.ingredientService.create(payload).subscribe({
      next: (res) => console.log(res),
      error: (error) => console.log(error),
    });
  }
}
