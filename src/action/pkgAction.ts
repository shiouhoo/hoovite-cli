import pkgConfig from '../../pkg.config';
import { copy } from '@/util';
import path from 'path';

export function unocssAction(pkg:Record<string, any>, cliPath:string, projectPath: string, viteConfig: string, mainFile: string, importReplace: string): Record<string, string> {
    const importConfig = importReplace + "import UnoCSS from 'unocss/vite';\r\n";
    // 修改 package.json
    pkg.devDependencies['unocss'] = pkgConfig['unocss'];
    // 修改 vite.config.ts
    viteConfig = viteConfig.replace(importReplace, importConfig);
    viteConfig = viteConfig.replace('vue(),', 'vue(),\r\n        UnoCSS(),');
    // 复制 unocss.config.ts
    copy(path.join(cliPath, 'src/template/uno.config.ts'), path.join(projectPath, 'uno.config.ts'));
    // 改写 main.ts
    mainFile = mainFile.replace("createApp(App).mount('#app');", "import 'virtual:uno.css';\r\n\r\ncreateApp(App).mount('#app');");
    return {
        viteConfig,
        mainFile
    };
}

export function unocssElectronAction(pkg:Record<string, any>, cliPath:string, projectPath: string, viteConfig: string, mainFile: string, importReplace: string): Record<string, string> {
    ({ viteConfig, mainFile } = unocssAction(pkg, cliPath, projectPath, viteConfig, mainFile, importReplace));
    viteConfig = viteConfig.replace('vue(),\r\n        UnoCSS(),', 'vue(),\r\n            UnoCSS(),');
    return {
        viteConfig,
        mainFile
    };
}

export function elementPlusAction(pkg:Record<string, any>, viteConfig: string, autoImporResolvers: string, componentsResolvers:string, importReplace: string): Record<string, string> {
    const importConfig = importReplace + "import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';\r\n";
    autoImporResolvers += 'ElementPlusResolver()';
    componentsResolvers += 'ElementPlusResolver()';
    // 修改 package.json
    pkg.devDependencies['element-plus'] = pkgConfig['element-plus'];
    // 修改 vite.config.ts
    viteConfig = viteConfig.replace(importReplace, importConfig);
    return {
        viteConfig,
        autoImporResolvers,
        componentsResolvers
    };
}
export function antdvAction(pkg:Record<string, any>, viteConfig: string, mainFile:string, autoImporResolvers: string, componentsResolvers:string, importReplace: string): Record<string, string> {
    const importConfig = importReplace + "import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';\r\n";
    componentsResolvers += '\r\n                AntDesignVueResolver({\r\n                    importStyle: false\r\n                }),\r\n            ';
    // 修改 package.json
    pkg.devDependencies['ant-design-vue'] = pkgConfig['ant-design-vue'];
    // 修改 vite.config.ts
    viteConfig = viteConfig.replace(importReplace, importConfig);
    // 改写 main.ts
    mainFile = mainFile.replace("import App from './App.vue';", "import 'ant-design-vue/dist/reset.css';\r\nimport App from './App.vue';");
    return {
        viteConfig,
        autoImporResolvers,
        componentsResolvers
    };
}

export function vueRouterAction(pkg:Record<string, any>, mainFile: string, cliPath:string, projectPath:string): Record<string, string> {
    pkg.dependencies['vue-router'] = pkgConfig['vue-router'];
    // 改写 main.ts
    mainFile = mainFile.replace("import App from './App.vue';", "import router from './router';\r\nimport App from './App.vue';");
    mainFile = mainFile.replace('createApp(App)', 'createApp(App).use(router)');
    copy(path.join(cliPath, 'src/template/router'), path.join(projectPath, 'src/router'));
    return {
        mainFile
    };
}

export function piniaAction(pkg:Record<string, any>, mainFile: string, cliPath:string, projectPath:string): Record<string, string> {
    pkg.dependencies['pinia'] = pkgConfig['pinia'];
    // 改写 main.ts
    mainFile = mainFile.replace("import App from './App.vue';", "import { createPinia } from 'pinia';\r\nimport App from './App.vue';");
    mainFile = mainFile.replace('[pinia]', '\r\nconst pinia = createPinia();\r\n');
    mainFile = mainFile.replace('createApp(App)', 'createApp(App).use(pinia)');
    copy(path.join(cliPath, 'src/template/store'), path.join(projectPath, 'src/store'));
    return {
        mainFile
    };
}

export function axiosAction(pkg:Record<string, any>, cliPath:string, projectPath:string): void {
    pkg.dependencies['axios'] = pkgConfig['axios'];
    copy(path.join(cliPath, 'src/template/request.ts'), path.join(projectPath, 'src/utils/request.ts'));
    copy(path.join(cliPath, 'src/template/api'), path.join(projectPath, 'src/api'));
}