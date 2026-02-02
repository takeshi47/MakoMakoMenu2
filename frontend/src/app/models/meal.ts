import { Menu } from './menu';

export interface Meal {
  id: number | null;
  date: string;
  mealType: string;
  menu: Menu[];
}
