import { Injectable, inject } from '@angular/core';

// libs
import { Observable, catchError, combineLatest, from, map, throwError } from 'rxjs';

// app
import { IpcService } from '../../../core/services/ipc.service';
import { Credentials } from '../../../core/types/credentials';
import { StorageKeys } from '../../../core/constants';
import { IpcDataResponse, IpcResponse } from '../../../core/types/ipc';
import { CannotSetException } from '../../../core/errors/storage-errors';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly ipcService = inject(IpcService);

  credentials(): Observable<Credentials> {
    const personnelNumber$ = from(this.ipcService.invoke<IpcDataResponse<string>>('retrieve-data', StorageKeys.personellNumber));
    const pin$ = from(this.ipcService.invoke<IpcDataResponse<string>>('retrieve-data', StorageKeys.pin));
    return combineLatest([personnelNumber$, pin$]).pipe(
      map(([personellNumber, pin]) => {
        return {
          personellNumber: personellNumber.value!,
          pin: pin.value!
        }
      }),
      catchError((err: Error) => {
        console.log('Handling error on AuthService credentials and rethrowing it', err);
        return throwError(() => err);
      })
    );
  }

  setCredentials({ personellNumber, pin }: Credentials): Observable<void | Error> {
    const personnelNumber$ = from(this.ipcService.invoke<IpcResponse>('store-data', { key: StorageKeys.personellNumber, value: personellNumber }));
    const pin$ = from(this.ipcService.invoke<IpcResponse>('store-data', { key: StorageKeys.pin, value: pin }));
    return combineLatest([personnelNumber$, pin$]).pipe(
      map(([personellNumber, pin]) => {
        if (!personellNumber.success) {
          throw new CannotSetException(`Cannot save value: ${StorageKeys.personellNumber}`);
        }
        if (!pin.success) {
          throw new CannotSetException(`Cannot save value: ${StorageKeys.pin}`);
        }
        return;
      }),
      catchError((err: Error) => {
        console.log('Handling error on AuthService setCredentials and rethrowing it', err);
        return throwError(() => err);
      })
    );
  }
}
