import globals from "globals";
import pluginJs from "@eslint/js";
import babelParser from "@babel/eslint-parser";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.es2022,
        ...globals.browser,
        ...globals.node,
      },
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
        }
      }
    },
    rules: {
      "indent": ["error", 2, { "ObjectExpression": "first" }],
      "space-before-function-paren": ["error", "never"], // 函数括号前需要空格
      "space-in-parens": ["error", "never"], // 括号内不需要空格
      "space-before-blocks": ["error", "always"], // 代码块前需要空格
      "keyword-spacing": ["error", { "before": true, "after": true }], // 关键字前后需要空格
      "comma-spacing": ["error", { "before": false, "after": true }], // 逗号前不需要空格，逗号后需要空格
      "object-curly-spacing": ["error", "always"], // 对象花括号内需要空格
      "array-bracket-spacing": ["error", "never"], // 数组方括号内不需要空格
      "semi-spacing": ["error", { "before": false, "after": true }], // 分号前不需要空格，分号后需要空格
      "space-infix-ops": ["error"], // 操作符周围需要空格
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }], // 最多允许一个空行
      "padded-blocks": ["error", "never"], // 代码块中不允许填充空行
      "no-trailing-spaces": ["error"] // 不允许行尾空格
    }
  },
  pluginJs.configs.recommended,
];