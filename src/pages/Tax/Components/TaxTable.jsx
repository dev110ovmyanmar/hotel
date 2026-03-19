import { Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import TaxForm from "./TaxForms/TaxForm";

const TaxTable = ({
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

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Charge Apply Type",
      dataIndex: ["chargeApplyType", "name"],
      key: "chargeApplyType",
      width: 160,
    },
    {
      title: "Inclusive",
      dataIndex: "isInclusive",
      key: "isInclusive",
      render: (_, record) => (
        <Tag color={record.isInclusive ? "green" : "red"}>
          {record.isInclusive ? "TRUE" : "FALSE"}
        </Tag>
      ),
    },
    // {
    //   title: "Charge Value ",
    //   dataIndex: "chargeValue",
    //   key: "chargeValue",
    // },
    // {
    //   title: "Charge Type ",
    //   dataIndex: ["chargeType", "name"],
    //   key: "chargeType",
    //   width: 160,
    // },
    // {
    //   title: "Charge Value",
    //   key: "chargeValue",
    //   render: (_, record) => {
    //     const value = record?.chargeValue;
    //     const type = record?.chargeType?.name;

    //     return (
    //       <span>
    //         {value} {type}
    //       </span>
    //     );
    //   },
    // },
    {
      title: "Charge Value",
      key: "chargeValue",
      render: (_, record) => {
        const value = record?.chargeValue;
        const type = record?.chargeType?.name;

        if (type === "Percentage") {
          return <span>{value}%</span>;
        }

        if (type === "Flat") {
          return <span>{value} MMK</span>;
        }

        return value;
      },
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
    <div id="scrollId">
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

      <TaxForm
        page={page}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default TaxTable;
