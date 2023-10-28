import inquirer from 'inquirer';
import fs from 'fs';
import { UserOptions } from './types';

function isValidPackageName(projectName) {
    if (!projectName) return false;
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    );
}

const vueOptions = [
    {
        type: 'confirm',
        name: 'unocss',
        message: '你是否需要unocss？',
        default: true,
        when(answers) {
            return answers.templateName === 'vue3-ts';
        },
    },
    {
        type: 'list',
        name: 'uiComponet',
        message: '是否需要UI组件库',
        choices: ['不需要', 'element-plus', 'ant-design-vue'],
        default: '不需要',
        when(answers) {
            return answers.templateName === 'vue3-ts';
        },
    },
    {
        type: 'confirm',
        name: 'vueRouter',
        message: '你是否需要vue-router？',
        default: true,
        when(answers) {
            return answers.templateName === 'vue3-ts';
        },
    },
    {
        type: 'confirm',
        name: 'pinia',
        message: '你是否需要pinia？',
        default: true,
        when(answers) {
            return answers.templateName === 'vue3-ts';
        },
    },
    {
        type: 'confirm',
        name: 'axios',
        message: '你是否需要axios？',
        default: true,
        when(answers) {
            return answers.templateName === 'vue3-ts';
        },
    },
];

export const userOptions = async (): Promise<UserOptions> => {
    const answers:UserOptions = await inquirer.prompt([
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
            message: `目标文件夹已存在，是否要覆盖？`,
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
        ...vueOptions,
        {
            type: 'list',
            name: 'autoInstall',
            message: '是否需要自动安装包，（默认使用pnpm）',
            default: 'pnpm',
            choices: ['不需要', 'pnpm', 'npm', 'yarn'],
        },
    ]);
    return {
        ...answers
    };

};
