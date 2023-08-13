import inquirer from 'inquirer';
import fs from 'fs';

function isValidPackageName(projectName) {
	if(!projectName) return false
	return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
		projectName,
	)
}

export const userOptions = async (defaultProjectName, defaultTemplateName) => {
	const answers = await inquirer.prompt([
		{
			type: 'input',
			name: 'projectName',
			message: '项目名称:',
			default: defaultProjectName,
			filter(state) {
				return state.trim() || defaultProjectName
			},
			validate(state) {
				if (isValidPackageName(state)) {
					return true;
				}
				return '项目名称不合法！'
			}
		},
		{
			type: 'confirm',
			name: 'overwrite',
			message: `目标文件夹已存在，是否要覆盖?`,
			when(answers) {
				return fs.existsSync(answers.projectName || defaultProjectName)
			},
		},
		//如果上一步选择删除为 false 退出
		{
			type: 'input',
			name: 'overwriteChecker',
			when(answers) {
				if (answers.overwrite === false) {
					throw new Error(' Operation cancelled');
				} else {
					function deleteFolderRecursive(path) {
						if (fs.existsSync(path)) {
							fs.readdirSync(path).forEach(function (file) {
								const curPath = path + "/" + file;
								if (fs.statSync(curPath).isDirectory()) { // recurse
									deleteFolderRecursive(curPath);
								} else { // delete file
									fs.unlinkSync(curPath);
								}
							});
							fs.rmdirSync(path);
						}
					};
					deleteFolderRecursive(answers.projectName || defaultProjectName);
				}
				return null;
			},
		},
		{
			type: 'list',
			name: 'templateName',
			message: '请选择你的模版',
			default: 'vite-vue3-ts',
			choices: [
				{ name: 'vite-vue3-ts (eslint,commitizen,sass)', value: 'vite-vue3-ts' },
			],
			when() {
				return !defaultTemplateName
			}
		},
	]);
	return {
		projectName: defaultProjectName,
		templateName: defaultTemplateName,
		...answers
	}

};
