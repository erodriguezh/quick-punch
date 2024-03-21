import { Injectable } from '@angular/core';
import { errorMapper } from '../errors/error-mapper';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private electron: any;

  constructor() {
    this.electron = (window as any).electron;

    if (!this.electron) {
      console.warn("IPC was not loaded");
    }
  }

  public on(channel: string, listener: (...args: any[]) => void): void {
    if (!this.electron) {
      console.error("IPC on method is not available");
      return;
    }

    // This is a workaround to handle the issue with directly setting up listeners in the renderer process
    // We send a message to the main process to manually attach a listener there
    this.send('setup-listener', channel);

    this.electron.on(channel, listener);
  }

  public send(channel: string, ...args: any[]): void {
    if (!this.electron) {
      console.error("IPC send method is not available");
      return;
    }
    this.electron.send(channel, ...args);
  }

  public sendSync(channel: string, ...args: any[]): any {
    if (!this.electron) {
      console.error("IPC sendSync method is not available");
      return;
    }
    return this.electron.sendSync(channel, ...args);
  }

  public removeListener(channel: string, func: (...args: any[]) => void): void {
    if (!this.electron) {
      console.error("IPC removeListener method is not available");
      return;
    }
    this.electron.removeListener(channel, func);
  }

  public async invoke<T>(channel: string, ...args: any[]): Promise<T> {
    if (!this.electron) {
      console.error("IPC invoke method is not available");
      return Promise.reject(new Error('IPC invoke method is not available'));
    }

    const result = await this.electron.invoke(channel, ...args);

    if (typeof result === 'object' && result !== null && 'success' in result) {
      if (!result.success && 'error' in result) {
        console.log(`IPC call to '${channel}' failed with message: ${result.error.message}`);
        const createError = errorMapper({ name: result.error.name, message: result.error.message });
        return Promise.reject(createError);
      }
      return result.data as T;
    } else {
      console.error(`Unexpected response format from IPC call to '${channel}'.`);
      return Promise.reject(new Error('Unexpected response format from IPC call'));
    }
  }
}
