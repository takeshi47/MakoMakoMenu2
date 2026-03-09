import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuDetail } from './menu-detail';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('MenuDetail', () => {
  let component: MenuDetail;
  let fixture: ComponentFixture<MenuDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'menu/:id', component: MenuDetail }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('コンポーネントが作成されること', () => {
    expect(component).toBeTruthy();
  });

  it('menu$ Observableを持っていること', () => {
    expect(component['menu$']).toBeDefined();
  });
});
