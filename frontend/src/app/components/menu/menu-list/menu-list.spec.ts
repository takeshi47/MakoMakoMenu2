import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuList } from './menu-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { MenuService } from '../../../services/menu-service';

describe('MenuList', () => {
  let component: MenuList;
  let fixture: ComponentFixture<MenuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit で menus$ が初期化されること', () => {
    component.ngOnInit();
    expect(component['menus$']).toBeDefined();
  });

  it('削除に失敗した場合、アラートが表示されること', () => {
    const menuService = TestBed.inject(MenuService);
    const mockError = { status: 500, error: { error: 'Internal Error' }, message: 'Server Error' };
    spyOn(menuService, 'delete').and.returnValue(new Observable((subscriber: Subscriber<void>) => subscriber.error(mockError)));
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    component['onDelete'](1);

    expect(window.alert).toHaveBeenCalled();
  });
});
