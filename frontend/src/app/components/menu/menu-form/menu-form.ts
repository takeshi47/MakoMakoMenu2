import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Ingredient } from '../../../models/ingredient';
import { IngredientService } from '../../../services/ingredient-service';
import { CommonModule } from '@angular/common';

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}

@Component({
  selector: 'app-menu-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './menu-form.html',
  styleUrl: './menu-form.scss',
})
export class MenuForm implements OnInit {
  private menuService = inject(MenuService);
  private ingredientService = inject(IngredientService);
  private fb = inject(NonNullableFormBuilder);
  private cdr = inject(ChangeDetectorRef);

  private csrfToken = '';
  protected errorMessages: BackendFormErrors | null = null;
  protected availableIngredients: Ingredient[] = [];

  form = this.fb.group({
    name: ['takoyaki'],
    ingredients: [[] as number[]],
  });

  ngOnInit(): void {
    this.menuService.fetchCsrfToken().subscribe((token) => (this.csrfToken = token));
    this.ingredientService
      .getIngredients()
      .subscribe((ingredients) => (this.availableIngredients = ingredients));
  }

  onSubmit(): void {
    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    this.menuService.create(payload).subscribe({
      error: (error) => {
        console.log(error);
        this.errorMessages = error.error;
        console.log(this.errorMessages);
        this.cdr.markForCheck();
      },
    });
  }
}
