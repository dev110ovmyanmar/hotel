import React, { useState } from "react";
import { Space, Table, Drawer, Button, Dropdown, Input } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { fetchRoom } from "../../../api/roomApi";
import useApiQuery from "../../../hooks/useApiQuery";
import RoomForm from "./Room/RoomForm";
import ListHeader from "../../../component/ListHeader/ListHeader";

const RoomTable = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "roomData",
    fetchQueryFunction: fetchRoom,
    params: {
      keyword,
      pagination: {
        page: page,
        perPage: perPage,
      },
    },
  });

  const roomTypeList = data?.data || [];
  const total = data?.total || 0;

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
        ? "Add New Room "
        : "";

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      // width:"20px"
    },
    {
      title: "Room No",
      dataIndex: "roomNo",
      key: "roomNo",
    },

    {
      title: "Price per Night",
      dataIndex: "pricePerNight",
      key: "pricePerNight",
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
                { key: "1", label: "View", icon: <EyeOutlined /> },
                { key: "2", label: "Edit", icon: <EditOutlined /> },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Room List"
          searchPlaceholder="Search Room ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Room"
          onAdd={handleAdd}
        />
      </div>

      <Table
        columns={columns}
        dataSource={roomTypeList}
        loading={isLoading}
        rowKey={(record) => record.id || record._id}
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (newPage, newSize) => {
            setPage(newPage);
            setPerPage(newSize);
          },
        }}
      />
      <Drawer title={DrawerTitle} onClose={onClose} open={open} width={500}>
        <RoomForm
          initialValues={selectedRow}
          mode={currentMode}
          onSuccess={() => {
            refetch();
            onClose();
          }}
        />
      </Drawer>
    </>
  );
};

export default RoomTable;
