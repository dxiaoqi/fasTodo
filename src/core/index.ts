// 数据
export type Schema = {
  input: {
    value: string;
  };
  // 展示的内容
  check: {
    value: boolean;
  };
  time: {
    value: number;
  };
};
export type PluginType = {
  type: string;
  title: string;
  schema: Schema;
  script: (data: any, win: any) => {};
};

export const Plugins = new Map<string, PluginType>();
