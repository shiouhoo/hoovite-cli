import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import os from 'os';

/**
 * 初始化git
 * @param __dirPath 项目路径
 */
export const gitAction = async (__dirPath:string) => {

    return new Promise((resolve) => {
        let child: ChildProcessWithoutNullStreams;
        if (os.platform() === 'win32') {
        // Windows
            child = spawn('cmd.exe', ['/c', `cd /d ${__dirPath} && git init`]);
        } else {
        // macOS 或 Linux
            child = spawn('sh', ['-c', `cd "${__dirPath.replaceAll('\\', '/')}" && git init`]);
        }
        child.stdout.on('data', (data) => {
            // eslint-disable-next-line no-console
            console.log(`${data}`);
            resolve('执行成功');
        });
    });
};