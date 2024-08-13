import { userOptions } from '@/option';
import { spinner, clearLoading } from './src/spinner';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { copy, getMainFileUrl, getViteConfigFileUrl } from '@/util';
import { UserOptions } from '@/types';
import { gitAction } from '@/action/gitAction';
import { initProject } from '@/action';
import { installAction } from '@/action/installAction';
import packageFile from './package.json';
import pkgConfig from './pkg.config';
import { lintAction } from '@/action/lintAction';
import AdmZip from 'adm-zip';

const init = async () => {
    try{
        // eslint-disable-next-line no-console
        console.log('hoo-vite,当前版本：', packageFile.version);
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

        if(['node-web'].includes(templateName)) {

            // 将husky解压复制到项目目录
            const zip = new AdmZip(path.join(cliPath, 'src', '.husky.zip'));
            zip.extractAllTo(projectPath, true);
            try{
            // pnpm 不需要此操作
            // npm 会把 .gitignore 文件 重命名为 .npmignore
                fs.copyFileSync(path.join(projectPath, '.npmignore'), path.join(projectPath, '.gitignore'));
                fs.unlinkSync(path.join(projectPath, '.npmignore'));
            }catch{ /* empty */ }

        }

        // 修改 package.json
        const pkg = JSON.parse(
            fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
        );
        pkg.name = projectName;
        pkg.devDependencies['@shiouhoo/eslint-config'] = pkgConfig['@shiouhoo/eslint-config'];

        if(['electron-vue', 'vue3-ts'].includes(templateName)) {

            /** vite.config.ts文件内容 */
            let viteConfig = fs.readFileSync(getViteConfigFileUrl(templateName, projectPath), 'utf-8');
            /** main.ts文件内容 */
            let mainFile = fs.readFileSync(getMainFileUrl(templateName, projectPath), 'utf-8');

            // 初始化vue项目
            ({ viteConfig, mainFile } = initProject(option, pkg, cliPath, projectPath, viteConfig, mainFile));

            // 写入 vite.config.ts
            fs.writeFileSync(getViteConfigFileUrl(templateName, projectPath), viteConfig);
            fs.writeFileSync(getMainFileUrl(templateName, projectPath), mainFile);
        }

        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

        spinner.succeed();
        // 初始化 git
        await gitAction(projectPath);

        if(option.autoInstall !== '不需要') {

            // 安装包
            await installAction(projectPath, option.autoInstall);

            // lint
            lintAction(projectPath);
        }

        // eslint-disable-next-line no-console
        console.log('下载成功');
    }catch (e) {
        if (e.message === 'Operation cancelled') {
            return;
        }else if(e.message.includes('EBUSY')) {
            // eslint-disable-next-line no-console
            console.log('操作无法完成，因为其中的文件夹或文件已在另一程序中打开请关闭该文件夹或文件，然后重试。');
            return;
        }
        spinner.fail();
        // eslint-disable-next-line no-console
        console.log(e);
    }
};

init();