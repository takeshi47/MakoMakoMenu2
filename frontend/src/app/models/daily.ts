import { Meal } from './meal';

export interface Daily {
  id: number | null;
  date: string;
  meals: Meal[] | null;
}
