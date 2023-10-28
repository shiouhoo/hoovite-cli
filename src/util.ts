import fs from 'fs';
import path from 'path';

/**
 * 复制文件以及文件夹
 * @param src 源文件
 * @param dest 目标文件
 */
export function copy(src: string, dest: string) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
            const srcFile = path.resolve(src, file);
            const destFile = path.resolve(dest, file);
            copy(srcFile, destFile);
        }
    } else {
        // 目录不存在创建
        if(fs.existsSync(path.dirname(dest)) === false) {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
        }
        fs.copyFileSync(src, dest);
    }
}
