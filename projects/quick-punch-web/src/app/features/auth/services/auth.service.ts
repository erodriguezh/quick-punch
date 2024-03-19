import { Injectable, inject } from '@angular/core';

// libs
import { EMPTY, Observable, catchError, combineLatest, from, map } from 'rxjs';

// app
import { IpcService } from '../../../core/services/ipc.service';
import { Credentials } from '../../../core/types/credentials';
import { StorageKeys } from '../../../core/constants';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly ipcService = inject(IpcService);

  credentials(): Observable<Credentials> {
    const personnelNumber$ = from(this.ipcService.invoke<string>('retrieve-data', StorageKeys.personellNumber));
    const pin$ = from(this.ipcService.invoke<string>('retrieve-data', StorageKeys.pin));
    return combineLatest([personnelNumber$, pin$]).pipe(
      map(([personellNumber, pin]) => {
        return {
          personellNumber: String(personellNumber),
          pin: String(pin)
        }
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  }
}
