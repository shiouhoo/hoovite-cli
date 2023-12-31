import darwin from './darwin';
import win32 from './win32';

if(process.platform === 'darwin') {
    darwin();
}else if (process.platform === 'win32') {
    win32();
}