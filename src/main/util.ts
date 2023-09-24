/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

interface ImportModule {
  default?: any;
  [key: string]: any;
}

async function myImport(modulePath: string): Promise<ImportModule> {
  const code = (await fs.promises.readFile(
    modulePath,
    'utf8'
  )) as unknown as string;
  const module = { exports: {} };

  const { exports } = module;

  // eslint-disable-next-line no-new-func
  new Function('exports', code)(exports);

  return module.exports;
}

export async function loadPlugin(cb: (data: any) => void) {
  const pluginsDir = app.isPackaged
    ? path.join(process.resourcesPath, 'plugins')
    : path.join(__dirname, '../../plugins');

  const pluginList: any[] = [];
  fs.readdirSync(pluginsDir).forEach(async (file) => {
    const pluginPath = path.join(pluginsDir, file).replace(/\\/g, '/');
    // eslint-disable-next-line no-underscore-dangle
    const _p = pluginPath.slice(0, 2).toLowerCase() + pluginPath.slice(2);
    // 这里可以根据插件的文件类型进行过滤，例如只加载 .js 文件
    if (path.extname(file) === '.js') {
      try {
        const data = await myImport(_p);
        // 2. 使用eval执行代码
        pluginList.push(data.default);
      } catch (error) {
        console.log(222, error);
      }
    }
    cb(pluginList);
    return pluginList;
  });
}
