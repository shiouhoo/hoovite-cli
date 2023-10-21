/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOptions } from '../types';
import { copy } from '@/util';
import path from 'path';
/**
 *
 * @param options 用户选项
 * @param pkg package.json
 * @param projectPath 项目路径
 * @param cliPath 脚手架路径
 * @param viteConfig vite.config.ts
 * @returns vite.config.ts修改后内容
 */
export const vueAction = (options: UserOptions, pkg:Record<string, any>, cliPath:string, projectPath: string, viteConfig: string, mainFile: string): Record<string, string> => {
    if(options.templateName !== 'vue3-ts') return { viteConfig, mainFile };

    if(options.unocss) {
        // 修改 package.json
        pkg.devDependencies['unocss'] = '^0.56.5';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", "import { defineConfig } from 'vite';\r\nimport UnoCSS from 'unocss/vite';");
        viteConfig = viteConfig.replace('vue(),', 'vue(),\r\n\t\tUnoCSS()');
        // 复制 unocss.config.ts
        copy(path.join(cliPath, 'src/template/uno.config.ts'), path.join(projectPath, 'uno.config.ts'));
        // 改写 main.ts
        mainFile = mainFile.replace("createApp(App).mount('#app');", "import 'virtual:uno.css;'\r\n\r\ncreateApp(App).mount('#app');");
    }
    return { viteConfig, mainFile };
};