import { Dropdown, Space, Table, Tag, Button } from 'antd';
import { useState } from "react";
import { MoreOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import PaymentForm from './PaymentForm/PaymentForm';

// PaymentTable
const PaymentTable = ({ data, page, perPage, total, changePage, changePerPage }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedData, setSelectedData] = useState({});

  const columns = [
    {
      title: 'ID',
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Provider Type',
      dataIndex: 'type',
      key: 'type',
      render: type => <div>{type?.name}</div>,
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: provider => <div>{provider?.name}</div>,
    },
    {
      title: 'isOnline',
      dataIndex: 'isOnline',
      key: 'isOnline',
      render: isOnline => <div>{isOnline === true ? "Yes" : "No"}</div>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => 
      <Tag 
        className = {status?.name == "Active" ? 
              "!text-green-400" : 
              "!text-red-400"}>
        {status?.name?.toUpperCase()}
      </Tag>
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
    <div id="scrollId" className="w-full h-[63vh] " >
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
            changePerPage(perPage)
          },
          showSizeChanger: true
        }}
      />

      <PaymentForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        width={500}
        page={page}
      />
    </div>
  )
};


export default PaymentTable;