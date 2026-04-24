import { Table, Tag } from "antd";

const columns = [
  {
    title: "Room Type",
    dataIndex: "roomType",
    key: "roomType",
  },
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    align: "center",
  },
  {
    title: "Room",
    dataIndex: "room",
    key: "room",
    align: "center",
  },
  {
      title: "Room Status",
      dataIndex: "roomStatus",
      key: "roomStatus",
      render: (status) => {
        let color = "default";
        const normalizedStatus = status.toLowerCase();

        if (normalizedStatus === "dirty") color = "error";
        if (normalizedStatus === "cleaning") color = "processing";
        if (normalizedStatus === "maintained") color = "success";
        if (normalizedStatus === "block") color = "default";
        return (
          <Tag color={color} key={status} className="capitalize">
            {status}
          </Tag>
        );
      },
    },
];
const data = [
  {
    key: 1,
    roomType: "Delux Bangalow Double",
    no: 3,
    room: "103",
    roomStatus: "block",
  },
  {
    key: 2,
    roomType: "Delux Bangalow",
    no: 2,
    room: "103",
    roomStatus: "Cleaning",
  },
];

const RoomStatusTable = () => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
};

export default RoomStatusTable;
