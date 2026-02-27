import React, { useState } from "react";
import { Space, Table, Drawer, Button, Dropdown, Input } from "antd";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import FloorForm from "./Floors/FloorForm";
import { fetchFloor } from "../../../api/floorApi";
import useApiQuery from "../../../hooks/useApiQuery";

const FloorTable = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "floorData",
    fetchQueryFunction: fetchFloor,
  });

  const floorList = [data?.data, data].find(Array.isArray) || [];

  const showDrawer = (record, actionMode) => {
    setSelectedRow(record);
    setCurrentMode(actionMode);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";
  const isAdd = currentMode === "add";

  const DrawerTitle = isView
    ? "View Floor"
    : isEdit
      ? "Edit Floor"
      : isAdd
        ? "Create Floor"
        : "";

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Floor No",
      dataIndex: "floorNo",
      key: "floorNo",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                if (key === "1") {
                  showDrawer(record, "view");
                }
                if (key === "2") {
                  showDrawer(record, "edit");
                }
              },
              items: [
                { key: "1", label: "View Details" },
                { key: "2", label: "Edit Request" },
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <Input
          placeholder="Search floors..."
          prefix={<SearchOutlined />}
          style={{ width: 200, marginLeft: 20 }}
        />

        <Button
          type="primary"
          onClick={() => {
            setSelectedRow(null);
            setCurrentMode("add");
            setOpen(true);
          }}
          style={{ marginRight: 20 }}
        >
          Create Floor
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={floorList}
        loading={isLoading}
        rowKey={(record) => record.id || record._id}
      />

      <Drawer title={DrawerTitle} onClose={onClose} open={open}>
        <FloorForm
          initialValues={selectedRow}
          mode={currentMode}
          onSuccess={onClose}
        />
      </Drawer>
    </>
  );
};

export default FloorTable;
