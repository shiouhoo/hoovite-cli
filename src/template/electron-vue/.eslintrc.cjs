/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    ignorePatterns: ['node_modules/*', 'out/*', 'build/*'],
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@electron-toolkit',
        '@electron-toolkit/eslint-config-ts/eslint-recommended',
        '@vue/eslint-config-typescript/recommended',
        '@shiouhoo',
    ],
    rules: {
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off'
    }
};
