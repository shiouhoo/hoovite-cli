import { execSync } from 'child_process';
import os from 'os';

/**
 * 安装包
 * @param __dirPath 项目路径
 */
export const lintAction = (__dirPath:string) => {

    const cmd = 'npm run lint';

    if (os.platform() === 'win32') {
        // Windows
        execSync(`cd /d ${__dirPath} && ${cmd}`, { stdio: 'inherit' });
    } else {
        // macOS 或 Linux
        execSync(`cd "${__dirPath.replaceAll('\\', '/')}" && ${cmd}`, { stdio: 'inherit' });
    }

};