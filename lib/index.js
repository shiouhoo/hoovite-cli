#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { spawn } from 'child_process';
import os from 'os';

function isValidPackageName(projectName) {
    if (!projectName)
        return false;
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}
const userOptions = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '项目名称:',
            filter(state) {
                return state.trim();
            },
            validate(state) {
                if (isValidPackageName(state)) {
                    return true;
                }
                return '项目名称不合法！';
            }
        },
        {
            type: 'confirm',
            name: 'overwrite',
            default: true,
            message: `目标文件夹已存在，是否要覆盖?`,
            when(answers) {
                return fs.existsSync(answers.projectName);
            },
        },
        // 如果上一步选择删除为 false 退出
        {
            type: 'input',
            name: 'overwriteChecker',
            when(answers) {
                if (answers.overwrite === false) {
                    throw new Error('Operation cancelled');
                }
                return null;
            },
        },
        {
            type: 'list',
            name: 'templateName',
            message: '请选择你的模版',
            default: 'vue3-ts',
            choices: [
                { name: 'vue3-ts', value: 'vue3-ts' },
            ],
        },
        // 如果上一步选择vue3-ts
        {
            type: 'confirm',
            name: 'unocss',
            default: true,
            when(answers) {
                return answers.templateName === 'vue3-ts';
            },
        },
    ]);
    return {
        ...answers
    };
};

const spinner = ora('正在下载模板...');
const clearLoading = ora('删除原有文件夹...');

/**
 * 复制文件以及文件夹
 * @param src 源文件
 * @param dest 目标文件
 */
function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
            const srcFile = path.resolve(src, file);
            const destFile = path.resolve(dest, file);
            copy(srcFile, destFile);
        }
    }
    else {
        fs.copyFileSync(src, dest);
    }
}

/**
 * 初始化git
 * @param __dirPath 项目路径
 */
const gitAction = async (__dirPath) => {
    if (os.platform() === 'win32') {
        // Windows
        spawn('cmd.exe', ['/c', `cd /d ${__dirPath} && git init`]);
    }
    else {
        // macOS 或 Linux
        spawn('sh', ['-c', `cd "${__dirPath.replaceAll('\\', '/')}" && git init`]);
    }
};

/**
 *
 * @param options 用户选项
 * @param pkg package.json
 * @param projectPath 项目路径
 * @param cliPath 脚手架路径
 * @param viteConfig vite.config.ts
 * @returns vite.config.ts修改后内容
 */
const vueAction = (options, pkg, cliPath, projectPath, viteConfig, mainFile) => {
    if (options.templateName !== 'vue3-ts')
        return { viteConfig, mainFile };
    if (options.unocss) {
        // 修改 package.json
        pkg.devDependencies['unocss'] = '^0.56.5';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", "import { defineConfig } from 'vite';\r\nimport UnoCSS from 'unocss/vite'");
        viteConfig = viteConfig.replace('vue(),', 'vue(),\r\n\t\tUnoCSS()');
        // 复制 unocss.config.ts
        copy(path.join(cliPath, 'src/template/uno.config.ts'), path.join(projectPath, 'uno.config.ts'));
        // 改写 main.ts
        mainFile = mainFile.replace("createApp(App).mount('#app');", "import 'virtual:uno.css'\r\n\r\ncreateApp(App).mount('#app');");
    }
    return { viteConfig, mainFile };
};

const init = async () => {
    try {
        /** 脚手架位置 */
        const cliPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../');
        /** 命令运行位置 */
        const __dirname = path.resolve();
        const option = await userOptions();
        const { templateName, projectName, overwrite } = option;
        /** 项目路径 */
        const projectPath = path.join(__dirname, projectName);
        // 清空原有文件夹
        if (overwrite) {
            clearLoading.start();
            await new Promise((resolve) => {
                const worker = new Worker(path.join(cliPath, 'src/clearDir.js'), { workerData: projectName });
                worker.on('message', resolve);
            });
            clearLoading.succeed();
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
        const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'));
        pkg.name = projectName;
        // 初始化vue项目
        ({ viteConfig, mainFile } = vueAction(option, pkg, cliPath, projectPath, viteConfig, mainFile));
        fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
        // 初始化 git
        gitAction(projectPath);
        spinner.succeed();
        // 写入 vite.config.ts
        fs.writeFileSync(path.join(projectPath, 'vite.config.ts'), viteConfig);
        fs.writeFileSync(path.join(projectPath, 'src/main.ts'), mainFile);
        // eslint-disable-next-line no-console
        console.log('下载成功');
    }
    catch (e) {
        if (e.message === 'Operation cancelled') {
            return;
        }
        // eslint-disable-next-line no-console
        console.log(e);
        spinner.fail();
    }
};
init();
