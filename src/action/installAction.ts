import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import os from 'os';

/**
 * 安装包
 * @param __dirPath 项目路径
 */
export const installAction = async (__dirPath:string, way:string) => {
    return new Promise((resolve) => {

        if(way === '不需要') {resolve(null);return;}
        let cmd = '';
        switch (way) {
        case 'npm': cmd = 'npm install';break;
        case 'yarn': cmd = 'yarn install';break;
        case 'pnpm': cmd = 'pnpm install';break;
        default: resolve(null);return;
        }

        let child: ChildProcessWithoutNullStreams;

        if (os.platform() === 'win32') {
        // Windows
            child = spawn('cmd.exe', ['/c', `cd /d ${__dirPath} && ${cmd}`]);
        } else {
        // macOS 或 Linux
            child = spawn('sh', ['-c', `cd "${__dirPath.replaceAll('\\', '/')}" && ${cmd}`]);
        }
        child.stdout.on('data', (data) => {
            if(`${data}`.includes('Progress: resolved')) {
                if(!`${data}`.includes('Progress: resolved 1,')) {
                    process.stdout.clearLine(0); // 清除当前行
                    process.stdout.cursorTo(0); // 移动光标到行首
                }
                process.stdout.write(`${data}`.replace(/\n/g, ''));
            }else{
                console.log(`\r\n${data}`);
            }
            if(`${data}`.includes('Done')) {
                resolve('执行成功');
            }
        });
    });
};