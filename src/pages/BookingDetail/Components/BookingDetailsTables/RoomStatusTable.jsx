import { Card, Space, Table, Tag, Typography } from "antd";
import { MdOutlineKingBed } from "react-icons/md";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";

const { Text } = Typography;

const columns = [
  {
    title: "Room Type",
    dataIndex: ["roomType", "name"],
    key: "roomType",
  },
  // {
  //   title: "No",
  //   dataIndex: "no",
  //   key: "no",
  //   align: "center",
  // },
  {
    title: "Reservation Status",
    dataIndex: "roomStatus",
    key: "roomStatus",
    render: (status) => {

      return (
        status ? <ColorStatusTag status={status} /> : "-"
      );
    },
  },
  {
    title: "Room",
    dataIndex: ["room", "roomNo"],
    key: "room",
    align: "center",
    render: (text) => {
      return text ? text : "-"
    }
  },
  {
    title: "Room Status",
    dataIndex: ["room", "status"],
    key: "roomstatus",
    align: "center",
    render: (status) => {

      return (
        status ? <ColorStatusTag status={status} /> : "-"
      );
    },
  },
];

const RoomStatusTable = ({ data }) => {
  const CustomTitle = (
    <Space>
      <div className="room-icon-box">
        <MdOutlineKingBed style={{ color: "#035ef1", fontSize: "18px" }} />
      </div>
      <Text>Reservation Room</Text>
    </Space>
  );
  return (
    <>
      {
        data?.length !== 0 && (
          <Card
            title={CustomTitle}
            className="room-card"
          // extra={<Tag color="blue">Reserved - 2 Rooms</Tag>}
          >
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              pagination={false}
            />
          </Card>
        )
      }
    </>
  );
};

export default RoomStatusTable;
