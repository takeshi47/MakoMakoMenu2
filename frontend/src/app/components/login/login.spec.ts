import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('ログインフォームが初期化されること', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
  });

  it('email と password は必須入力であること', () => {
    const email = component.form.get('email');
    const password = component.form.get('password');

    email?.setValue(null);
    password?.setValue(null);

    expect(email?.valid).toBeFalsy();
    expect(password?.valid).toBeFalsy();
  });

  it('ログインに失敗した場合、エラーがコンソールに出力されること', () => {
    const authService = TestBed.inject(AuthService);
    const mockError = { error: { message: '認証に失敗しました' } };
    spyOn(authService, 'login').and.returnValue(new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)));
    spyOn(console, 'error');
    spyOn(window, 'alert');

    (component.form.get('email') as FormControl<string | null>).setValue('test@example.com');
    (component.form.get('password') as FormControl<string | null>).setValue('wrong-password');
    component.login();

    expect(console.error).toHaveBeenCalledWith(mockError);
    expect(window.alert).toHaveBeenCalledWith('認証に失敗しました');
  });
});
