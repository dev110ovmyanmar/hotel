import { Dropdown, Space, Table, Tag , Button } from 'antd';
import { useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import LocationForm from './LocationForm/LocationForm';
import { MoreOutlined } from '@ant-design/icons';

const LocationTable = ({data , page, perPage, total, changePage , changePerPage}) => {
  console.log(data,"DataInLocationTable");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen,setModalOpen] = useState(false);
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
      title: 'Country',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
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
              <Space onClick={()=>{setModalOpen(true);setMode("edit");setSelectedData(record)}}>
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
          rowKey="locationIdentifier"
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

        <LocationForm 
          mode={mode}
          drawerOpen={ mode === "view" && drawerOpen}
          setDrawerOpen={mode === "view" && setDrawerOpen}
          modalOpen={ mode === "edit" && modalOpen}
          setModalOpen={mode === "edit" && setModalOpen}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
    </div>
  )
};


export default LocationTable;