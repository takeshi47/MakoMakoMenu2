import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { UserList } from './components/user/user-list/user-list';
import { UserForm } from './components/user/user-form/user-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'user/list', component: UserList },
  { path: 'user/create', component: UserForm },
  { path: 'user/edit/:id', component: UserForm },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
