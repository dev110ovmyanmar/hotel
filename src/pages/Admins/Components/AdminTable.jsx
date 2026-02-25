import { Space, Table, Tag } from 'antd';
import { useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import AdminForm from "./AdminForm/AdminForm";

const AdminTable = ({data , page, perPage, total, changePage , changePerPage}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode,setMode] = useState(null);
  const [selectedData,setSelectedData] = useState({});
  const columns = [
    {
      title: 'No.',
      render:(_,record) => <div>{record?.id}</div>,
      width:70
    },
    {
      title: 'Admin Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    }, 
    {
      title: 'Admin Email',
      dataIndex: 'email',
      key: 'email',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (_,record) => <div>{record?.role.name}</div>
    },
    {
      title: 'Staff',
      dataIndex: 'staff',
      key: 'staff',
      render: text => <div>{text? text : "-"}</div>,
      width:70
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_,record) => 
      <Tag color={record?.status?.name === "Active"? "green" : "red"}>{record?.status?.name.toUpperCase()}</Tag>,
      width:150
    },
    {
      title: 'Action',
      render: (_, record) => {
         return (
          <Space size="middle">
            <AiTwotoneEye onClick={()=>{setDrawerOpen(true);setMode("view");setSelectedData(record)}} className="!text-blue-500"/>
            <FiEdit onClick={()=>{setDrawerOpen(true);setMode("edit");setSelectedData(record)}} className="!text-blue-500"/>
          </Space>
        )
      },

    },
  ];

  return (

    <div id="scrollId" className="w-full h-[63vh] overflow-y-auto " >
      
        <Table
          tableLayout="fixed"
          scroll={{ x: 1000 }}
          columns={columns}
          dataSource={data}
          rowKey="adminIdentifier"
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

        <AdminForm 
          mode={mode}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
    </div>
  )
};


export default AdminTable;