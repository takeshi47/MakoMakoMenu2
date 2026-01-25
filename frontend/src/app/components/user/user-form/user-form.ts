import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-service';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';

function passwordMatcher(control: AbstractControl): ValidationErrors | null {
  const plainPassword = control.get('first');
  const confirmPassword = control.get('second');

  if (!plainPassword || !confirmPassword || plainPassword.value === confirmPassword.value) {
    return null;
  }

  return { passwordsMismatch: true };
}

export interface BackendFormErrors {
  [key: string]: BackendFormErrors;
}
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private activatedRouter = inject(ActivatedRoute);

  private csrfToken = '';
  private userId: number | null = null;

  protected errorMessages: BackendFormErrors | null = null;
  protected allRoles = ['ROLE_USER', 'ROLE_ADMIN'];

  form = this.fb.group({
    email: [''],
    plainPassword: this.fb.group(
      {
        first: [null, [Validators.required]],
        second: [null],
      },
      { validators: passwordMatcher },
    ),
    displayName: [''],
    role: [''],
  });

  ngOnInit(): void {
    this.userService.fetchCsrfToken().subscribe((csrfToken) => (this.csrfToken = csrfToken.token));
    this.activatedRouter.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (id) {
            this.userId = Number(id);

            return this.userService.getUser(this.userId);
          }

          return of(null);
        }),
      )
      .subscribe((user) => {
        if (!user) {
          return;
        }

        // ★編集モードの場合、パスワードは必須でなくする
        this.form.get('plainPassword')?.get('first')?.clearValidators();
        this.form.get('plainPassword')?.get('first')?.updateValueAndValidity();

        this.form.patchValue(user);
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();

      return;
    }

    this.errorMessages = null;

    if (this.userId) {
      this.update();
    } else {
      this.create();
    }
  }

  private create(): void {
    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    this.userService.create(payload).subscribe({
      next: (res) => console.log(res),
      error: (error) => {
        console.log(error.error);
        this.errorMessages = error.error;
        this.cdr.markForCheck();
      },
    });
  }

  private update(): void {
    if (!this.isEditMode || !this.userId) {
      throw new Error('comatta');
    }

    const payload = {
      ...this.form.getRawValue(),
      _token: this.csrfToken,
    };

    this.userService.update(this.userId, payload).subscribe({
      next: (res) => console.log(res),
      error: (error) => {
        console.log(error.error);
        this.errorMessages = error.error;
        this.cdr.markForCheck();
      },
    });
  }
  protected get isEditMode(): boolean {
    return this.userId !== null;
  }
}
