#!/usr/bin/env node
import { userOptions } from '@/option';
import { spinner, clearLoading } from './src/spinner.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';
import { copy } from '@/util.js';

const init = async () => {
    try {
        const option = await userOptions();
        const { templateName, projectName, overwrite } = option;
        if (overwrite) {
            clearLoading.start();
            await new Promise((resolve) => {
                const worker = new Worker(`${path.dirname(fileURLToPath(import.meta.url))}/clearDir.js`, { workerData: projectName });
                worker.on('message', resolve);
            });
            clearLoading.succeed();
        }
        spinner.start();
        const __dirname = path.resolve();
        const templateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), `template-${templateName}`);
        copy(templateDir, path.join(__dirname, projectName));

        const pkg = JSON.parse(
            fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8'),
        );
        pkg.name = projectName;
        fs.writeFileSync(path.join(__dirname, projectName + '/package.json'), JSON.stringify(pkg, null, 2) + '\n');

        spinner.succeed();
    } catch (e) {
        if (e.message === 'Operation cancelled') {
            return;
        }
        spinner.fail();
    }
};

init();

