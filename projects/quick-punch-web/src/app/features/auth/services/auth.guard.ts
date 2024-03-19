import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

// lib
import { map, Observable, take } from 'rxjs';

// app
import { AuthService } from './auth.service';
import { Credentials } from '../../../core';

export const authGuard = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.credentials().pipe(
    map(({ personellNumber, pin }: Credentials) => {
      if (!personellNumber || !pin) {
        return router.parseUrl('/register');
      }
      return true;
    }),
    take(1),
  );
};
