import React, { useState } from "react";
import { Flex, Space, Table, Tag, Drawer, Button, Dropdown, Input } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import RoomTypeForm from "./RoomTypeForm/RoomTypeForm";
import { fetchRoomType } from "../../../api/roomApi";
import useApiQuery from "../../../hooks/useApiQuery";
import ListHeader from "../../../component/ListHeader/ListHeader";

const RoomTypeTable = ({ mode }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "roomTypeData",
    fetchQueryFunction: fetchRoomType,
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

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";
  const isAdd = currentMode === "add";

  const DrawerTitle = isView
    ? "View Floor"
    : isEdit
      ? "Edit Floor"
      : isAdd
        ? "Add New Room Type"
        : "";

  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setOpen(true);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      // title: "Short Name",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Total Rooms",
      dataIndex: "totalRooms",
      key: "totalRooms",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "active" ? "green" : "volcano";
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Guest",
      dataIndex: "maxOccupancy",
      key: "maxOccupancy",
    },

    {
      title: "Extra Bed",
      dataIndex: "extraBed",
      key: "extraBed",
    },
    {
      title: "Price",
      dataIndex: "basePrice",
      key: "basePrice",
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
          title="Room Type List"
          searchPlaceholder="Search Room Type ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add Room Type"
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
        <RoomTypeForm
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

export default RoomTypeTable;
