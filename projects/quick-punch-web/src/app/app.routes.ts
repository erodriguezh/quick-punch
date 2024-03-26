import { Routes } from '@angular/router';

// app
import { authGuard } from './features/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'punch-clock',
    pathMatch: 'full',
  },
  {
    path: 'punch-clock',
    loadComponent: () => import('./features/punch-clock/punch-clock.component').then((m) => m.PunchClockComponent),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then((m) => m.RegisterComponent),
  },
];
