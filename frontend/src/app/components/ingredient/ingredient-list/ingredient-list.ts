import { Component, inject, OnInit } from '@angular/core';
import { IngredientService } from '../../../services/ingredient-service';
import { Observable } from 'rxjs';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IngredientListItem } from "../ingredient-list-item/ingredient-list-item";

@Component({
  selector: 'app-ingredient-list',
  imports: [CommonModule, RouterLink, IngredientListItem],
  templateUrl: './ingredient-list.html',
  styleUrl: './ingredient-list.scss',
})
export class IngredientList implements OnInit {
  private ingredientService = inject(IngredientService);
  protected ingredients$!: Observable<Ingredient[]>;

  ngOnInit(): void {
    this.ingredients$ = this.ingredientService.getIngredients();
  }
}
