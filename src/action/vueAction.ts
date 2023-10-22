/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserOptions } from '../types';
import { copy } from '@/util';
import path from 'path';

let importConfig = `
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
`;
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

    // 自动导入
    pkg.devDependencies['unplugin-auto-import'] = '^0.16.6';

    const autoImportList = ['vue'];
    const autoImporResolvers = [];
    const componentsResolvers = [];

    if(options.unocss) {
        // 修改 package.json
        pkg.devDependencies['unocss'] = '^0.56.5';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", "import { defineConfig } from 'vite';\r\nimport UnoCSS from 'unocss/vite';");
        viteConfig = viteConfig.replace('vue(),', 'vue(),\r\n        UnoCSS(),');
        // 复制 unocss.config.ts
        copy(path.join(cliPath, 'src/template/uno.config.ts'), path.join(projectPath, 'uno.config.ts'));
        // 改写 main.ts
        mainFile = mainFile.replace("createApp(App).mount('#app');", "import 'virtual:uno.css';\r\n\r\ncreateApp(App).mount('#app');");
    }
    if(options.uiComponet === 'element-plus') {
        importConfig += "import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';";
        autoImporResolvers.push('ElementPlusResolver()');
        componentsResolvers.push('ElementPlusResolver()');
        // 修改 package.json
        pkg.dependencies['element-plus'] = '^2.4.1';
        pkg.devDependencies['unplugin-vue-components'] = '^0.25.2';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", importConfig);
        // 改写 main.ts
        mainFile = mainFile.replace("import App from './App.vue';", "import 'element-plus/dist/index.css';\r\nimport App from './App.vue';");
    }else if (options.uiComponet === 'ant-design-vue') {
        importConfig += "import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';";
        componentsResolvers.push('AntDesignVueResolver()');
        // 修改 package.json
        pkg.dependencies['ant-design-vue'] = '4.x';
        pkg.devDependencies['unplugin-vue-components'] = '^0.25.2';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", importConfig);
        // 改写 main.ts
        mainFile = mainFile.replace("import App from './App.vue';", "import 'ant-design-vue/dist/reset.css';\r\nimport App from './App.vue';");
    }

    viteConfig = viteConfig.replace('componentsResolvers', JSON.stringify(componentsResolvers).replaceAll('"', ''));
    viteConfig = viteConfig.replace('autoImporResolvers', JSON.stringify(autoImporResolvers).replaceAll('"', ''));
    viteConfig = viteConfig.replace('autoImportList', JSON.stringify(autoImportList).replaceAll('"', '\''));

    return { viteConfig, mainFile };
};
