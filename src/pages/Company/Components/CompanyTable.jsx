import { Dropdown, Space, Table, Tag, Button } from "antd";
import { useState } from "react";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import CompanyForm from './CompanyForm/CompanyForm';


const CompanyTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
      align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div>{text? text : "-"}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <div>{text? text : "-"}</div>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Charge Type",
      dataIndex: ["chargeType","name"],
      key: "chargeType",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Charge Value",
      dataIndex: "chargeValue",
      key: "chargeValue",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => <div>{text? text : "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: ["status","name"],
      key: "status",
      render: (text) => <Tag className={text === "Active" ? "text-green-500" : "text-red-500"}>{text === "Active" ? "Active" : "Inactive"}</Tag>,
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
    <div id="scrollId" className="w-full h-[63vh] ">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
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

      <CompanyForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        page={page}
      />
    </div>
  );
};

export default CompanyTable;
