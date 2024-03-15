import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private electron: any;

  constructor() {
    this.electron = (window as any).electron;

    if (!this.electron) {
      console.warn("Electron's IPC was not loaded");
    }
  }

  public on(channel: string, listener: (...args: any[]) => void): void {
    if (!this.electron) {
      console.error("Unable to attach IPC listener, Electron's IPC is not available");
      return;
    }

    // This is a workaround to handle the issue with directly setting up listeners in the renderer process
    // We send a message to the main process to manually attach a listener there
    this.send('setup-listener', channel);

    this.electron.on(channel, listener);
  }

  public send(channel: string, ...args: any[]): void {
    if (!this.electron) {
      console.error("Cannot send IPC message, Electron's IPC is not available");
      return;
    }
    this.electron.send(channel, ...args);
  }

  public sendSync(channel: string, ...args: any[]): any {
    if (!this.electron) {
      console.error("Cannot send synchronous IPC message, Electron's IPC is not available");
      return;
    }
    return this.electron.sendSync(channel, ...args);
  }

  public removeListener(channel: string, func: (...args: any[]) => void): void {
    if (!this.electron) {
      console.error("Cannot remove IPC listener, Electron's IPC is not available");
      return;
    }
    this.electron.removeListener(channel, func);
  }

  invoke(channel: string, ...args: any[]): Promise<any> {
    if (!this.electron) {
      console.error('IPC invoke method is not available.');
      return Promise.reject('IPC invoke method is not available.');
    }
    return this.electron.invoke(channel, ...args);
  }
}
