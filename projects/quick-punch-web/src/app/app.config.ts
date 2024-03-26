import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { ngrxFormsEffects, ngrxFormsFeature } from './shared/forms';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      ngrxForms: ngrxFormsFeature.reducer,
    }),
    provideEffects(ngrxFormsEffects),
    provideRouterStore(),
    !environment.production ? provideStoreDevtools() : [],
  ]
};
