import { ipcMain } from 'electron';

// app
import { PunchClockController } from './punch-clock';

export class PunchClockHandlers {
  punchClockController: PunchClockController;

  constructor() {
    this.punchClockController = PunchClockController.getInstance();
    this.setupHandlers();
  }

  setupHandlers() {
    ipcMain.handle('punch-clock', async (event, loginDetails) => {
      try {
        await this.punchClockController.punchClock(loginDetails);
        return { success: true };
      } catch (error) {
        console.error('Error in punch-clock ipcMain handler:', error);
        return { success: false, error: error.message };
      }
    });
  }
}
