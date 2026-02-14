import { Component, Input } from '@angular/core';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr[app-ingredient-list-item]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-list-item.html',
  styleUrl: './ingredient-list-item.scss',
})
export class IngredientListItem {
  @Input({ required: true }) ingredient!: Ingredient;
}
