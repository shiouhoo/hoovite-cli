import { spawn } from 'child_process';
import os from 'os';

/**
 * 初始化git
 * @param __dirPath 项目路径
 */
export const gitAction = async (__dirPath:string) => {

    if (os.platform() === 'win32') {
        // Windows
        spawn('cmd.exe', ['/c', `cd /d ${__dirPath} && git init`]);
    } else {
        // macOS 或 Linux
        spawn('sh', ['-c', `cd "${__dirPath.replaceAll('\\', '/')}" && git init`]);
    }
};