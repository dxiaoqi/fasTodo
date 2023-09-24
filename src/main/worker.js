const { workerData, parentPort } = require('worker_threads');
const notifier = require('node-notifier');
const dayjs = require('dayjs');
// 获取当前数据结构信息
const dataStructure = workerData;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { script } = dataStructure;
// 在函数内部处理数据结构信息
// eslint-disable-next-line no-new-func
const functionToExecute = new Function(`return ${script}`)();
// 构建执行脚本
const run = (data) => {
  const handler = {
    set(target, property, value) {
      target[property] = value;
      console.log('post');
      parentPort.postMessage({ data });
    },
  };
  const proxy = new Proxy(data, handler);
  functionToExecute(proxy, { notifier, dayjs });
};

// 监听主线程发送的消息
parentPort?.on('message', (message) => {
  console.log(999, message);
  if (message.type === 'run') {
    // 执行脚本呢
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { script: nScript, schema: __, ...rest } = message.data;
    console.log(message.data);
    run(rest);
  }
  if (message.type === 'exit') {
    // 退出
    process.exit(0);
  }
});
process.on('uncaughtException', (err) => {
  console.error('未捕获异常:', err);
});
