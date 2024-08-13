import { createServer } from './server.js';
import { add } from './job.js';
/**
 * 任务注册之后，可以通过请求路径来调用任务，如 axios.get('/add'),会调用 add 函数并返回结果
 */
createServer({
  port: 3000,
  // 任务列表
  task: {
    add
  }
});