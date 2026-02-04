import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyService } from '../../../services/daily-service';
import { MenuService } from '../../../services/menu-service';
import { Menu } from '../../../models/menu';
import { Router } from '@angular/router';

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}
@Component({
  selector: 'app-daily-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-form.html',
  styleUrls: ['./daily-form.scss'],
})
export class DailyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dailyService = inject(DailyService);
  private menuService = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private baseDate = new Date().toISOString().substring(0, 10);
  private csrfToken: string | null = null;
  protected menusChoices: Menu[] | null = null;
  protected errorMessages: BackendFormErrors | null = null;

  // フォーム全体を管理するFormGroup
  form!: FormGroup;

  readonly BREAKFAST = 'breakfast';
  readonly LUNCH = 'lunch';
  readonly DINNER = 'dinner';

  // todo: バックエンドから取得するように修正
  readonly MEAL_TYPE_CHOICES = [this.BREAKFAST, this.LUNCH, this.DINNER];

  // todo: バックエンドから取得するように修正
  readonly MEALS_MAX = 3;
  readonly MEALS_MIN = 1;
  readonly MENUS_MIN = 1;

  ngOnInit(): void {
    this.initForm();

    this.menuService.fetchAll().subscribe((menus) => {
      this.menusChoices = menus;
      this.cdr.markForCheck();
    });

    this.dailyService.fetchCsrfToken().subscribe((token) => (this.csrfToken = token));
  }

  /**
   * フォーム送信時の処理
   */
  onSubmit(): void {
    this.errorMessages = null;

    // if (this.form.invalid) {
    //   alert('フォーム入力に誤りがあります。');
    //   return;
    // }

    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    // ここで、整形したデータをService経由でバックエンドAPIにPOSTします
    this.dailyService.create(payload).subscribe({
      next: () => {
        if (confirm('registration completed!')) this.router.navigate(['/home']);
      },
      error: (error) => {
        if (error?.error) {
          this.errorMessages = error.error;
          this.cdr.markForCheck();
        }
      },
    });
  }

  private initForm(): void {
    // フォームの構造を初期化
    this.form = this.fb.group({
      // 日付フィールド。必須入力とし、初期値に今日の日付を設定
      date: [this.baseDate, Validators.required],
      // 食事の配列を管理するFormArray
      meals: this.fb.array([]),
    });

    // 初期状態で「朝食」の入力欄を一つ追加しておく
    this.addMeal(this.BREAKFAST);
  }

  protected canAddMeal(): boolean {
    return this.meals.length < this.MEALS_MAX;
  }

  protected canRemoveMeal(): boolean {
    return this.meals.length > this.MEALS_MIN;
  }

  // protected canAddMenu(): boolean {
  //   return true;
  // }

  protected canRemoveMenu(mealIndex: number): boolean {
    return this.getMenus(mealIndex).length > this.MENUS_MIN;
  }

  /**
   * 'meals' FormArray を取得するためのゲッター
   */
  get meals(): FormArray {
    return this.form.get('meals') as FormArray;
  }

  /**
   * 指定したインデックスの 'meals' FormArray 内にある 'menu' FormArray を取得する
   * @param mealIndex 'meals' FormArray 内のインデックス
   */
  getMenus(mealIndex: number): FormArray {
    return this.meals.at(mealIndex).get('menu') as FormArray;
  }

  /**
   * 新しい食事フォームグループを作成する
   * @param mealType 食事タイプ
   */
  newMeal(mealType: string | null): FormGroup {
    const form = this.fb.group({
      mealType: [mealType ?? null],
      menu: this.fb.array([this.menuForm()]),
    });

    return form;
  }

  /**
   * 'meals' FormArray に新しい食事フォームグループを追加する
   * @param mealType 食事タイプ
   */
  addMeal(mealType: string | null = null): void {
    if (!this.canAddMeal()) {
      return;
    }

    this.meals.push(this.newMeal(mealType));
  }

  /**
   * 指定したインデックスの食事フォームグループを 'meals' FormArray から削除する
   * @param mealIndex 削除する食事のインデックス
   */
  removeMeal(mealIndex: number): void {
    if (!this.canRemoveMeal()) {
      return;
    }

    this.meals.removeAt(mealIndex);
  }

  /**
   * 指定した食事に新しいメニューコントロールを追加する
   * @param mealIndex メニューを追加する食事のインデックス
   */
  addMenu(mealIndex: number): void {
    // 本来はメニュー選択ダイアログなどを表示してIDを取得しますが、ここでは空のコントロールを追加します
    this.getMenus(mealIndex).push(this.menuForm());
  }

  menuForm(): FormControl {
    return this.fb.control(null, Validators.required);
  }

  /**
   * 指定した食事からメニューコントロールを削除する
   * @param mealIndex メニューを削除する食事のインデックス
   * @param menuIndex 削除するメニューのインデックス
   */
  removeMenu(mealIndex: number, menuIndex: number): void {
    if (!this.canRemoveMenu(mealIndex)) {
      return;
    }

    this.getMenus(mealIndex).removeAt(menuIndex);
  }
}
