import { Component, inject, OnInit } from '@angular/core';
import { IngredientService } from '../../../services/ingredient-service';
import { Observable } from 'rxjs';
import { Ingredient } from '../../../models/ingredient';
import { ActivatedRoute } from '@angular/router';
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

  protected ingredient$!: Observable<Ingredient>;

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      this.ingredient$ = this.ingredientService.getIngredient(id);

      // 削除用トークンの取得
    });
  }
}
