import { app, BrowserWindow } from 'electron';
import { electronApp, optimizer } from '@electron-toolkit/utils';
import { mainWindow, createWindow, isShouldQuit, showMainWindow, closeMainWindow } from './window';
import './trayAndMenu';
import ipcInit from './ipc';

const gotTheLock = app.requestSingleInstanceLock();
if(!gotTheLock) {
    app.quit();
}else{
    app.whenReady().then(() => {
    // Set app user model id for windows
        electronApp.setAppUserModelId('com.electron');

        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });

        createWindow();
        ipcInit();

        app.on('second-instance', () => {
            showMainWindow();
        });

        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });

        mainWindow.on('close', (e) => {
            if(isShouldQuit) {
                app.quit();
                return;
            }
            e.preventDefault();
            mainWindow.hide();
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        closeMainWindow();
        app.quit();
    }
});