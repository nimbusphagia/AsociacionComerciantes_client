import { Routes } from '@angular/router';
import { Home } from "./pages/home/home"
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: Home
      },
    ]
  },
  {
    path: 'login',
    component: Login,
    title: 'Login - AsociacionComerciantes'
  },
];
