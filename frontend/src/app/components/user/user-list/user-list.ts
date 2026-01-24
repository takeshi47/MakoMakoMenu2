import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  private userService = inject(UserService);
  public users$!: Observable<User[]>;

  ngOnInit(): void {
    this.users$ = this.userService.getUsers();
  }
}
