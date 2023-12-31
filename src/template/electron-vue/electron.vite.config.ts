import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
    main: {
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [
            vue(),
            AutoImport({
                imports: autoImportList,
                resolvers: [autoImporResolvers],
                dts: 'src/renderer/src/auto-import.d.ts',
            }),
            Components({
                dirs: ['src/components'],
                resolvers: [componentsResolvers],
                dts: 'src/renderer/src/components.d.ts',
            })
        ]
    }
});
