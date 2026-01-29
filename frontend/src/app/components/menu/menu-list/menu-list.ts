import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../../services/menu-service';
import { Observable } from 'rxjs';
import { Menu } from '../../../models/menu';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-list.html',
  styleUrl: './menu-list.scss',
})
export class MenuList implements OnInit {
  private menuService = inject(MenuService);
  protected menus$!: Observable<Menu[]>;

  ngOnInit(): void {
    this.menus$ = this.menuService.fetchAll();
  }
}
