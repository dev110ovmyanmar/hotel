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
import NewGuestUploadForm from "./../../../../GuestsListing/Components/NewGuestUploadForm";
import GuestNoteDrawer from "./GuestForms/GuestNoteDrawer";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Guest Name",
      key: "name",
      render: (_, record) => record?.guest?.name || record?.name || "-",
    },
    {
      title: "Room",
      key: "room",
      dataIndex: ["reservationRoom", "room", "roomNo"],
      align:"center",
      render: (roomNo, record) => {
        const checkinDate = record?.reservationRoom?.checkinDate;
        const checkoutDate = record?.reservationRoom?.checkoutDate;

        if (!roomNo) return "-";

        return (
          <div>
            <div style={{ fontWeight: "500" }}>{roomNo}</div>

            {checkinDate && checkoutDate && (
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "2px" }}
              >
                ({checkinDate} - {checkoutDate})
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
    // {
    //   title: "Passport",
    //   dataIndex: ["guest", "passport"],
    //   key: "passport",
    //   render: (text) => (text ? text : "-"),
    // },
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
        <div 
        // className={text === true ? "text-[#389E0D]" : "text-[#CF1322]"}
        >
          {text === true ? "Main Guest" : "Share Guest"}
        </div>
      ),
    },
    // {
    //   title: "Nationality",
    //   dataIndex: ["guest", "nationality"],
    //   key: "nationality",
    //   render: (text) => (text ? text : "-"),
    // },

    {
      title: "Action",
      fixed: "end",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined
              onClick={() => {
                setSelectedData(record);
                setMode("view");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Edit Details">
            <EditOutlined
              onClick={() => {
                setSelectedData(record);
                setMode("edit");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="File Upload">
            <UploadOutlined
              onClick={() => {
                setSelectedData(record);
                setUploadOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
        />
      )}
      <NewGuestUploadForm
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        reservationId={selectedData?.id}
      />
    </div>
  );
};

export default GuestTable;
