import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuForm } from './menu-form';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscriber } from 'rxjs';
import { MenuService } from '../../../services/menu-service';

describe('MenuForm', () => {
  let component: MenuForm;
  let fixture: ComponentFixture<MenuForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        NgbActiveModal
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('フォームが初期化されること', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('name')).toBeDefined();
    expect(component.form.get('ingredients')).toBeDefined();
  });

  it('name が必須入力であること', () => {
    const name = component.form.get('name');
    name?.setValue('');
    expect(name?.valid).toBeFalsy();
  });

  it('サーバーエラー時に errorMessages が表示されること', () => {
    const menuService = TestBed.inject(MenuService);
    const mockError = { error: { name: { error: 'すでに存在します' } } };
    spyOn(menuService, 'create').and.returnValue(new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)));

    component.form.get('name')?.setValue('Test Menu');
    component.onSubmit();
    fixture.detectChanges();

    expect(component['errorMessages']).not.toBeNull();

    const errorMsg = fixture.nativeElement.querySelector('.invalid-feedback');
    expect(errorMsg.textContent).toContain('すでに存在します');
  });
});
