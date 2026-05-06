import React from "react";
import { Table, Button, Dropdown, Space, Modal } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined,
} from "@ant-design/icons";

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
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            onClick={() => {
              setSelectedData(record);
              setMode("view");
              setDrawerOpen(true);
            }}
          />

          <EditOutlined
            onClick={() => {
              setSelectedData(record);
              setMode("edit");
              setDrawerOpen(true);
            }}
          />

          <UploadOutlined
            onClick={() => {
              setSelectedData(record);
              setUploadOpen(true);
            }}
          />
        </Space>
      ),
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
    <>
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
    </>
  );
};

export default FolioOperationsTable;
