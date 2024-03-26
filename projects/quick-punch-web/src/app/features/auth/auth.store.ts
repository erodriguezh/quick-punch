import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthState, authInitialState } from './auth.model';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { exhaustMap, filter, pipe, tap } from 'rxjs';
import { concatLatestFrom, tapResponse } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { formsActions, ngrxFormsQuery } from '../../shared/forms';
import { Router } from '@angular/router';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(authInitialState),
  withMethods(
    (
      store,
      reduxStore = inject(Store),
      authService = inject(AuthService),
      router = inject(Router),
    ) => ({
      register: rxMethod<void>(
        pipe(
          concatLatestFrom(() => [reduxStore.select(ngrxFormsQuery.selectData), reduxStore.select(ngrxFormsQuery.selectValid)]),
          filter(([, data, valid]) => valid === true),
          exhaustMap(([, data]) =>
            authService.setCredentials(data).pipe(
              tapResponse({
                next: () => {
                  patchState(store, { loggedIn: true });
                  router.navigateByUrl('/');
                },
                error: (error: Error) => {
                  if (!error) {
                    return;
                  }
                  reduxStore.dispatch(formsActions.setErrors({ errors: JSON.parse(error.message) }))
                },
              }),
            ),
          ),
        ),
      ),
    }),
  ),
);
