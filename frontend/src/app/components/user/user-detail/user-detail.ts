import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { Observable, switchMap } from 'rxjs';
import { User } from '../../../models/user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss',
})
export class UserDetail implements OnInit {
  private activatedRouter = inject(ActivatedRoute);
  private userService = inject(UserService);

  user$!: Observable<User>;

  ngOnInit(): void {
    console.log(99);

    this.activatedRouter.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          console.log(id);

          this.user$ = this.userService.getUser(id);

          return this.user$;
        }),
      )
      .subscribe((user) => {
        console.log(user);
      });
  }
}
