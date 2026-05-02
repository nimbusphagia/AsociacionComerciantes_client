import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Deudas } from './pages/deudas/deudas';
import { Puestos } from './pages/puestos/puestos';
import { Socios } from './pages/socios/socios';
import { Tarifas } from './pages/tarifas/tarifas';
import { Pagos } from './pages/pagos/pagos';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'deudas',
        component: Deudas,
      },
      {
        path: 'puestos',
        component: Puestos,
      },
      {
        path: 'socios',
        component: Socios,
      },
      {
        path: 'tarifas',
        component: Tarifas,
      },
      {
        path: 'pagos',
        component: Pagos,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
    title: 'Login - AsociacionComerciantes',
  },
];
