import { shell, BrowserWindow } from 'electron';
import icon from '../../resources/icon.png?asset';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';

export let mainWindow: BrowserWindow;

export function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        frame: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

export let isShouldQuit = false;

export function closeMainWindow() {
    isShouldQuit = true;
    mainWindow.close();
}

export function showMainWindow() {
    mainWindow.show();
}