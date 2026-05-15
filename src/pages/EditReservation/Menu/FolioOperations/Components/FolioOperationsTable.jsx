import React, { useState } from "react";
import { Table, Button, Dropdown, Space, Modal, Radio, Divider, Tooltip } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Divide } from "lucide-react";

const FolioOperationsTable = () => {
  const [modalOpen, setModalOpen] = useState(false);

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
      fixed:"end",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined
              onClick={() => {
                setSelectedData(record);
                setMode("view");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => {
                setSelectedData(record);
                setMode("edit");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="File Move To">
            <UploadOutlined
              onClick={() => {
                // setSelectedData(record);
                setModalOpen(true);
              }}
            />
          </Tooltip>
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
      <Modal
        title="File Move To"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        closable={false}
        okText="Submit"
        centered
        width={400}
        className="custom-ant-modal"
      >
        <div className="ml-5 mt-5">
          <Radio.Group>
            <Space direction="vertical">
              <Radio>FOL - 1001 - 1</Radio>
              <Radio>FOL - 1001 - 2</Radio>
            </Space>
          </Radio.Group>
        </div>
        <Divider />
      </Modal>
    </>
  );
};

export default FolioOperationsTable;
