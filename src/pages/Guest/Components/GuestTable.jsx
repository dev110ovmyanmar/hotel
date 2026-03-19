import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import {
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
