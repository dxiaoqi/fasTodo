import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PluginType } from 'core';
import { Divider, List } from 'antd';
import './App.css';
import TodoHeader from './components/Header';
import Item from './components/Item';
import { jsonString, parsedObj } from '../utils';

function Hello() {
  const [config, setConfig] = useState<PluginType[]>([]);
  const addItem = (data: any) => {
    window.electron.ipcRenderer.sendMessage('do-task', {
      type: 'add',
      data: jsonString(data),
    });
    setConfig([...config, data]);
  };
  const changeConfig =
    (index: number) => (type: 'update' | 'delete', c: any) => {
      if (type === 'delete') {
        config.splice(index, index + 1);
        setConfig([...config]);
        window.electron.ipcRenderer.sendMessage('do-task', {
          type: 'delete',
          // eslint-disable-next-line no-underscore-dangle
          data: c.id,
        });
      } else {
        config.forEach((con) => {
          // eslint-disable-next-line no-underscore-dangle
          if (con.id === c.id) {
            config[index] = c;
          }
        });
        setConfig([...config]);
        window.electron.ipcRenderer.sendMessage('do-task', {
          type: 'update',
          data: jsonString(c),
        });
      }
    };
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('do-task', {
      type: 'init',
      data: jsonString(config),
    });
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.once('ipc-example', (arg) => {
      // eslint-disable-next-line no-console
      // setPath(arg);
      console.log(arg);
    });
    window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on('updat-data', (data) => {
      const nData = parsedObj(data);
      console.log(111, nData);
      config.forEach((con, index) => {
        // eslint-disable-next-line no-underscore-dangle
        if (con.id === nData.id) {
          config[index] = {
            ...config[index],
            ...nData,
          };
        }
      });
      setConfig([...config]);
    });
  }, [config]);
  return (
    <>
      <Divider orientation="left">Fuck Some Todo</Divider>
      <List
        size="large"
        header={<TodoHeader addItem={addItem} />}
        footer={<div>Stop Your Todo</div>}
        bordered
        dataSource={config}
        renderItem={(item, index) => (
          <Item onChange={changeConfig(index)} data={item as any} />
        )}
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
