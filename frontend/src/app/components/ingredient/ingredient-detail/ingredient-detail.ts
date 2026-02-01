import { Component, inject, OnInit } from '@angular/core';
import { IngredientService } from '../../../services/ingredient-service';
import { Observable, switchMap } from 'rxjs';
import { Ingredient } from '../../../models/ingredient';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ingredient-detail',
  imports: [CommonModule],
  templateUrl: './ingredient-detail.html',
  styleUrl: './ingredient-detail.scss',
})
export class IngredientDetail implements OnInit {
  private ingredientService = inject(IngredientService);
  private activatedRouter = inject(ActivatedRoute);
  private router = inject(Router);

  private _csrfTokenDelete: string | null = null;

  protected ingredient$!: Observable<Ingredient>;

  ngOnInit(): void {
    this.activatedRouter.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));

          this.ingredient$ = this.ingredientService.getIngredient(id);
          return this.ingredient$;
        }),
      )
      .subscribe((ingredient) => {
        if (!ingredient.id) {
          return;
        }

        this.ingredientService
          .fetchCsrfTokenDelete(ingredient.id)
          .subscribe((token) => (this._csrfTokenDelete = token));
      });
  }

  protected delete(id: number): void {
    if (!this._csrfTokenDelete) {
      return;
    }

    this.ingredientService.delete(id, this._csrfTokenDelete).subscribe({
      next: () => this.router.navigate(['/ingredient/list']),
      error: (er) => console.log(er),
    });
  }
}
