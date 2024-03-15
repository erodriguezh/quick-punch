import { app, BrowserWindow, ipcMain } from "electron";
import path from 'path';

// app
import { StorageHandlers } from './storage/handlers';

let win: BrowserWindow | null;
const quickPunchWebProjectName = 'quick-punch-web';
const pathToQuickPunchWebIndex = `file://${path.join(__dirname, quickPunchWebProjectName,'index.html')}`;
const pathToAppLogo = `file://${path.join(__dirname, quickPunchWebProjectName,'assets','logo.png')}`;
const devUrl = `http://localhost:4200`;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 800,
    icon: pathToAppLogo,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startURL = app.isPackaged ? pathToQuickPunchWebIndex : devUrl;

  win.loadURL(startURL);

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.on('ready', () => {
  new StorageHandlers();
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
