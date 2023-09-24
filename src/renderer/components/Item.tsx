import { Button, Checkbox, List } from 'antd';
import { PluginType } from 'core';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css';

function Item(props: {
  data: PluginType;
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: (type: 'update' | 'delete', c: any) => void;
}) {
  const onChange = (e: any) => {
    props?.onChange('update', {
      ...props?.data,
      checked: e.target.checked,
    });
  };
  const changeTime = (d: any) => {
    // eslint-disable-next-line no-underscore-dangle
    const _d = dayjs(d).unix();
    props?.onChange('update', {
      ...props?.data,
      time: _d,
    });
  };

  const deleteItem = () => {
    props?.onChange('delete', {});
  };
  return (
    <List.Item>
      {props?.data?.text && (
        <Checkbox checked={props?.data?.checked} onChange={onChange}>
          {props?.data?.text}
        </Checkbox>
      )}
      {props?.data?.schema?.time !== undefined && (
        <DatePicker
          selected={
            props?.data?.time &&
            dayjs.unix(props?.data?.time as unknown as number).toDate()
          }
          onChange={(date) => changeTime(date)}
          showTimeSelect
          timeFormat="p"
          timeIntervals={1}
          dateFormat="Pp"
        />
      )}
      <Button onClick={deleteItem}>Delete</Button>
    </List.Item>
  );
}

export default Item;
