#!/usr/bin/env node
import templates from './templates.js';
import { userOptions } from './option.js';
import minimist from 'minimist'
import downLoad from 'download-git-repo';
import { spinner } from './spinner.js';
import path from 'path'
import fs from 'fs'

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
        await userOptions(projectName, defaultTemplateName).then(option => {
            const { templateName, projectName } = option
            // spinner.start();
            const __dirname = path.resolve();
            const templateDir = path.join(__dirname, `template-${templateName}`);
            console.log(templateDir, process.cwd());
            // copyDir('./hh', path.join(__dirname))
            // downLoad('direct:' + templates[templateName].downloadSrc, projectName, { clone: true }, (err) => {
            //     if (err) {
            //         spinner.fail();
            //         console.log(err);
            //     } else {
            //         spinner.succeed();
            //         console.log('下载成功');
            //     }
            // });
        });
    } catch (e) {
        console.log('退出', e);
    }
}

init();


