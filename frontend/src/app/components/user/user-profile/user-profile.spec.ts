import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfile } from './user-profile';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { User } from '../../../models/user';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    role: 'ROLE_USER',
    displayName: 'テストユーザー',
    lastLoggedInAt: '2026-03-09T10:00:00Z',
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['getMe']);
    spy.getMe.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: AuthService, useValue: spy },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('初期化時にユーザー情報を取得すること', () => {
    expect(authServiceSpy.getMe).toHaveBeenCalled();
  });

  it('取得したユーザー情報が画面に表示されること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // ユーザー名が表示されているか
    expect(compiled.querySelector('h4')?.textContent).toContain('テストユーザー');
    // メールアドレスが表示されているか
    expect(compiled.querySelector('.text-muted')?.textContent).toContain('test@example.com');
    // ユーザーIDが表示されているか
    const rows = compiled.querySelectorAll('.row');
    let idFound = false;
    rows.forEach((row) => {
      if (row.textContent?.includes('ユーザーID') && row.textContent?.includes('1')) {
        idFound = true;
      }
    });
    expect(idFound).toBeTrue();
  });

  it('編集ボタンに正しいリンクが設定されていること', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const editBtn = compiled.querySelector('a.btn-primary');
    expect(editBtn?.getAttribute('href')).toBe('/user/edit/1');
  });
});
