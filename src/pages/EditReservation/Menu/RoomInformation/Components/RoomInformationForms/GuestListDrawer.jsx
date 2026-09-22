import React, { useState } from "react";
import { Drawer, Table, Space, Button, Tooltip } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { reservationGuestList } from "../../../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../../../variables/constants";
import GuestForm from "../../../GuestDetails/Components/GuestForms/GuestForm";

const GuestListDrawer = ({
  drawerOpen,
  setDrawerOpen,
  selectedData,
  setUploadOpen,
  setSelectedUploadRow,
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [keyword, setKeyword] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guestFormMode, setGuestFormMode] = useState("add");
  const [selectedGuestData, setSelectedGuestData] = useState(null);

  const { data, isFetching } = useApiQuery({
    fetchQueryName: "reservation-guest",
    fetchQueryFunction: reservationGuestList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid: selectedData?.uuid },
      status: showActiveOnly,
    },
  });

  const handleView = (record) => {
    setSelectedGuestData(record);
    setGuestFormMode("view");
    setGuestOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedGuestData(record);
    setGuestFormMode("edit");
    setGuestOpen(true);
  };

  const handleUpload = (record) => {
    setSelectedUploadRow(record);
    setUploadOpen(true);
  };

  const columns = [
    {
      title: "Guest Name",
      dataIndex: ["guest", "fullName"],
      key: "guestName",
      render: (_, record) => record.guest?.fullName ?? record.name,
    },
    {
      title: "Guest Type",
      dataIndex: "isPrimary",
      key: "isPrimary",
      render: (text) => (
        <div>{text === true ? "Main Guest" : "Share Guest"}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 130,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <EyeOutlined
              style={{ fontSize: "16px" }}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Guest">
            <EditOutlined
              style={{ fontSize: "16px" }}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="File Upload">
            <UploadOutlined
              style={{ fontSize: "16px" }}
              onClick={() => handleUpload(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <Drawer
      title="Guest List"
      placement="right"
      width={700}
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
      extra={
        <Button
          type="primary"
          onClick={() => {
            setSelectedGuestData(null);
            setGuestFormMode("add");
            setGuestOpen(true);
          }}
        >
          Add New Guest
        </Button>
      }
    >
      <div>
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={data?.data}
          rowKey={(record) => record.uuid}
          pagination={false}
        />
      </div>

      {guestOpen && (
        <GuestForm
          mode={guestFormMode}
          setMode={setGuestFormMode}
          drawerOpen={guestOpen}
          setDrawerOpen={setGuestOpen}
          guestData={selectedGuestData}
          setSelectedData={setSelectedGuestData}
          roomuuid={selectedData?.uuid}
          reservationUuid={selectedData?.reservation}
          page={page}
          setPage={setPage}
        />
      )}
    </Drawer>
  );
};

export default GuestListDrawer;
