import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { Observable, of, switchMap } from 'rxjs';
import { Menu } from '../../../models/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-detail',
  imports: [CommonModule],
  templateUrl: './menu-detail.html',
  styleUrl: './menu-detail.scss',
})
export class MenuDetail implements OnInit {
  private menuService = inject(MenuService);
  private activatedRouter = inject(ActivatedRoute);
  private router = inject(Router);

  private _csrfTokenDelete: string | null = null;
  protected menuId: number | null = null;
  protected menu$!: Observable<Menu>;

  ngOnInit(): void {
    console.log(0);

    this.activatedRouter.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (id) {
            this.menuId = Number(id);

            this.menu$ = this.menuService.fetch(this.menuId);
            return this.menu$;
          }

          return of(null);
        }),
      )
      .subscribe(() => {
        if (!this.menuId) {
          return;
        }

        this.menuService
          .fetchCsrfTokenDelete(this.menuId)
          .subscribe((token) => (this._csrfTokenDelete = token));
      });
  }

  protected delete(): void {
    if (!this._csrfTokenDelete || !this.menuId) {
      return;
    }

    this.menuService.delete(this.menuId, this._csrfTokenDelete).subscribe({
      next: () => this.router.navigate(['/menu/list']),
      error: (er) => console.log(er),
    });
  }
}
