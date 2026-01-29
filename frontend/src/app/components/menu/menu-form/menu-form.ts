import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Ingredient } from '../../../models/ingredient';
import { IngredientService } from '../../../services/ingredient-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

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
  private activatedRouter = inject(ActivatedRoute);

  private menuId: number | null = null;
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

    this.activatedRouter.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (id) {
            this.menuId = Number(id);
            return this.menuService.fetch(this.menuId);
          }

          return of(null);
        }),
      )
      .subscribe((menu) => {
        if (!menu) {
          return;
        }

        const ingredientIds = menu.ingredients.map((ingredient) => ingredient.id);

        this.form.patchValue({
          name: menu.name,
          ingredients: ingredientIds,
        });
      });
  }

  onSubmit(): void {
    const requestOption = this.isEditMode ? this.edit() : this.create();

    if (!requestOption) {
      return;
    }

    requestOption.subscribe({
      error: (error) => {
        console.log(error);
        this.errorMessages = error.error;
        console.log(this.errorMessages);
        this.cdr.markForCheck();
      },
    });
  }

  private create(): Observable<void> {
    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    return this.menuService.create(payload);
  }

  private edit(): Observable<void> {
    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    if (!this.menuId) {
      return of();
    }

    return this.menuService.edit(this.menuId, payload);
  }

  protected get isEditMode(): boolean {
    return this.menuId !== null;
  }
}
