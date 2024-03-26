import { ipcMain } from 'electron';

// app
import { StorageManager } from './storage';

export class StorageHandlers {
  storageManager: StorageManager;

  constructor() {
    this.storageManager = StorageManager.getInstance();
    this.setupStorageHandlers();
  }

  setupStorageHandlers() {
    ipcMain.handle('store-data', async (event, data: { key: string; value: string; }) => {
      try {
        this.storageManager.set(data.key, data.value);
        return { success: true };
      } catch (error) {
        return { success: false, error: { name: error.name, message: error.message } };
      }
    });

    ipcMain.handle('retrieve-data', async (event, key) => {
      try {
        const value = this.storageManager.get(key);
        return { success: true, value };
      } catch (error) {
        return { success: false, error: { name: error.name, message: error.message } };
      }
    });

    ipcMain.handle('delete-data', async (event, key) => {
      try {
        this.storageManager.delete(key);
        return { success: true };
      } catch (error) {
        return { success: false, error: { name: error.name, message: error.message } };
      }
    });
  }
}
