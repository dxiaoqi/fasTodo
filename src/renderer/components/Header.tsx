// @ts-ignore
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import styles from './index.module.scss';
import { parsedObj } from '../../utils';
import { v4 } from 'uuid';
const layout = {
  labelCol: { span: 8 },
};
const { Option } = Select;
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */
const getModule = (data: string) => {
  // eslint-disable-next-line no-eval
  const module = eval(data);
  // // 3. 获取default属性的值
  return module.default;
};
// eslint-disable-next-line react/prop-types
function TodoHeader(props: any) {
  const [pluginList, setPluginList] = useState<any[]>([]);
  useEffect(() => {
    window.electron.ipcRenderer.once('get-plugins', (arg: any) => {
      // eslint-disable-next-line no-console
      try {
        // eslint-disable-next-line no-underscore-dangle
        const _plugins = parsedObj(arg);
        console.log(_plugins);
        setPluginList(_plugins);
      } catch (error) {
        console.log(error);
      }
    });
    window.electron.ipcRenderer.sendMessage('get-plugins', ['ping']);
  }, []);

  const onFinish = (values: any) => {
    const defaultValue = pluginList.filter(
      (p) => p.type === values.type || 'default'
    )[0];
    props?.addItem({
      id: v4(),
      ...defaultValue,
      ...values,
      type: values.type || 'default',
    });
  };

  const suffixSelector = (
    <Form.Item name="type" noStyle>
      <Select defaultValue="default" style={{ width: 100 }}>
        {pluginList.map((p) => (
          <Option value={p.type}>{p.label}</Option>
        ))}
      </Select>
    </Form.Item>
  );
  return (
    <Form
      className={styles['header-form']}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item name="text" rules={[{ required: true }]}>
        <Input style={{ width: '100%' }} addonAfter={suffixSelector} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
}

export default TodoHeader;
