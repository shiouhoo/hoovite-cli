/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOptions } from '../types';
import pkgConfig from '../../pkg.config';
import { unocssElectronAction, elementPlusAction, antdvAction, vueRouterAction, piniaAction, axiosAction } from './pkgAction';
import path from 'path';

const importConfig = "import vue from '@vitejs/plugin-vue'";
/**
 *
 * @param options 用户选项
 * @param pkg package.json
 * @param projectPath 项目路径
 * @param cliPath 脚手架路径
 * @param viteConfig vite.config.ts
 * @returns vite.config.ts修改后内容
 */
export const electronAction = (options: UserOptions, pkg:Record<string, any>, cliPath:string, projectPath: string, viteConfig: string, mainFile: string): Record<string, string> => {
    if(options.templateName !== 'electron-vue') return { viteConfig, mainFile };

    // 自动导入
    pkg.devDependencies['unplugin-auto-import'] = pkgConfig['unplugin-auto-import'];
    pkg.devDependencies['unplugin-vue-components'] = pkgConfig['unplugin-vue-components'];

    const autoImportList = ['vue'];
    let autoImporResolvers = '';
    let componentsResolvers = '';

    if(options.unocss) {
        ({ viteConfig, mainFile } = unocssElectronAction(pkg, cliPath, projectPath, viteConfig, mainFile, importConfig));
    }
    // ui组件库
    if(options.uiComponet === 'element-plus') {
        ({ viteConfig, autoImporResolvers, componentsResolvers } = elementPlusAction(pkg, viteConfig, autoImporResolvers, componentsResolvers, importConfig));
    }else if (options.uiComponet === 'ant-design-vue') {
        ({ viteConfig, autoImporResolvers, componentsResolvers } = antdvAction(pkg, viteConfig, mainFile, autoImporResolvers, componentsResolvers, importConfig));
    }

    viteConfig = viteConfig.replace('componentsResolvers', componentsResolvers);
    viteConfig = viteConfig.replace('autoImporResolvers', autoImporResolvers);
    viteConfig = viteConfig.replace('autoImportList', JSON.stringify(autoImportList).replaceAll('"', '\''));

    // vue-router
    if(options.vueRouter) {
        ({ mainFile } = vueRouterAction(pkg, mainFile, cliPath, path.join(projectPath, 'src/renderer')));
    }

    // pinia
    if(options.pinia) {
        ({ mainFile } = piniaAction(pkg, mainFile, cliPath, path.join(projectPath, 'src/renderer')));
    }else{
        mainFile = mainFile.replace('[pinia]', '');
    }

    // axios
    if(options.axios) {
        axiosAction(pkg, cliPath, path.join(projectPath, 'src/renderer'));
    }

    return { viteConfig, mainFile };
};
