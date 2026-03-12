 import { Dropdown, Space, Table, Tag, Button } from 'antd';
 import { useState } from "react";
 import { MoreOutlined } from '@ant-design/icons';
 import { EyeOutlined } from '@ant-design/icons';
 import { EditOutlined } from '@ant-design/icons';
import ServiceForm from './ServiceForm/ServiceForm';
 
 const ServiceTable = ({ data, page , setPage, perPage, total, changePage, changePerPage }) => {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const [mode, setMode] = useState(null);
   const [selectedData, setSelectedData] = useState({});
 
   const columns = [
     {
       title: 'ID',
       render: (_, record) => <div>{record?.id}</div>,
       width: 70,
     },
     {
       title: 'Name',
       dataIndex: 'name',
       key: 'name',
     },
     {
       title: 'Price (MMK)',
       dataIndex: 'basePrice',
       key: 'basePrice',
     },
      {
       title: 'Property',
       dataIndex: ["property", "name"],
       key: 'property',
     },
     {
       title: 'Billing Type',
       dataIndex: ["billingType", "name"],
       key: 'billingType',
     },
      {
       title: 'Service Type',
       dataIndex: ["serviceType", "name"],
       key: 'serviceType',
     },
     {
       title: 'Status',
       dataIndex: ["status","name"],
       key: 'status',
       render: (_, record) => (
        <Tag color={record?.status?.name === "Active" ? "green" : "red"}>
          {record?.status?.name.toUpperCase()}
        </Tag>
      ),
     },
     {
       title: "Action",
       render: (_, record) => {
         const smallStyle = { fontSize: "12px" };
 
         const items = [
           {
             key: "1",
             label: (
               <Space
                 size={4}
                 style={smallStyle}
                 onClick={() => {
                   setDrawerOpen(true);
                   setMode("view");
                   setSelectedData(record);
                 }}
               >
                 <EyeOutlined style={{ fontSize: "12px" }} />
                 <span style={{ fontSize: "14px" }}>View</span>
               </Space>
             ),
           },
           {
             key: "2",
             label: (
               <Space
                 size={4}
                 style={smallStyle}
                 onClick={() => {
                   setDrawerOpen(true);
                   setMode("edit");
                   setSelectedData(record);
                 }}
               >
                 <EditOutlined style={{ fontSize: "12px" }} />
                 <span style={{ fontSize: "14px" }}>Edit</span>
               </Space>
             ),
           },
         ];
 
         return (
           <Dropdown menu={{ items }} trigger={["click"]}>
             <MoreOutlined style={{ fontSize: "16px" }} />
           </Dropdown>
         );
       },
     },
   ];
 
   return (
     <div id="scrollId" className="w-full h-[63vh] " >
       <Table
         tableLayout="fixed"
         scroll={{ x: 1000 }}
         columns={columns}
         dataSource={data}
         rowKey="uuid"
         pagination={{
           current: page,
           pageSize: perPage,
           total: total,
           onChange: (page, perPage) => {
             changePage(page);
             changePerPage(perPage)
           },
           showSizeChanger: true
         }}
       />
 
       <ServiceForm
         page={page}
         setPage={setPage}
         mode={mode}
         setMode={setMode}
         drawerOpen={drawerOpen}
         setDrawerOpen={setDrawerOpen}
         selectedData={selectedData}
         setSelectedData={setSelectedData}
         width={500}
       />
     </div>
   )
 };
 
 
 export default ServiceTable;