import { app, Menu, Tray } from 'electron';
import icon from '../../../resources/icon.png?asset';
import { showMainWindow, closeMainWindow } from '../window';

function setTray() {
    const tray = new Tray(icon);
    tray.on('click', () => {
        showMainWindow();
    });
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '退出',
                click: () => {
                    closeMainWindow();
                },
            },
        ]);
        tray.popUpContextMenu(contextMenu);
    });
}

export default function () {
    app.whenReady().then(() => {
        setTray();
    });
}