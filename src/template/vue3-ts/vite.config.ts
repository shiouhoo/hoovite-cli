import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: autoImportList,
            resolvers: [autoImporResolvers],
            dts: 'src/auto-import.d.ts',
        }),
        Components({
            dirs: ['src/components'],
            resolvers: [componentsResolvers],
            dts: 'src/components.d.ts',
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
