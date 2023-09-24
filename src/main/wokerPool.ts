// @ts-ignore
// @ts-nocheck
import path from 'path';
import { Worker } from 'worker_threads';
import { ipcMain, BrowserWindow } from 'electron';
import { jsonString } from '../utils';

class WokerMapPool {
  wokers: Map<string, any>;

  constructor(options: {}) {
    this.wokers = new Map();
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this
  onWorkerMessage(message) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // 监听子worker的消息
    this.options.dataCallback(message.data);
    console.log('message', message);
  }

  // eslint-disable-next-line class-methods-use-this
  onWorkerError(error) {
    console.error('Worker error:', error);
  }

  addWorker(data) {
    // 构建woker
    const worker = new Worker(path.resolve(__dirname, './worker.js'), {
      workerData: data,
    });
    // 绑定事件的处理
    worker.on('message', (message) => {
      // 目前只接受更新的数据
      this.onWorkerMessage(message);
      console.log('Received message from worker:', message);
    });
    worker.on('error', (message) => {
      // 目前只接受更新的数据
      this.onWorkerError(message);
      console.log('Received message from worker:', message);
    });
    worker?.on('exit', (code) => {
      console.log('Worker exited with code:', code);
    });
    // 执行脚本
    this.wokers.set(data.id, worker);
    worker.postMessage({
      type: 'run',
      data,
    });
  }

  runScriptById(id, data) {
    this.wokers.get(id).postMessage({
      type: 'run',
      data,
    });
  }

  removeById(id) {
    this.wokers.get(id).postMessage({
      type: 'exit',
    });
    this.wokers.delete(id);
  }
}

export default new WokerMapPool({
  dataCallback: (data) => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => {
      win.webContents.send('updat-data', jsonString(data));
    });
  },
});
