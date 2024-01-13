import ts from 'rollup-plugin-typescript2';
// import terser from '@rollup/plugin-terser';
import path from 'path';
import { fileURLToPath } from 'url';
import dts from 'rollup-plugin-dts';

const __filenameNew = fileURLToPath(import.meta.url);
const __dirnameNew = path.dirname(__filenameNew);

// tsconfig.json合并选项
// 一般来说默认使用项目的tsconfig.json，如果有个别需要修改的如下，可以在此修改
const override = { compilerOptions: { module: 'esnext' } };

export default [
    {
        input: './src/index.ts',
        output: {
            file: path.resolve(__dirnameNew, 'dist/index.mjs'),
            format: 'module',
            sourcemap: false,
        },
        plugins: [
            ts({ tsconfig: './tsconfig.json', tsconfigOverride: override }),
            // terser(),
        ]
    },
    {
        input: './src/index.ts',
        output: {
            file: path.resolve(__dirnameNew, 'dist/index.js'),
            format: 'commonjs',
            sourcemap: false,
        },
        plugins: [
            ts({ tsconfig: './tsconfig.json', tsconfigOverride: override }),
        ]
    },
    {
        input: './src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es',
        },
        plugins: [dts({ tsconfig: './tsconfig.json' })],
    },
];