import { ipcMain } from 'electron';
import { mainWindow } from '../window';
import { WindowType } from '../type';

const getWindow = (type: WindowType) => {
    switch (type) {
    case 'main':
        return mainWindow;
    }
};
export default function () {
    // 接收最小化命令
    ipcMain.handle('window-min', function (_, type: WindowType) {
        getWindow(type).minimize();
        return 12;
    });
    // 接收最大化命令
    ipcMain.handle('window-max', function (_, type: WindowType) {
        const w = getWindow(type);
        if (w.isMaximized()) {
            w.restore();
        } else {
            w.maximize();
        }
    });
    // 接收关闭命令
    ipcMain.handle('window-close', function (_, type: WindowType) {
        getWindow(type).hide();
    });

    // 监听窗口最大化事件
    ipcMain.handle('window-listen', function (_, type: WindowType) {
        const w = getWindow(type).on('resize', () => {
            w.webContents.send('window-change', w.isMaximized());
        });
    });

}