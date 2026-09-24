import { Space, Table, Tooltip } from "antd";
import { useState } from "react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import EventFacilityOrderForm from "./EventFacilityOrderForms/EventFacilityOrderForm";
import dayjs from "dayjs";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import usePermission from "../../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../../variables/permission";

const EventFacilityOrderTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
  reservationRoom,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const { hasPermission } = usePermission();
  const canEditFacilityBooking = hasPermission(PERMISSIONS.FACILITY_BOOKING_EDIT);
  const canViewFacilityBooking = hasPermission(PERMISSIONS.FACILITY_BOOKING_VIEW);

  const actionDisable = reservationRoom?.roomStatus?.code === "cancelled";

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
      align: "center",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      render: (text, record) => (
        <div>{record?.guest?.fullName || text || "-"}</div>
      ),
    },
    {
      title: "Guest Phone No",
      dataIndex: "guestPhone",
      key: "guestPhone",
      width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Package Name",
      dataIndex: ["facilityPackage", "name"],
      key: "facilityPackage",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      width: 120,
      render: (text) => (
        <div>{text ? dayjs(text, "YYYY-MM-DD").format("YYYY-MM-DD") : "-"}</div>
      ),
    },
    {
      title: "Event Time",
      key: "eventAndTime",
      align: "center",
      width: 120,
      render: (_, record) => {
        const startTime = record.startTime
          ? dayjs(record.startTime, "HH:mm:ss").format("HH:mm")
          : "-";

        const endTime = record.endTime
          ? dayjs(record.endTime, "HH:mm:ss").format("HH:mm")
          : "-";

        return (
          <div>
            {startTime} - {endTime}
          </div>
        );
      },
    },

    {
      title: "Facility Status",
      dataIndex: ["facilityStatus", "name"],
      key: "facilityStatus",
      width: 100,
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },

    // {
    //   title: "Action",
    //   key: "action",
    //   fixed: "end",
    //   align: "center",
    //   render: (_, record) => (
    //     <Space size="middle">
    //         <Tooltip title="View Details">
    //           <EyeOutlined
    //             className="cursor-pointer text-blue-500 hover:text-blue-700"
    //             onClick={() => {
    //               setDrawerOpen(true);
    //               setMode("view");
    //               setSelectedData(record);
    //             }}
    //           />
    //         </Tooltip>

    //       <Tooltip title="Edit">
    //         <EditOutlined
    //           className="cursor-pointer text-amber-500 hover:text-amber-700"
    //           onClick={() => {
    //             setDrawerOpen(true);
    //             setMode("edit");
    //             setSelectedData(record);
    //           }
    //           }
    //         />
    //       </Tooltip>

    //     </Space>
    //   ),
    // },
    ...(!actionDisable
      ? [
        {
          title: "Action",
          key: "action",
          fixed: "end",
          render: (_, record) => (
            <Space size="middle">
              {
                canViewFacilityBooking &&
                <Tooltip title="View Details">
                  <EyeOutlined
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      setDrawerOpen(true);
                      setMode("view");
                      setSelectedData(record);
                    }}
                  />
                </Tooltip>
              }

              {record?.status?.code !== "completed" && canEditFacilityBooking && (
                <Tooltip title="Edit">
                  <EditOutlined
                    className="cursor-pointer text-amber-500 hover:text-amber-700"
                    onClick={() => {
                      setDrawerOpen(true);
                      setMode("edit");
                      setSelectedData(record);
                    }}
                  />
                </Tooltip>)}
            </Space>
          ),
        },
      ]
      : []),
  ];

  return (
    <div>
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
        loading={loading}
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
      />

      <EventFacilityOrderForm
        reservationRoom={reservationRoom}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      // onSuccess={refreshData}
      />
    </div>
  );
};

export default EventFacilityOrderTable;
