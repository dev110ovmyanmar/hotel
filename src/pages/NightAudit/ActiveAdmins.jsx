
import React from 'react';
import { Table } from 'antd';
import { AiOutlineDesktop } from 'react-icons/ai';
const columns = [
  {
    title: 'Active Admins (6)',
    dataIndex: 'activeName',
    key: 'activeName',
    render: text => <div>{text}</div>,
  },
  {
    title: 'Device Name',
    dataIndex: 'deviceName',
    key: 'deviceName',
    render: text => (
      <div className="flex items-center gap-1 justify-end">
        <AiOutlineDesktop fontSize={20} />
        <span>{text}</span>
      </div>
    ),
    align: "right"
  },

];
const data = [
  {
    key: '1',
    activeName: 'John Brown',
    deviceName: "DeSKTOP-V"
  },
  {
    key: '2',
    activeName: 'John Brown',
    deviceName: "DeSKTOP-V"
  },
  {
    key: '3',
    activeName: 'John Brown',
    deviceName: "DeSKTOP-V"
  },
];
const ActiveAdmins = () => <Table columns={columns} dataSource={data} pagination={false} />;
export default ActiveAdmins;