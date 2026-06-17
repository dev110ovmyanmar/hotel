// import React, { useState } from "react";
// import { Drawer, Table, Space, Button, Tooltip } from "antd";
// import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
// import useApiQuery from "../../../../../../hooks/useApiQuery";
// import { reservationGuestList } from "../../../../../../api/reservationSectionApi";
// import { LIMITS } from "../../../../../../variables/constants";

// const GuestListDrawer = ({
//   drawerOpen,
//   setDrawerOpen,
//   selectedData,
//   setGuestOpen,
//   setGuestFormMode,
//   setSelectedGuestData,
// }) => {
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
//   const [keyword, setKeyword] = useState("");
//   const [showActiveOnly, setShowActiveOnly] = useState(true);

//   const { data, isLoading } = useApiQuery({
//     fetchQueryName: "reservation-guest",
//     fetchQueryFunction: reservationGuestList,
//     params: {
//       pagination: { page, perPage },
//       keyword,
//       reservationRoom: { uuid: selectedData?.uuid },
//       status: showActiveOnly,
//     },
//   });

//   const handleView = (record) => {
//     setSelectedGuestData(record);
//     setGuestFormMode("view");
//     setGuestOpen(true);
//   };

//   const handleEdit = (record) => {
//     setSelectedGuestData(record);
//     setGuestFormMode("edit");
//     setGuestOpen(true);
//   };

//   const columns = [
//     {
//       title: "Name",
//       key: "name",
//       render: (_, record) => record?.guest?.name || record?.name || "-",
//     },
//     {
//       title: "NRC",
//       dataIndex: ["guest", "nrcNo"],
//       key: "nrc",
//       render: (text) => (text ? text : "-"),
//     },
//     {
//       title: "Phone",
//       dataIndex: ["guest", "phone"],
//       key: "phone",
//       render: (text) => (text ? text : "-"),
//     },
//     {
//       title: "Guest Type",
//       dataIndex: "isPrimary",
//       key: "isPrimary",
//       render: (text) => (
//         <div>{text === true ? "Main Guest" : "Share Guest"}</div>
//       ),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Tooltip title="View Details">
//             <Button
//               size="small"
//               type="text"
//               icon={<EyeOutlined />}
//               onClick={() => handleView(record)}
//             />
//           </Tooltip>
//           <Tooltip title="Edit Guest">
//             <Button
//               size="small"
//               type="text"
//               icon={<EditOutlined />}
//               onClick={() => handleEdit(record)}
//             />
//           </Tooltip>
//           <Tooltip title="File Upload">
//             <Button
//               size="small"
//               type="text"
//               icon={<UploadOutlined />}
//               onClick={() => handleUpload(record)}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <Drawer
//       title="Guest List"
//       placement="right"
//       width={700}
//       onClose={() => setDrawerOpen(false)}
//       open={drawerOpen}
//     >
//       <div>
//         <Table
//           loading={isLoading}
//           columns={columns}
//           dataSource={data?.data}
//           rowKey={(record) => record.uuid}
//           pagination={false}
//         />
//       </div>
//     </Drawer>
//   );
// };

// export default GuestListDrawer;
import React, { useState } from "react";
import { Drawer, Table, Space, Button, Tooltip } from "antd";
import { EditOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { reservationGuestList } from "../../../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../../../variables/constants";

const GuestListDrawer = ({
  drawerOpen,
  setDrawerOpen,
  selectedData,
  setGuestOpen,
  setGuestFormMode,
  setSelectedGuestData,
  setUploadOpen,
  setSelectedUploadRow,
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [keyword, setKeyword] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "reservation-guest",
    fetchQueryFunction: reservationGuestList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid: selectedData?.uuid },
      status: showActiveOnly,
    },
  });

  const handleView = (record) => {
    setSelectedGuestData(record);
    setGuestFormMode("view");
    setGuestOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedGuestData(record);
    setGuestFormMode("edit");
    setGuestOpen(true);
  };

  const handleUpload = (record) => {
    setSelectedUploadRow(record);
    setUploadOpen(true);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => record?.guest?.name || record?.name || "-",
    },
    {
      title: "NRC",
      dataIndex: ["guest", "nrcNo"],
      key: "nrc",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Phone",
      dataIndex: ["guest", "phone"],
      key: "phone",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Guest Type",
      dataIndex: "isPrimary",
      key: "isPrimary",
      render: (text) => <div>{text === true ? "Main Guest" : "Share Guest"}</div>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              size="small"
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Guest">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="File Upload">
            <Button
              size="small"
              type="text"
              icon={<UploadOutlined />}
              onClick={() => handleUpload(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title="Guest List"
      placement="right"
      width={700}
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
    >
      <div>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data?.data}
          rowKey={(record) => record.uuid}
          pagination={false}
        />
      </div>
    </Drawer>
  );
};

export default GuestListDrawer;