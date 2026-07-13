import { Space, Table, Tooltip } from "antd";
import { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import dayjs from "dayjs";
import ServiceOrderForm from "./ServiceOrderForms/ServiceOrderForm";

const ServiceOrderTable = ({ data }) => {
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [serviceOpen, setServiceOpen] = useState(false);

  const tableDataSource = Array.isArray(data)
    ? data
    : data?.serviceOrders || [];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Room No",
      dataIndex: ["reservationRoom", "room", "roomNo"],
      key: "roomNo",
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Service Package",
      dataIndex: ["servicePackage", "name"],
      key: "servicePackage",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Total Quantity",
      dataIndex: "serviceOrderItems",
      key: "quantity",
      render: (items = []) => (
        <span>
          {Array.isArray(items)
            ? items.reduce((total, { quantity = 0 }) => total + quantity, 0)
            : 0}
        </span>
      ),
    },
    {
      title: "Price (MMK)",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (text) => <PriceTag value={text} />,
      width: 150,
      align: "right",
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => {
                setSelectedData(record);
                setMode("view");
                setServiceOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <EditOutlined
              className="cursor-pointer text-amber-500 hover:text-amber-700"
              onClick={() => {
                setSelectedData(record);
                setMode("edit");
                setServiceOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={tableDataSource} rowKey="uuid" />

      {serviceOpen && (
        <ServiceOrderForm
          mode={mode}
          setMode={setMode}
          serviceData={selectedData}
          open={serviceOpen}
          onClose={() => setServiceOpen(false)}
        />
      )}
    </div>
  );
};

export default ServiceOrderTable;
