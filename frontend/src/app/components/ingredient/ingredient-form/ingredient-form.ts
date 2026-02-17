import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}

@Component({
  selector: 'app-ingredient-form',
  imports: [CommonModule],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm implements OnInit {
  ngOnInit(): void {
    console.log('onInit');
  }
}
