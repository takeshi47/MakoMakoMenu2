import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { forkJoin, map, Observable, switchMap, tap } from 'rxjs';
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

  protected menu$: Observable<Menu> | null = null;
  private csrfToken: string | null = null;

  ngOnInit(): void {
    this.menu$ = this.load();
  }

  private load(): Observable<Menu> {
    return this.activatedRouter.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        if (!id) {
          throw new Error('id is missing');
        }
        return forkJoin({
          menu: this.menuService.fetch(id),
          csrf: this.menuService.fetchCsrfTokenDelete(id),
        });
      }),
      // 副作用は tap に閉じ込める
      tap((result) => (this.csrfToken = result.csrf)),
      map((result) => result.menu),
    );
  }

  protected delete(id: number | null): void {
    if (!id || !this.csrfToken) {
      return;
    }

    this.menuService.delete(id, this.csrfToken).subscribe({
      next: () => this.router.navigate(['/menu/list']),
      error: (er) => console.log(er),
    });
  }
}
