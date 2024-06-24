import { execSync } from 'child_process';
import os from 'os';

/**
 * 安装包
 * @param __dirPath 项目路径
 */
export const installAction = async (__dirPath:string, way:string) => {
    return new Promise((resolve) => {

        let cmd = '';
        switch (way) {
        case 'npm': cmd = 'npm install';break;
        case 'yarn': cmd = 'yarn install';break;
        case 'pnpm': cmd = 'pnpm install';break;
        default: resolve(null);return;
        }

        if (os.platform() === 'win32') {
            // Windows
            execSync(`cd /d ${__dirPath} && ${cmd}`, { stdio: 'inherit' });
        } else {
        // macOS 或 Linux
            execSync(`cd "${__dirPath.replaceAll('\\', '/')}" && ${cmd}`, { stdio: 'inherit' });
        }
        resolve('执行成功');
    });
};