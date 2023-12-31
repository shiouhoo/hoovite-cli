/* eslint-disable @typescript-eslint/no-empty-function */
import { app } from 'electron';

function setTray() {
}

function setMenu() {}

export default function () {
    app.whenReady().then(() => {
        setTray();
        setMenu();
    });
}