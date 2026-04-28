import React from "react";
import { Table, Button, Dropdown, Space } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined, UploadOutlined } from "@ant-design/icons";

const FolioOperationsTable = () => {
  const columns = [
    {
      title: "Folio No",
      dataIndex: "folioNo",
      key: "folioNo",
    },
    {
      title: "Folio Id",
      dataIndex: "folioId",
      key: "folioId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Particulars",
      dataIndex: "particulars",
      key: "particulars",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Ref.Id",
      dataIndex: "refId",
      key: "refId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (text ? `${text.toLocaleString()} MMK` : "-"),
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
                  // setSelectedData(record);
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
                  setSelectedData(record);
                  setUploadOpen(true);
                }}
              >
                <UploadOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Upload File</span>
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

  const data = [
    {
      key: 1,
      folioNo: "FOL - 1001",
      folioId: "1001",
      date: "11/11/2026",
      particulars: "DBD Room",
      type: "Room",
      refId: "-",
      amount: 150000,
      children: [
        {
          key: 11,
          folioNo: "-",
          folioId: "1002",
          date: "11/11/2026",
          particulars: "DBD Room",
          type: "Room",
          refId: "-",
          amount: 100000,
        },
        {
          key: 12,
          folioNo: "-",
          folioId: "1003",
          date: "11/11/2026",
          particulars: "DBD Room",
          type: "Room",
          refId: "-",
          amount: 100000,
        },
      ],
    },
    {
      key: 2,
      folioNo: "FOL - 1002",
      folioId: "-",
      date: "-",
      particulars: "-",
      type: "-",
      refId: "-",
      amount: null,
    },
    {
      key: 3,
      folioNo: "FOL - 1003",
      folioId: "1001",
      date: "11/11/2026",
      particulars: "DBD Room",
      type: "Room",
      refId: "-",
      amount: 150000,
      children: [
        {
          key: 33,
          folioNo: "-",
          folioId: "1002",
          date: "11/11/2026",
          particulars: "DBD Room",
          type: "Room",
          refId: "-",
          amount: 100000,
        },
      ],
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      // expandable={{
      //   defaultExpandAllRows: true,
      // }}
      bordered={false}
      className="custom-folio-table"
    />
  );
};

export default FolioOperationsTable;
