import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import {
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Ingredient } from '../../../models/ingredient';
import { IngredientService } from '../../../services/ingredient-service';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Menu } from '../../../models/menu';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

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
  @Input() menu: Menu | null = null;
  private menuService = inject(MenuService);
  private ingredientService = inject(IngredientService);
  private fb = inject(NonNullableFormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private activeModal = inject(NgbActiveModal);

  private csrfToken = '';
  protected errorMessages: BackendFormErrors | null = null;
  protected availableIngredients: Ingredient[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    ingredients: [[] as number[]],
  });

  ngOnInit(): void {
    this.menuService.fetchCsrfToken().subscribe((token) => (this.csrfToken = token));
    this.ingredientService.getIngredients().subscribe((ingredients) => {
      this.availableIngredients = ingredients;
      this.cdr.markForCheck();
    });

    if (this.menu) {
      this.nameForm.patchValue(this.menu.name);
      this.ingredientsForm.patchValue(
        this.menu.ingredients.map((i) => i.id).filter((id): id is number => id !== null),
      );
    }
  }

  onSubmit(): void {
    const requestOption = this.isEditMode ? this.edit() : this.create();

    if (!requestOption) {
      return;
    }

    requestOption.subscribe({
      next: () => {
        this.close();
      },
      error: (error) => {
        this.errorMessages = error.error;
        this.cdr.markForCheck();
      },
    });
  }

  protected close(): void {
    this.activeModal.close('close');
  }

  protected dismiss(): void {
    this.activeModal.dismiss('dismiss');
  }

  private create(): Observable<void> {
    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    return this.menuService.create(payload);
  }

  private edit(): Observable<void> {
    if (!this.menu || this.menu.id === null) {
      return of();
    }

    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    return this.menuService.edit(this.menu.id, payload);
  }

  protected isIngredientSelected(id: number | null): boolean {
    if (id === null) return false;

    const selectedIds = this.ingredientsForm.value || [];
    return selectedIds.includes(id);
  }

  protected toggleIngredient(id: number | null): void {
    if (id === null) return;

    const current = [...(this.ingredientsForm.value || [])];
    const index = current.indexOf(id);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }

    this.ingredientsForm.setValue(current);
    this.ingredientsForm.markAsDirty();
  }

  protected get isEditMode(): boolean {
    return this.menu !== null;
  }

  private get nameForm(): FormControl {
    return this.form.get('name') as FormControl;
  }

  private get ingredientsForm(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }
}
