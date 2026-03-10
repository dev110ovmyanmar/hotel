// import React, { useEffect, useState } from "react";
// import { Space, Table, Drawer, Button, Dropdown } from "antd";
// import { InboxOutlined, MoreOutlined, UploadOutlined } from "@ant-design/icons";
// import GuestForm from "./GuestForm/GuestForm";

// const GuestTable = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [currentMode, setCurrentMode] = useState(mode);
//     const [mode, setMode] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [selectedData, setSelectedData] = useState(null);

//   const isView = mode === "view";
//   const isEdit = mode === "edit";
//   const isAdd = mode === "add";

//   const DrawerTitle = isView
//     ? "Guest Details"
//     : isEdit
//       ? "Guest Edit"
//       : isAdd
//         ? "Add Guest"
//         : "";

//   const onClose = () => {
//     setOpen(false);
//     setSelectedRow(null);
//   };

//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//     },
//     {
//       title: "Guest Name",
//       dataIndex: "guestName",
//       key: "guestName",
//     },
//     {
//       title: "NRC",
//       dataIndex: "nrc",
//       key: "nrc",
//     },
//     {
//       title: "Passport",
//       dataIndex: "passport",
//       key: "passport",
//     },

//     {
//       title: "Room No",
//       dataIndex: "roomNo",
//       key: "roomNo",
//     },
//     {
//       title: "Phone Number",
//       dataIndex: "phoneNo",
//       key: "phoneNo",
//     },
//     {
//       title: "Guest",
//       dataIndex: "guest",
//       key: "guest",
//     },
//     {
//       title: "Nationality",
//       dataIndex: "nationality",
//       key: "nationality",
//     },
//     {
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
//                   setDrawerOpen(true);
//                   setMode("edit");
//                   setSelectedData(record);
//                 }}
//               >
//                 <EditOutlined style={{ fontSize: "12px" }} />
//                 <span style={{ fontSize: "14px" }}>Edit</span>
//               </Space>
//             ),
//           },
//           {
//             key: "3",
//             label: (
//               <Space
//                 size={4}
//                 style={smallStyle}
//                 onClick={() => {
//                   setConfirmModal(true);
//                   setSelectedData(record);
//                 }}
//               >
//                 <UploadOutlined style={{ fontSize: "12px" }} />
//                 <span style={{ fontSize: "14px" }}>Upload File</span>
//               </Space>
//             ),
//           },
//           {
//             key: "4",
//             label: (
//               <Space
//                 size={4}
//                 style={smallStyle}
//                 onClick={() => {
//                   setConfirmModal(true);
//                   setSelectedData(record);
//                 }}
//               >
//                 <InboxOutlined style={{ fontSize: "12px" }} />
//                 <span style={{ fontSize: "14px" }}>Guest Note</span>
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
//     <>
//       <div className="mb-2 flex items-center justify-between">
//         <span className="ml-5">Reservation id: 123212321</span>
//         <div className="mr-5">
//           <Button
//             type="primary"
//             size="middle"
//             onClick={() => {
//               setSelectedRow(null);
//               setCurrentMode("add");
//               setOpen(true);
//             }}
//           >
//             Add Guest
//           </Button>
//         </div>
//       </div>

//       <Table
//         columns={columns}
//         // dataSource={}
//         rowKey="id"
//         className="mx-5"
//       />

//       <Drawer title={DrawerTitle} size={550} onClose={onClose} open={open}>
//         <GuestForm mode={mode} selectedData={selectedData} />
//       </Drawer>
//     </>
//   );
// };

// export default GuestTable;
import { Button, Dropdown, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";
import {
  KeyOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import GuestForm from "./GuestForm/GuestForm";

const GuestTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "NRC",
      dataIndex: "nrc",
      key: "nrc",
    },
    {
      title: "Passport",
      dataIndex: "passport",
      key: "passport",
    },

    {
      title: "Room No",
      dataIndex: "roomNo",
      key: "roomNo",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      title: "Guest",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
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
          {
            key: "3",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setConfirmModal(true);
                  setSelectedData(record);
                }}
              >
                <UploadOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Upload File</span>
              </Space>
            ),
          },
          {
            key: "4",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setConfirmModal(true);
                  setSelectedData(record);
                }}
              >
                <InboxOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Guest Note</span>
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
    <div id="scrollId">
      <Table
        // size="small"
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="adminIdentifier"
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

      <GuestForm
        mode={mode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        width={500}
      />
    </div>
  );
};

export default GuestTable;
