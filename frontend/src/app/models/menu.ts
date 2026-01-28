import { Ingredient } from './ingredient';

export interface Menu {
  id: number | null;
  name: string | null;
  ingredients: Ingredient[];
}
