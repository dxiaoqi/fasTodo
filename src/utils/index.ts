export const jsonString = (obj: any) =>
  JSON.stringify(obj, (key, value) => {
    // 如果属性值是函数，则转换为字符串形式
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  });

// 反序列化过程
// eslint-disable-next-line @typescript-eslint/no-shadow
export const parsedObj = (jsonString: any) =>
  JSON.parse(jsonString, (key, value) => {
    // 如果属性值是字符串，并且可以转换为函数，则转换为函数对象
    if (typeof value === 'string' && value.startsWith('function')) {
      // eslint-disable-next-line no-eval
      return eval(`(${value})`);
    }
    return value;
  });
