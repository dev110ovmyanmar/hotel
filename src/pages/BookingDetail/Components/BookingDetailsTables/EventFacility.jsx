import React from "react";
import { Typography, Card, Space, Table } from "antd";
import { IoCalendarClearOutline } from "react-icons/io5";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";

const { Text } = Typography;

const EventFacility = ({ data }) => {
  const CustomTitle = (
    <Space>
      <div className="event-icon-box">
        <IoCalendarClearOutline
          style={{ color: "#6923c5", fontSize: "18px" }}
        />
      </div>
      <Text>Event Facility</Text>
    </Space>
  );

  const columns = [
    {
      title: "Facility Package",
      dataIndex: ["facilityPackage", "name"],
      key: "facilityPackage",
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      render: (text, record) => (
        <div>{record?.guest?.fullName || text || "-"}</div>
      ),
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Facility Package Status",
      dataIndex: "status",
      key: "facilityPackageStatus",
      render: (status) => {
        return status ? <ColorStatusTag status={status} /> : "-";
      },
      width: 150,
    },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
    },
  ];
  return (
    <>
      {data?.length !== 0 && (
        <Card title={CustomTitle} className="event-card line-height">
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            pagination={false}
          />
        </Card>
      )}
    </>
  );
};

export default EventFacility;
