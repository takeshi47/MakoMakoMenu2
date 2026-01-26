import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngredientService } from '../../../services/ingredient-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}

@Component({
  selector: 'app-ingredient-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm implements OnInit {
  private ingredientService = inject(IngredientService);
  private fb = inject(NonNullableFormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private csrfToken = '';
  protected errorMessages: BackendFormErrors | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    isStock: [true, Validators.required],
  });

  ngOnInit(): void {
    this.ingredientService.getCsrfToken().subscribe((token) => (this.csrfToken = token));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    this.ingredientService.create(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['ingredient/list']);
      },
      error: (error) => {
        console.log(error.error);

        this.errorMessages = error.error;
        this.cdr.markForCheck();
      },
    });
  }
}
