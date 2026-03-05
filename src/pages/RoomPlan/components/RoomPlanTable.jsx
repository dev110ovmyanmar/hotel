import React, { useState } from "react";
import { Flex, Space, Table, Tag, Drawer, Button, Dropdown, Input } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import RoomPlanForm from "./RoomPlanForm/RoomPlanForm";
import ListHeader from "../../../component/ListHeader/ListHeader";

const RoomPlanTable = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const showDrawer = (record, actionMode) => {
    setSelectedRow(record);
    setCurrentMode(actionMode);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setOpen(true);
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
          {/* <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => showDrawer(record, "edit")}
          /> */}
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
                { key: "1", label: "View Details", icon: <EyeOutlined /> },
                { key: "2", label: "Edit Request", icon: <EditOutlined /> },
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
        <ListHeader
          title="Room Plan"
          searchPlaceholder="Search Room ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add Room Plan"
          onAdd={handleAdd}
        />
      </div>

      <Table
        columns={columns}
        //  dataSource={roomList}
      />
      <Drawer title={DrawerTitle} onClose={onClose} open={open}>
        <RoomPlanForm initialValues={selectedRow} mode={currentMode} />
      </Drawer>
    </>
  );
};

export default RoomPlanTable;
