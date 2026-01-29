import { Ingredient } from './ingredient';

export interface Menu {
  id: number | null;
  name: string;
  ingredients: Ingredient[];
}
