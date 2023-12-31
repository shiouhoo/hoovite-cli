import { UserOptions } from '../types';
import { vueAction } from './vueAction';
import { electronAction } from './electronAction';

export function initProject(
    options: UserOptions,
    pkg:Record<string, any>,
    cliPath:string,
    projectPath: string,
    viteConfig: string,
    mainFile: string): Record<string, string> {
    switch (options.templateName) {
    case 'vue3-ts':
        return vueAction(options, pkg, cliPath, projectPath, viteConfig, mainFile);
    case 'electron-vue':
        return electronAction(options, pkg, cliPath, projectPath, viteConfig, mainFile);
    }
}