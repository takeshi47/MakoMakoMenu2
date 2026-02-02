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
  protected menus: Menu[] | null = null;
  protected errorMessages: BackendFormErrors | null = null;

  // フォーム全体を管理するFormGroup
  form!: FormGroup;

  readonly BREAKFAST = 'breakfast';
  readonly LUNCH = 'lunch';
  readonly DINNER = 'dinner';

  // todo:
  readonly MEAL_TYPE_CHOICES = [this.BREAKFAST, this.LUNCH, this.DINNER];

  ngOnInit(): void {
    this.initForm();

    this.menuService.fetchAll().subscribe((menus) => {
      this.menus = menus;
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
    //   console.error('Form is invalid');

    //   alert('フォーム入力に誤りがあります。');
    //   return;
    // }

    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    console.log(payload);


    // ここで、整形したデータをService経由でバックエンドAPIにPOSTします
    this.dailyService.create(payload).subscribe({
      next: (res) => {
        console.log(res);

        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error.error);

        if (error?.error) {
          this.errorMessages = error.error;
          console.log(this.errorMessages);
          this.cdr.markForCheck();

        }

        if (error.error.date && confirm('既に登録されてるけど、更新してよい？')) {
          this.update();
        }
      },
    });
  }

  // @todo:
  update(): void {
    console.log(this.form.getRawValue());
    alert('フォームの生データ:\n' + JSON.stringify(this.form.getRawValue(), null, 2));
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
    this.meals.push(this.newMeal(mealType));
  }

  /**
   * 指定したインデックスの食事フォームグループを 'meals' FormArray から削除する
   * @param mealIndex 削除する食事のインデックス
   */
  removeMeal(mealIndex: number): void {
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
    this.getMenus(mealIndex).removeAt(menuIndex);
  }
}
