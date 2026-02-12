import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DailyService } from '../../services/daily-service';
import { Daily } from '../../models/daily';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { DailyFormComponent } from '../daily/daily-form/daily-form';
import { DateUtil } from '../../services/utils/date-util';

export const enum ViewMode {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  private dailyService = inject(DailyService);
  protected baseDate = new Date();
  private cdr = inject(ChangeDetectorRef);
  protected dailyMeals: Daily[] = [];

  private modalService = inject(NgbModal);

  private selectedViewMode: ViewMode = ViewMode.Week;

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    const strDate = this.baseDate.toISOString().substring(0, 10);
    this.dailyService.fetch(strDate, this.selectedViewMode).subscribe((res) => {
      this.dailyMeals = res;
      this.cdr.markForCheck();
    });
  }

  next(): void {
    console.log('next');

    this._navigateDate(1);
  }

  prev(): void {
    this._navigateDate(-1);
  }

  private _navigateDate(direction: 1 | -1): void {
    let step = 1;

    switch (this.selectedViewMode) {
      case ViewMode.Day:
        step = 1;
        break;
      case ViewMode.Week:
        step = 7;
        break;
      case ViewMode.Month:
        step = 30;
        break;
    }

    console.log(this.baseDate, step * direction);
    this.baseDate = DateUtil.addDays(this.baseDate, step * direction);

    console.log(this.baseDate);

    this.load();
  }

  openNewDailyMeals(date?: string): void {
    const dateToPass = date
      ? DateUtil.getFormattedDate(new Date(date))
      : DateUtil.getFormattedDate(new Date());

    this._openDailyFormModal(null, dateToPass);
  }

  openEditDailyMeals(daily: Daily): void {
    this._openDailyFormModal(daily);
  }

  private _openDailyFormModal(daily: Daily | null, dateStr?: string): void {
    const modalRef = this.modalService.open(DailyFormComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    if (daily) {
      modalRef.componentInstance.daily = daily;
    } else {
      modalRef.componentInstance.baseDate = dateStr;
    }

    modalRef.result.then(
      (result) => {
        console.log(result);
        this.load();
      },
      (reason) => console.log(reason),
    );
  }
}
