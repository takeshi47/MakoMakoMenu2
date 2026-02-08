import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DailyService } from '../../services/daily-service';
import { Daily } from '../../models/daily';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { DailyFormComponent } from '../daily/daily-form/daily-form';

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

  private viewMode = ['day', 'week', 'month'];
  private selectedViewMode = this.viewMode[1];

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
    this.baseDate.setDate(this.baseDate.getDate() + 1);
    const strDate = this.baseDate.toISOString().substring(0, 10);
    this.dailyService.fetch(strDate, this.selectedViewMode).subscribe((res) => {
      this.dailyMeals = res;
      this.cdr.markForCheck();
    });
  }

  prev(): void {
    // todo: kokokara
    console.log('prev');
    console.log(this.baseDate);

    this.baseDate.setDate(this.baseDate.getDate() - 1);
    const strDate = this.baseDate.toISOString().substring(0, 10);
    this.dailyService.fetch(strDate, this.selectedViewMode).subscribe((res) => {
      this.dailyMeals = res;
      this.cdr.markForCheck();
    });
  }

  openNewDailyMeals(date: string | null = null): void {
    const modalRef = this.modalService.open(DailyFormComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    if (date) {
      modalRef.componentInstance.baseDate = date.substring(0, 10);
    } else {
      modalRef.componentInstance.baseDate = new Date().toISOString().substring(0, 10);
    }

    modalRef.result.then(
      (result) => {
        console.log(result);
        this.load();
      },
      (reason) => console.log(reason),
    );
  }

  openEditDailyMeals(daily: Daily): void {
    const modalRef = this.modalService.open(DailyFormComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    modalRef.componentInstance.daily = daily;

    modalRef.result.then(
      (result) => {
        console.log(result);
        this.load();
      },
      (reason) => console.log(reason),
    );
  }
}
