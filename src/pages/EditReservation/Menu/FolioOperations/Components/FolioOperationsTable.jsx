import React, { useState } from "react";
import { Button, Divider, Dropdown, Modal, Radio, Space, Table } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// Renders the word "Folio" with a yellow highlight followed by the rest of the title
const FolioTitle = ({ rest }) => (
  <span>
    <span
    >
      Folio
    </span>
    {rest}
  </span>
);

const FolioOperationsTable = ({
  dataSource,
  setSelectedData,
  setMode,
  setDrawerOpen,
  onCreateFolio,
  isFolioLineIsEmpty
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFolio, setSelectedFolio] = useState(null);

  const getActionItems = (record) => [
    {
      key: "view",
      label: (
        <Space size={4} onClick={() => {
          if (setSelectedData && setMode && setDrawerOpen) {
            setSelectedData(record);
            setMode("view");
            setDrawerOpen(true);
          }
        }}>
          <EyeOutlined style={{ fontSize: "12px" }} />
          <span style={{ fontSize: "14px" }}>View</span>
        </Space>
      ),
    },
    {
      key: "edit",
      label: (
        <Space size={4} onClick={() => {
          if (setSelectedData && setMode && setDrawerOpen) {
            setSelectedData(record);
            setMode("edit");
            setDrawerOpen(true);
          }
        }}>
          <EditOutlined style={{ fontSize: "12px" }} />
          <span style={{ fontSize: "14px" }}>Edit</span>
        </Space>
      ),
    },
    {
      key: "move",
      label: (
        <Space size={4} onClick={() => {
          setSelectedFolio(record);
          setModalOpen(true);
        }}>
          <UploadOutlined style={{ fontSize: "12px" }} />
          <span style={{ fontSize: "14px" }}>Move To</span>
        </Space>
      ),
    },
  ];

  // Sub-table columns for folioLines
  const lineColumns = [
    {
      title: <FolioTitle rest=" No" />,
      key: "folioNo",
      render: (_, record) => record.folioNo || "-",
      width: 160,
    },
    {
      title: <FolioTitle rest=" Id" />,
      key: "folioLineId",
      render: (_, record) => record.id || "-",
      width: 100,
    },
    {
      title: "Date",
      key: "date",
      render: (_, record) => record.transactionDate || record.createdAt || "-",
    },
    {
      title: "Particulars",
      key: "particulars",
      render: (_, record) => record.description || record.name || "-",
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => record.type?.name || record.itemType || "-",
    },
    {
      title: "Ref.Id",
      key: "refId",
      render: (_, record) => record.referenceId || "-",
    },
    {
      title: "Amount",
      key: "amount",
      align: "right",
      render: (_, record) => {
        const val = record.amount ?? record.grandTotal;
        return val !== undefined && val !== null
          ? `${Number(val).toLocaleString()} MMK`
          : "-";
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 70,
      render: () => null,
    },
  ];

  const columns = [
    {
      title: <FolioTitle rest=" No" />,
      dataIndex: "folioNo",
      key: "folioNo",
      width: 200,
    },
    {
      title: <FolioTitle rest=" Id" />,
      key: "folioId",
      width: 100,
      render: (_, record) => record.id ?? "-",
    },
    {
      title: "Date",
      key: "date",
      render: (_, record) => record.openedAt || "-",
    },
    {
      title: "Particulars",
      key: "particulars",
      render: (_, record) => record.folioBusinessType?.name || "-",
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => record.folioOwnerType?.name || "-",
    },
    {
      title: "Ref.Id",
      key: "refId",
      render: (_, record) => record.reservation?.reservationNo || "-",
    },
    {
      title: "Amount",
      key: "amount",
      align: "right",
      render: (_, record) => {
        const currency = record.currency?.code || "MMK";
        return record.grandTotal !== undefined
          ? `${Number(record.grandTotal).toLocaleString()} ${currency}`
          : "-";
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 70,
      render: (_, record) => (
        <Dropdown menu={{ items: getActionItems(record) }} trigger={["click"]}>
          <MoreOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ];

  // Expandable: render folioLines as a nested table
  const expandedRowRender = (record) => {
    const lines = record.folioLines || [];
    return (
      <Table
        className="nested-folio-table [&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
        columns={lineColumns}
        dataSource={lines}
        rowKey={(r, i) => r.id ?? i}
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
        bordered
      />
    );
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #e8e8e8",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={false}
          bordered={false}
          size="middle"
          className="custom-folio-table"
          expandable={!isFolioLineIsEmpty && {
            expandedRowRender,
          }}
        // locale={{
        //   emptyText: (
        //     <div style={{ padding: "32px 0", textAlign: "center" }}>
        //       <div style={{ marginBottom: "16px", color: "#8c8c8c" }}>No Folio Operations found</div>
        //       <Button
        //         type="primary"
        //         icon={<PlusOutlined />}
        //         onClick={onCreateFolio}
        //         className="custom-blue-btn"
        //       >
        //         Create Folio
        //       </Button>
        //     </div>
        //   )
        // }}
        />
      </div>

      <Modal
        title="File Move To"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedFolio(null);
        }}
        closable={false}
        okText="Submit"
        centered
        width={400}
        className="custom-ant-modal"
      >
        <div className="ml-5 mt-5">
          <Radio.Group>
            <Space direction="vertical">
              {dataSource?.map((folio) => (
                <Radio key={folio.id} value={folio.folioNo}>
                  {folio.folioNo}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
        <Divider />
      </Modal>
    </>
  );
};

export default FolioOperationsTable;