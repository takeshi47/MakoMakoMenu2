import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Ingredient } from '../../../models/ingredient';
import { CommonModule } from '@angular/common';
import { IngredientService } from '../../../services/ingredient-service';

@Component({
  selector: 'tr[app-ingredient-list-item]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ingredient-list-item.html',
  styleUrl: './ingredient-list-item.scss',
})
export class IngredientListItem {
  @Input() ingredient!: Ingredient;
  @Input({ required: true }) csrfToken!: string;
  @Output() completeDelete: EventEmitter<void> = new EventEmitter<void>();
  @Output() enableEdit: EventEmitter<number> = new EventEmitter<number>();

  private ingredientService = inject(IngredientService);

  delete(id: number): void {
    this.ingredientService.delete(id, this.csrfToken).subscribe({
      next: () => {
        // todo: alertをUI通知に変更
        alert('delete completed');
        this.completeDelete.emit();
      },
      error: (error) => {
        console.error(error);
        // todo: alertをUI通知に変更
        alert(error.error);
      },
    });
  }
}
