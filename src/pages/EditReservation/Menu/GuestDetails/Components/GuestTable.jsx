import { Dropdown, Space, Table, Button, Tooltip } from "antd";
import { useState, useEffect } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import GuestForm from "./GuestForms/GuestForm";
import dayjs from "dayjs";
import GuestUploadDrawer from "./GuestForms/GuestUploadDrawer";
import usePermission from "../../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../../variables/permission";

const GuestTable = ({
  data,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
  reservationUuid,
}) => {
  console.log(reservationUuid,"reservationUUId")
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const { hasPermission } = usePermission();
  const canViewReservationForGuest = hasPermission(PERMISSIONS.RESERVATION_VIEW);
  const canEditReservationForGuest = hasPermission(PERMISSIONS.RESERVATION_EDIT);
  const canViewAndEditGuestImage = hasPermission(PERMISSIONS.GUEST_VIEW);

  const statusCode = Array.isArray(reservationUuid)
    ? reservationUuid[0]?.reservationRoom?.roomStatus?.code?.toLowerCase()
    : undefined;

  const baseColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Guest Name",
      key: "guestName",
      render: (_, record) => {
        const title = record?.guest?.title || record?.title || "";
        const name = record?.guest?.name || record?.name || "";
        return title || name ? `${title} ${name}`.trim() : "-";
      },
    },
    {
      title: "Room",
      key: "room",
      dataIndex: ["reservationRoom", "room", "roomNo"],
      align: "center",
      render: (roomNo, record) => {
        const checkinDate = record?.reservationRoom?.checkinDate;
        const checkoutDate = record?.reservationRoom?.checkoutDate;

        const formattedCheckin = checkinDate
          ? dayjs(checkinDate).format("YYYY-MM-DD")
          : "";
        const formattedCheckout = checkoutDate
          ? dayjs(checkoutDate).format("YYYY-MM-DD")
          : "";

        if (!roomNo) return "-";

        return (
          <div>
            <div style={{ fontWeight: "500" }}>{roomNo}</div>
            {formattedCheckin && formattedCheckout && (
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "2px" }}
              >
                ({formattedCheckin} - {formattedCheckout})
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "NRC",
      dataIndex: ["guest", "nrcNo"],
      key: "nrcNo",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Phone Number",
      dataIndex: ["guest", "phone"],
      key: "phone",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Guest Type",
      dataIndex: "isPrimary",
      key: "isPrimary",
      render: (text) => (
        <div>{text === true ? "Main Guest" : "Share Guest"}</div>
      ),
    },
  ];

  const actionColumn = {
    title: "Action",
    render: (_, record) => {
      const viewStatus = [
        "pending",
        "booked",
        "confirmed",
        "checked_in",
        "checked_out",
      ];
      const view = viewStatus.includes(statusCode);

      const editStatus = ["pending", "booked", "confirmed", "checked_in"];
      const edit = editStatus.includes(statusCode);

      const uploadStatus = ["pending", "booked", "confirmed", "checked_in"];
      const upload = uploadStatus.includes(statusCode) && record.guest !== null;

      return (
        <Space size="middle">
          {view && canViewReservationForGuest &&(
            <Tooltip title="View Details">
              <EyeOutlined
                className="cursor-pointer"
                onClick={() => {
                  setSelectedData(record);
                  setMode("view");
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
          )}

          {edit && canEditReservationForGuest && (
            <Tooltip title="Edit Details">
              <EditOutlined
                className="cursor-pointer"
                onClick={() => {
                  setSelectedData(record);
                  setMode("edit");
                  setDrawerOpen(true);
                }}
              />
            </Tooltip>
          )}

          {upload && canViewAndEditGuestImage &&(
            <Tooltip title="File Upload">
              <UploadOutlined
                className="cursor-pointer"
                onClick={() => {
                  setSelectedData(record);
                  setUploadOpen(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      );
    },
  };

  const isHiddenStatus = ["cancelled", "no_show"].includes(statusCode);
  const columns = isHiddenStatus ? baseColumns : [...baseColumns, actionColumn];

  return (
    <div>
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
        loading={loading}
      />

      {drawerOpen && (
        <GuestForm
          page={page}
          mode={mode}
          setMode={setMode}
          guestData={selectedData}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          reservationUuid={reservationUuid}
          roomuuid={selectedData?.reservationRoom?.uuid}
        />
      )}

      {uploadOpen && (
        <GuestUploadDrawer
          page={page}
          mode={mode}
          setMode={setMode}
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          setDrawerOpen={setDrawerOpen}
          selectedRow={selectedData}
          setSelectedRow={setSelectedData}
        />
      )}
    </div>
  );
};

export default GuestTable;
