import inquirer from 'inquirer';
import fs from 'fs';
import { UserOptions } from './types';

function isValidPackageName(projectName) {
    if (!projectName) return false;
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    );
}

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
    ]);
    return {
        ...answers
    };

};