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
    let autoImporResolvers = '';
    let componentsResolvers = '';

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
    // ui组件库
    if(options.uiComponet === 'element-plus') {
        importConfig += "import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';";
        autoImporResolvers += 'ElementPlusResolver()';
        componentsResolvers += 'ElementPlusResolver()';
        // 修改 package.json
        pkg.dependencies['element-plus'] = '^2.4.1';
        pkg.devDependencies['unplugin-vue-components'] = '^0.25.2';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", importConfig);

    }else if (options.uiComponet === 'ant-design-vue') {
        importConfig += "import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';";
        componentsResolvers += '\r\n                AntDesignVueResolver({\r\n                    importStyle: false\r\n                }),\r\n            ';
        // 修改 package.json
        pkg.dependencies['ant-design-vue'] = '^4.0.6';
        pkg.devDependencies['unplugin-vue-components'] = '^0.25.2';
        // 修改 vite.config.ts
        viteConfig = viteConfig.replace("import { defineConfig } from 'vite';", importConfig);
        // 改写 main.ts
        mainFile = mainFile.replace("import App from './App.vue';", "import 'ant-design-vue/dist/reset.css';\r\nimport App from './App.vue';");
    }

    viteConfig = viteConfig.replace('componentsResolvers', componentsResolvers);
    viteConfig = viteConfig.replace('autoImporResolvers', autoImporResolvers);
    viteConfig = viteConfig.replace('autoImportList', JSON.stringify(autoImportList).replaceAll('"', '\''));

    // vue-router
    if(options.vueRouter) {
        pkg.dependencies['vue-router'] = '^4.2.5';
        // 改写 main.ts
        mainFile = mainFile.replace("import App from './App.vue';", "import router from './router';\r\nimport App from './App.vue';");
        mainFile = mainFile.replace('createApp(App)', 'createApp(App).use(router)');
        copy(path.join(cliPath, 'src/template/router'), path.join(projectPath, 'src/router'));
    }

    // pinia
    if(options.pinia) {
        pkg.dependencies['pinia'] = '^2.1.7';
        // 改写 main.ts
        mainFile = mainFile.replace("import App from './App.vue';", "import { createPinia } from 'pinia';\r\nimport App from './App.vue';");
        mainFile = mainFile.replace('[pinia]', 'const pinia = createPinia();\r\n');
        mainFile = mainFile.replace('createApp(App)', 'createApp(App).use(pinia)');
        copy(path.join(cliPath, 'src/template/store'), path.join(projectPath, 'src/store'));
    }else{
        mainFile = mainFile.replace('[pinia]', '');
    }

    // axios
    if(options.axios) {
        pkg.dependencies['axios'] = '^1.6.0';
        copy(path.join(cliPath, 'src/template/request.ts'), path.join(projectPath, 'src/utils/request.ts'));
        copy(path.join(cliPath, 'src/template/api'), path.join(projectPath, 'src/api'));
    }

    return { viteConfig, mainFile };
};
