import React, { useState } from "react";
import { Flex, Space, Table, Tag, Drawer, Button, Dropdown, Input } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import RoomForm from "./Room/RoomForm";

const RoomTable = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [active, setActive] = useState();
  const [currentMode, setCurrentMode] = useState(mode);

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
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Short Name",
      dataIndex: "short_name",
      key: "short_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Total Room",
      dataIndex: "total_room",
      key: "total_room",
    },
    {
      title: "Status",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <Flex gap="small" align="center" wrap>
          {tags.map((tag) => {
            let color = tag === "active" ? "green" : "volcano";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </Flex>
      ),
    },
    {
      title: "Guest",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Extra Bed",
      dataIndex: "extra_bed",
      key: "extra_bed",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record, "edit")}
          />
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

  const data = [
    {
      key: "1",
      name: "Premium",
      floor_number: 2,
      description: "Sea View....",
      number_of_room: 10,
      tags: ["inactive"],
    },
    {
      key: "2",
      name: "Standard",
      floor_number: 4,
      description: " No. 1 Lake Park",
      number_of_room: 10,
      tags: ["active"],
    },
    {
      key: "3",
      name: "Black",
      floor_number: 3,
      description: "Garden Park",
      number_of_room: 10,
      tags: ["active"],
    },
  ];

  return (
    <>
      <h1>Room Type</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <Input
          placeholder="Search permissions..."
          prefix={<SearchOutlined />}
          className="w-10"
        />

        <Button
          type="primary"
          onClick={() => {
            setSelectedRow(null);
            setCurrentMode("add");
            setOpen(true);
          }}
        >
          Create Room
        </Button>
      </div>

      <Table columns={columns} dataSource={data} />
      <Drawer title={DrawerTitle} onClose={onClose} open={open}>
        <RoomForm initialValues={selectedRow} mode={currentMode} />
      </Drawer>
    </>
  );
};

export default RoomTable;
