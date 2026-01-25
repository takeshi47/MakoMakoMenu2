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
  private _csrfTokenDelete: string | null = null;

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

        if (!user.id) {
          return;
        }

        this.userService
          .fetchCsrfTokenDelete(user.id)
          .subscribe((token) => (this._csrfTokenDelete = token));
      });
  }

  protected deleteUser(id: number): void {
    console.log(id);

    this.userService.delete(id).subscribe({
      error: (error) => console.log(error),
    });
  }

  protected get csrfTokenDelete(): string | null {
    return this._csrfTokenDelete;
  }
}
