import { Space, Table, Tooltip } from "antd";
import { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import ServiceOrderForm from "./ServiceAddOnForms/ServiceAddOnForm";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import dayjs from "dayjs";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";

const ServiceAddOnTable = ({ data }) => {
  console.log(data, "data")
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
      title: "Service Name",
      dataIndex: ["service", "name"],
      key: "serviceName",
    },

    {
      title: "Status",
      dataIndex: "addonStatus",
      key: "status",
      width: 150,
      render: (addonStatus) => <ColorStatusTag status={addonStatus} />,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Price",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
          <span className=" font-medium">MMK</span>
        </div>
      ),
      width: 150,
      align: "right",
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
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

          {record?.addonStatus?.code !== "completed" && (
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
          )}
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

export default ServiceAddOnTable;
