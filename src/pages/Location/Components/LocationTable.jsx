// import { Dropdown, Space, Table, Tag , Button } from 'antd';
// import { useState } from "react";
// import { AiTwotoneEye } from "react-icons/ai";
// import { FiEdit } from "react-icons/fi";
// import LocationForm from './LocationForm/LocationForm';
// import { EditOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';

// const LocationTable = ({data , page,setPage, perPage, total, changePage , changePerPage}) => {
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [modalOpen,setModalOpen] = useState(false);
//   const [mode,setMode] = useState(null);
//   const [selectedData,setSelectedData] = useState({});
  
//   const columns = [
//     {
//       title: 'ID',
//       render:(_,record) => <div>{record?.id}</div>,
//       width:70,
//       align:'center'
//     },
//     {
//       title: 'Country',
//       dataIndex: 'name',
//       key: 'name',
//       render: text => <div>{text}</div>,
//     }, 
//   {
//       title: "Action",
//       render: (_, record) => {
//         const smallStyle = { fontSize: "12px" };

//         const items = [
//           {
//             key: "1",
//             label: (
//               <Space
//                 size={4}
//                 style={smallStyle}
//                 onClick={() => {
//                   setDrawerOpen(true);
//                   setMode("view");
//                   setSelectedData(record);
//                   // setPage(1);
//                 }}
//               >
//                 <EyeOutlined style={{ fontSize: "12px" }} />
//                 <span style={{ fontSize: "14px" }}>View</span>
//               </Space>
//             ),
//           },
//           {
//             key: "2",
//             label: (
//               <Space
//                 size={4}
//                 style={smallStyle}
//                 onClick={() => {
//                   setModalOpen(true);
//                   setMode("edit");
//                   setSelectedData(record);
//                 }}
//               >
//                 <EditOutlined style={{ fontSize: "12px" }} />
//                 <span style={{ fontSize: "14px" }}>Edit</span>
//               </Space>
//             ),
//           },
//         ];

//         return (
//           <Dropdown menu={{ items }} trigger={["click"]}>
//             <MoreOutlined style={{ fontSize: "16px" }} />
//           </Dropdown>
//         );
//       },
//     },
//   ];

//   return (
//     <div id="scrollId" className="w-full h-[63vh] " >
//         <Table
//           tableLayout="fixed"
//           scroll={{ x: 1000 }}
//           columns={columns}
//           dataSource={data}
//           rowKey="locationIdentifier"
//           pagination = {{
//             current:page,
//             pageSize:perPage,
//             total:total,
//             onChange:(page,perPage)=>{
//               changePage(page);
//               changePerPage(perPage)
//             },
//             showSizeChanger: true
//           }}
//         />

//         <LocationForm 
//           mode={mode}
//           page={page}
//           setPage={setPage}
//           setMode={setMode}
//           drawerOpen={ mode === "view" && drawerOpen}
//           setDrawerOpen={mode === "view" && setDrawerOpen}
//           modalOpen={ mode === "edit" && modalOpen}
//           setModalOpen={mode === "edit" && setModalOpen}
//           selectedData={selectedData}
//           setSelectedData={setSelectedData}
//         />
//     </div>
//   )
// };


// export default LocationTable;


import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import LocationForm from "./LocationForm/LocationForm";
import usePermission from "../../../hooks/usePermission"; // Permission hook
import { PERMISSIONS } from "../../../variables/permission";

const LocationTable = ({ data, page, setPage, perPage, total, changePage, changePerPage }) => {
  const { hasPermission } = usePermission();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // optional if using modal in form
  const [mode, setMode] = useState(null); // "view" | "edit" | "add"
  const [selectedData, setSelectedData] = useState(null);

  const columns = [
    { 
      title: "ID", 
      dataIndex: "id", 
      key: "id", 
      width: 70, 
      align: "center" 
    },
    { 
      title: "Country", 
      dataIndex: "name", 
      key: "name" 
    },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.LOCATION_VIEW,
            onClick: () => {
              setDrawerOpen(true);
              setMode("view");
              setSelectedData(record);
            },
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.LOCATION_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
        ];

        // Filter actions by permission
        const items = actions
          .filter(action => !action.permission || hasPermission(action.permission))
          .map(action => ({
            key: action.key,
            label: (
              <Space size={4} style={smallStyle} onClick={action.onClick}>
                {action.icon}
                <span style={{ fontSize: "14px" }}>{action.label}</span>
              </Space>
            ),
          }));

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div id="scrollId" className="w-full">
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
            changePerPage(perPage);
          },
          showSizeChanger: true,
        }}
      />

      <LocationForm
        mode={mode}
        page={page}
        setPage={setPage}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        modalOpen={modalOpen} // optional
        setModalOpen={setModalOpen} // optional
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default LocationTable;