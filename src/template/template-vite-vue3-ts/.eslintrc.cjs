/* eslint-env node */
module.exports = {
    env: {
        browser: true,
        node: true,
    },
    root: true,
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript',
        '@shiouhoo'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        'no-undef ': 'off'
    }
};
