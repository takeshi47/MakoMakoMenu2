import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserForm } from './user-form';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { Observable, Subscriber } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('UserForm', () => {
  let component: UserForm;
  let fixture: ComponentFixture<UserForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserForm],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('フォームが初期化されること', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('role')).toBeDefined();
  });

  it('email が空の場合、フォームがバリデーションエラーになること', () => {
    const email = component.form.get('email');
    email?.setValue('');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['required']).toBeTruthy();
  });

  it('role のデフォルト値が ROLE_USER であること', () => {
    expect(component.form.get('role')?.value).toBe('ROLE_USER');
  });

  it('フォームが不正な状態で onSubmit が呼ばれた場合、エラーメッセージが表示されること', () => {
    spyOn(window, 'alert');
    component.form.get('email')?.setValue('');
    component.onSubmit();
    expect(window.alert).not.toHaveBeenCalled();
    expect(component.form.invalid).toBeTruthy();

    component.form.get('email')?.setValue('email');
    (component.form.get('plainPassword')?.get('first') as FormControl<string | null>).setValue(
      'password1',
    );
    (component.form.get('plainPassword')?.get('second') as FormControl<string | null>).setValue(
      'password2',
    );
    component.onSubmit();
    expect(window.alert).not.toHaveBeenCalled();
    expect(component.form.invalid).toBeTruthy();
  });

  it('サーバーエラー時に errorMessages が表示されること', () => {
    const userService = TestBed.inject(UserService);
    const mockError = { error: { email: { error: 'このメールアドレスは既に使用されています' } } };
    spyOn(userService, 'create').and.returnValue(
      new Observable((subscriber: Subscriber<Record<string, string[]>>) =>
        subscriber.error(mockError),
      ),
    );

    (component.form.get('email') as FormControl<string | null>).setValue('test@example.com');
    (component.form.get('plainPassword')?.get('first') as FormControl<string | null>).setValue(
      'password',
    );
    (component.form.get('plainPassword')?.get('second') as FormControl<string | null>).setValue(
      'password',
    );
    component.onSubmit();
    fixture.detectChanges();

    expect(component['errorMessages']).not.toBeNull();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('このメールアドレスは既に使用されています');
  });
});
