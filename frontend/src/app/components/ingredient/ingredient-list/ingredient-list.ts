import { Component, inject, OnInit } from '@angular/core';
import { IngredientService } from '../../../services/ingredient-service';
import { Observable } from 'rxjs';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ingredient-list',
  imports: [CommonModule, RouterLink],
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
