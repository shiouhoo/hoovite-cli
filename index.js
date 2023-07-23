#!/usr/bin/env node
import templates from './templates.js';
import { userOptions } from './option.js';
import minimist from 'minimist'
import downLoad from 'download-git-repo';
import { spinner } from './spinner.js';
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from "url";

const argv = minimist(process.argv.slice(2));

const projectName = argv._[0]
const defaultTemplateName = typeof argv.t !== 'boolean' ? argv.t : ""

function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    } else {
        fs.copyFileSync(src, dest);
    }
}

function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
}

const init = async () => {
    if (defaultTemplateName && !templates[defaultTemplateName]) {
        console.log("没有此模板！");
        return;
    }
    try {
        const option = await userOptions(projectName, defaultTemplateName)
        const { templateName, projectName } = option
        spinner.start();
        const __dirname = path.resolve();
        const templateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), `template-${templateName}`);
        copyDir(templateDir, path.join(__dirname, projectName));

        const pkg = JSON.parse(
            fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
        );
        pkg.name = projectName;
        fs.writeFileSync(path.join(__dirname, projectName + '/package.json'), JSON.stringify(pkg, null, 2) + '\n');

        spinner.succeed();
        console.log('创建成功');
    } catch (e) {
        spinner.fail();
        console.log('退出', e);
    }
}

init();


