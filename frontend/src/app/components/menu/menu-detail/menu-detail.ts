import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { Observable, of, switchMap } from 'rxjs';
import { Menu } from '../../../models/menu';
import { ActivatedRoute } from '@angular/router';
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

  protected menuId: number | null = null;
  protected menu$!: Observable<Menu>;

  ngOnInit(): void {
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
      .subscribe((menu) => console.log(menu));
  }
}
