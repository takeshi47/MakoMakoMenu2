import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyForm } from './daily-form';

describe('DailyForm', () => {
  let component: DailyForm;
  let fixture: ComponentFixture<DailyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
