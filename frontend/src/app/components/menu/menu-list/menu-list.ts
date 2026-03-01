import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Menu } from '../../../models/menu';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { MenuForm } from '../menu-form/menu-form';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.scss',
})
export class MenuList implements OnInit {
  private menuService = inject(MenuService);
  private modalService = inject(NgbModal);
  private cdr = inject(ChangeDetectorRef);

  protected menus$!: Observable<Menu[]>;

  private csrfTokenDelete = '';

  ngOnInit(): void {
    this.menuService.fetchCsrfTokenDelete().subscribe((v) => (this.csrfTokenDelete = v));
    this.loadMenus();
  }

  private loadMenus(): void {
    console.log('loadMenus');

    this.menus$ = this.menuService.fetchAll().pipe(
      catchError((err) => {
        console.error(err);
        return EMPTY;
      }),
    );

    this.cdr.markForCheck();
  }

  protected onDelete(id: number | null): void {
    if (id === null) {
      return;
    }

    if (!confirm('本当に削除して大丈夫？')) {
      return;
    }

    this.menuService
      .delete(id, this.csrfTokenDelete)
      .subscribe({
        next: (res) => console.log(res),
        error: (err) => {
          alert(
            `status: ${err.status} \n` + `error: ${err.error.error}\n` + `message: ${err.message}`,
          );
        },
      })
      .add(() => {
        this.loadMenus();
      });
  }

  protected openMenuForm(menu: Menu | null = null): void {
    const modalRef = this.modalService.open(MenuForm, {
      size: 'lg',
    });

    modalRef.componentInstance.menu = menu;

    modalRef.result.then(
      () => {
        this.loadMenus();
      },
      (reject) => {
        console.log(reject);
      },
    );
  }
}
