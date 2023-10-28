import { workerData, parentPort } from 'worker_threads';
import fs from 'fs';
import path from 'path';

function deleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(function (file) {
            const curPath = path.join(folderPath, file);
            // recurse
            if (fs.existsSync(curPath) && fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}
try{
    deleteFolderRecursive(workerData);
    parentPort.postMessage({ status: 'Done' });
}catch(e) {
    parentPort.postMessage({ status: 'error', error: e });
}
