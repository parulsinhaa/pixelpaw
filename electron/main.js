const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, screen } = require('electron');
const path = require('path');

let mainWindow;
let petWindow;
let tray;

const iconDataUrl =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#111"/><rect x="8" y="8" width="4" height="4" fill="#F6E8C3"/><rect x="20" y="8" width="4" height="4" fill="#F6E8C3"/><rect x="10" y="18" width="12" height="4" fill="#E8B86D"/></svg>');

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 980,
    minHeight: 720,
    backgroundColor: '#111111',
    title: 'PixelPaw',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));
}

function createPetWindow() {
  const display = screen.getPrimaryDisplay().workAreaSize;
  petWindow = new BrowserWindow({
    width: 220,
    height: 220,
    x: display.width - 260,
    y: display.height - 280,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  petWindow.setAlwaysOnTop(true, 'floating');
  petWindow.loadFile(path.join(__dirname, '..', 'src', 'pet.html'));
}

function createTray() {
  tray = new Tray(nativeImage.createFromDataURL(iconDataUrl));
  tray.setToolTip('PixelPaw');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Show Landing Page', click: () => mainWindow?.show() },
    { label: 'Toggle Pet', click: () => petWindow?.isVisible() ? petWindow.hide() : petWindow.show() },
    { label: 'Start Focus Session', click: () => petWindow?.webContents.send('pet:focus') },
    { type: 'separator' },
    { label: 'Quit PixelPaw', click: () => app.quit() }
  ]));
}

app.whenReady().then(() => {
  app.setLoginItemSettings({ openAtLogin: true, path: app.getPath('exe') });
  createMainWindow();
  createPetWindow();
  createTray();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    createPetWindow();
  }
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
  mainWindow?.hide();
});

ipcMain.handle('settings:get', async () => ({
  launchAtStartup: app.getLoginItemSettings().openAtLogin
}));

ipcMain.handle('settings:set-launch-at-startup', async (_event, enabled) => {
  app.setLoginItemSettings({ openAtLogin: Boolean(enabled), path: app.getPath('exe') });
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.on('pet:mood', (_event, mood) => {
  petWindow?.webContents.send('pet:mood', mood);
});
