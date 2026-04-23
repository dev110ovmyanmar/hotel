import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import FolioOperationsForm from "./FolioOperationsForms/FolioOperationsForm";

const FolioOperationsTable = ({
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
      width: 70,
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Arrival",
      dataIndex: "arrival",
      key: "arrival",
    },
    {
      title: "Departure",
      dataIndex: "departure",
      key: "eeparture",
    },

    {
      title: "Room Status",
      dataIndex: "roomStatus",
      key: "roomStatus",
    },
    {
      title: "Rate Plan",
      dataIndex: "ratePlan",
      key: "ratePlan",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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

      <FolioOperationsForm
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

export default FolioOperationsTable;
