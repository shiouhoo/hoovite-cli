// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';

export default defineConfig({
    shortcuts: {
        'flex-center': 'flex items-center justify-center',
    },
    presets: [
        presetAttributify(),
        presetUno(),
    ],
    rules: [
        // 文本超出省略
        // usage: class="ellipsis ellipsis-2 ellipsis-3"
        [/^ellipsis(-(\d*))?$/, ([,, d], { rawSelector }) => {
            return `.${rawSelector} {${
                Number(d) > 1
                    ? `overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: ${d}; -webkit-box-orient: vertical;`
                    : 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;'
            }}`;
        }],
    ],
});
