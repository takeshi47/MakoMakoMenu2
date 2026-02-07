import { Meal } from './meal';

export interface Daily {
  id: number | null;
  date: string;
  meals: Meal[] | null;
}

// 追加するインターフェース
export interface DailyDisplay {
  date: string; // 表示する日付
  isRegistered: boolean; // 登録済みかどうか
  daily?: Daily; // 登録済みの場合、Dailyエンティティ
}

