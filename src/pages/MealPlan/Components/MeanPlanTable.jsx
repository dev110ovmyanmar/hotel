import { Dropdown, Space, Table, Tag, Button } from 'antd';
import { useState } from "react";
import { MoreOutlined } from '@ant-design/icons';
import MeanPlanForm from './MealPlanForm/MealPlanForm';
import { EditOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import Status from './../../../component/Status/Status';
import ColorStatusTag from './../../../component/ColorStatusTag/ColorStatusTag';

const MeanPlanTable = ({ data, page, perPage, total, changePage, changePerPage, loading }) => {
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
      title: 'Meal Plan Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: text => <div>{text}</div>,
      width: 500
    },
    {
      title: 'Status',
      dataIndex: ["status", "name"],
      key: 'status',
      render: (_, record) => <ColorStatusTag status={record?.status} />
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
        loading={loading}
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

      <MeanPlanForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        page={page}
      />
    </div>
  )
};


export default MeanPlanTable;