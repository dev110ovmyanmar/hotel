import { Dropdown, Space, Table, Tag, Button } from 'antd';
import { useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { MoreOutlined } from '@ant-design/icons';
import AmenitiesForm from './AmenitiesForm/AmenitiesForm';

const AmenitiesTable = ({data , page, perPage, total, changePage , changePerPage}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode,setMode] = useState(null);
  const [selectedData,setSelectedData] = useState({});
  
  const columns = [
    {
      title: 'Id',
      render:(_,record) => <div>{record?.id}</div>,
      width:70,
      align:'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Is Free',
      dataIndex: 'isFree',
      key: 'isFree',
      render: text => <div>{text === 1  ? "True" : "False"}</div>,
    },
     {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      render: text => <div>{text === 1 ? "True" : "False" }</div>,
    },  
    {
      title: 'Default Quantity',
      dataIndex: 'defaultQuantity',
      key: 'defaultQuantity',
      render: text => <div>{text }</div>,
    },  
    {
      title: 'Action',
      render: (_, record) => {
        const items = [
          {
            key:"1",
            label: (
              <Space onClick={()=>{setDrawerOpen(true);setMode("view");setSelectedData(record)}} >
                  <AiTwotoneEye />
                  <span >View</span>
              </Space>
            )
          },
          {
            key:"2",
            label: (
              <Space onClick={()=>{setDrawerOpen(true);setMode("edit");setSelectedData(record)}}>
                  <FiEdit  />
                  <span >Edit</span>
              </Space>
            )
          }
        ];

        return (
          <Dropdown menu={{items}} placement='topLeft' trigger={["click"]}>
            <Button icon={<MoreOutlined/>}></Button>
          </Dropdown>          
        )
      },

    },
  ];
  
  return (
    <div id="scrollId" className="w-full h-[63vh] " >
        <Table
          size='small'
          tableLayout="fixed"
          scroll={{ x: 1000 }}
          columns={columns}
          dataSource={data}
          rowKey="uuid"
          pagination = {{
            current:page,
            pageSize:perPage,
            total:total,
            onChange:(page,perPage)=>{
              changePage(page);
              changePerPage(perPage)
            },
            showSizeChanger: true
          }}
        />

        <AmenitiesForm
          mode={mode}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
    </div>
  )
};


export default AmenitiesTable;