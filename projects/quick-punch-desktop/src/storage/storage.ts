import { safeStorage } from 'electron';
import Store from 'electron-store';

// app
import {
  CannotDeleteException,
  CannotSetException,
  NotFoundException,
  DataTypeException
} from './storage-errors';

export class StorageManager {
  private static instance: StorageManager;
  private store: Store;

  constructor() {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Encryption is not available in safeStorage');
    }
    this.store = new Store({
      name: 'quick-punch-encrypted',
      watch: true,
      encryptionKey: '1b1457cb665c3f90c04efb2a5a83f671ffa1fa408d5283800c134ef4e98cd31b',
    });
  }

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  set(key: string, value: string): void {
    try {
      const encrypted = safeStorage.encryptString(value);
      const encryptedBase64 = encrypted.toString('base64');
      this.store.set(key, encryptedBase64);
    } catch (error) {
      throw new CannotSetException(
        `Cannot set value for key ${key}. Error: ${error}`
      );
    }
  }

  get(key: string): string {
    const encryptedBase64 = this.store.get(key);
    if (encryptedBase64 === undefined) {
      throw new NotFoundException(`No value found for key ${key}.`);
    }

    if (typeof encryptedBase64 !== 'string') {
      throw new DataTypeException(`Stored value for key ${key} is not a string.`);
    }

    try {
      const encrypted = Buffer.from(encryptedBase64, 'base64');
      const decryptedValue = safeStorage.decryptString(encrypted);
      return decryptedValue;
    } catch (error) {
      throw new Error(`Cannot decrypt value for key ${key}. Error: ${error}`);
    }
  }

  delete(key: string): void {
    if (!this.store.has(key)) {
      throw new NotFoundException(
        `No value found for key ${key}, cannot delete.`
      );
    }

    try {
      this.store.delete(key);
    } catch (error) {
      throw new CannotDeleteException(
        `Cannot delete value for key ${key}. Error: ${error}`
      );
    }
  }
}
