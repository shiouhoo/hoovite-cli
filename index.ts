import { userOptions } from '@/option';
import { spinner, clearLoading } from './src/spinner.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { copy } from '@/util.js';
import { UserOptions } from '@/types';
import { gitAction } from '@/action/gitAction.js';
import { vueAction } from '@/action/vueAction.js';
import { installAction } from '@/action/installAction.js';

const init = async () => {
    try{
        /** 脚手架位置 */
        const cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');
        /** 命令运行位置 */
        const __dirname = path.resolve();
        const option: UserOptions = await userOptions();
        const { templateName, projectName, overwrite } = option;
        /** 项目路径 */
        const projectPath = path.join(__dirname, projectName);
        // 清空原有文件夹
        if (overwrite) {
            clearLoading.start();
            await new Promise((resolve, reject) => {
                const worker = new Worker(path.join(cliPath, 'src/clearDir.js'), { workerData: projectName });
                worker.on('message', (msg) => {
                    clearLoading.succeed();
                    if(msg.error) {
                        reject(msg.error);
                        return;
                    }
                    resolve(msg);
                });
            });
        }
        // 复制模版
        spinner.start();
        const templateDir = path.join(cliPath, `src/template/${templateName}`);
        copy(templateDir, projectPath);

        /** vite.config.ts文件内容 */
        let viteConfig = fs.readFileSync(path.join(projectPath, 'vite.config.ts'), 'utf-8');
        /** main.ts文件内容 */
        let mainFile = fs.readFileSync(path.join(projectPath, 'src/main.ts'), 'utf-8');

        // 修改 package.json
        const pkg = JSON.parse(
            fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
        );
        pkg.name = projectName;

        // 初始化vue项目
        ({ viteConfig, mainFile } = vueAction(option, pkg, cliPath, projectPath, viteConfig, mainFile));

        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

        spinner.succeed();
        // 初始化 git
        await gitAction(projectPath);

        // 安装包
        await installAction(projectPath, option.autoInstall);

        // 写入 vite.config.ts
        fs.writeFileSync(path.join(projectPath, 'vite.config.ts'), viteConfig);
        fs.writeFileSync(path.join(projectPath, 'src/main.ts'), mainFile);

        // eslint-disable-next-line no-console
        console.log('下载成功');
    }catch (e) {
        spinner.fail();
        if (e.message === 'Operation cancelled') {
            return;
        }else if(e.message.includes('EBUSY')) {
            // eslint-disable-next-line no-console
            console.log('操作无法完成，因为其中的文件夹或文件已在另一程序中打开请关闭该文件夹或文件，然后重试。');
            return;
        }
        // eslint-disable-next-line no-console
        console.log(e);
    }
};

init();