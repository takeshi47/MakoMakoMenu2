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
  private csrfToken = '';

  protected errorMessages: BackendFormErrors | null = null;
  protected allRoles = ['ROLE_USER', 'ROLE_ADMIN'];

  form = this.fb.group({
    email: ['pisomaso02@example.com'],
    plainPassword: this.fb.group(
      {
        first: [null, [Validators.required]],
        second: [null],
      },
      { validators: passwordMatcher },
    ),
    displayName: [null],
    role: ['ROLE_USER'],
  });

  ngOnInit(): void {
    this.userService.fetchCsrfToken().subscribe((csrfToken) => (this.csrfToken = csrfToken.token));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();

      return;
    }

    this.errorMessages = null;

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
}
