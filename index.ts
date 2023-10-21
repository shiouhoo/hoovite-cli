import { userOptions } from '@/option';
import { spinner, clearLoading } from './src/spinner.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { copy } from '@/util.js';
import { UserOptions } from '@/types';
import os from 'os';
import { spawn } from 'child_process';

const init = async () => {
    try{
        /** 脚手架位置 */
        const __cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');
        /** 命令运行位置 */
        const __dirname = path.resolve();
        const option: UserOptions = await userOptions();
        const { templateName, projectName, overwrite } = option;
        // 清空原有文件夹
        if (overwrite) {
            clearLoading.start();
            await new Promise((resolve) => {
                const worker = new Worker(path.join(__cliPath, 'src/clearDir.js'), { workerData: projectName });
                worker.on('message', resolve);
            });
            clearLoading.succeed();
        }
        // 复制模版
        spinner.start();
        const templateDir = path.join(__cliPath, `src/template/${templateName}`);
        copy(templateDir, path.join(__dirname, projectName));

        // 修改 package.json
        const pkg = JSON.parse(
            fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
        );
        pkg.name = projectName;
        fs.writeFileSync(path.join(__dirname, projectName + '/package.json'), JSON.stringify(pkg, null, 2) + '\n');

        // 初始化 git
        if (os.platform() === 'win32') {
            // Windows
            spawn('cmd.exe', ['/c', `cd /d ${path.join(__dirname, projectName)} && git init`]);
        } else {
            // macOS 或 Linux
            spawn('sh', ['-c', `cd "${path.join(__dirname, projectName).replaceAll('\\', '/')}" && git init`]);
        }
        spinner.succeed();

        // eslint-disable-next-line no-console
        console.log('下载成功');
    }catch (e) {
        if (e.message === 'Operation cancelled') {
            return;
        }
        // eslint-disable-next-line no-console
        console.log(e);
        spinner.fail();
    }
};

init();