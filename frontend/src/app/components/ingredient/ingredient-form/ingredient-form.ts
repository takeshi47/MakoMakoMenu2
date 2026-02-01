import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IngredientService } from '../../../services/ingredient-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';

// --- 型定義 (共有ファイルへの移動を検討) ---
export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}

@Component({
  selector: 'app-ingredient-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.scss',
})
export class IngredientForm implements OnInit {
  // --- 1. 依存関係の注入 ---
  private ingredientService = inject(IngredientService);
  private fb = inject(NonNullableFormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);

  // --- 2. 状態管理 ---
  private ingredientId: number | null = null;
  private csrfToken = '';
  protected errorMessages: BackendFormErrors | null = null;

  // --- 3. フォーム定義 ---
  form = this.fb.group({
    name: ['', Validators.required],
    isStock: [true, Validators.required],
  });

  // --- 4. ライフサイクル ---
  ngOnInit(): void {
    this.ingredientService.fetchCsrfToken().subscribe((token) => (this.csrfToken = token));
    this.loadIngredientFromRoute();
  }

  // --- 5. publicプロパティ / getter ---
  get editMode(): boolean {
    return this.ingredientId !== null;
  }

  // --- 6. イベントハンドラ ---
  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.saveIngredient();
  }

  // --- 7. プライベートメソッド ---
  /**
   * URLのパラメータを監視し、IDが存在すれば食材データを読み込んでフォームにセットする
   */
  private loadIngredientFromRoute(): void {
    this.activatedRouter.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.ingredientId = Number(id);
            return this.ingredientService.getIngredient(this.ingredientId);
          }
          return of(null);
        }),
      )
      .subscribe((ingredient) => {
        if (ingredient) {
          this.form.patchValue(ingredient);
        }
      });
  }

  /**
   * 編集モードに応じて、新規作成または更新処理を呼び出す
   */
  private saveIngredient(): void {
    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    let saveOperation: Observable<void>;

    if (this.editMode && this.ingredientId) {
      saveOperation = this.ingredientService.edit(this.ingredientId, payload);
    } else {
      saveOperation = this.ingredientService.create(payload);
    }

    saveOperation.subscribe({
      next: () => this.router.navigate(['ingredient/list']),
      error: (error) => {
        this.errorMessages = error.error;
        this.cdr.markForCheck();
      },
    });
  }
}
