import React from "react";
import { Drawer, Card, Tag, Button, Divider } from "antd";

const GetRoomForm = ({ open, onClose }) => {
  const rooms = [
    {
      id: 1,
      roomNo: "DBD - 1004",
      type: "Delux Double Room",
      view: "Garden View",
      status: "Cleaning",
      statusColor: "orange",
    },
    {
      id: 2,
      roomNo: "DBD - 1007",
      type: "Delux Double Room",
      view: "Sea View",
      status: "Cleaning",
      statusColor: "orange",
    },
  ];

  return (
    <Drawer
      title="Get Room"
      placement="right"
      onClose={onClose}
      open={open}
      size={550}
    >
      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <Card
            key={room.id}
            size="small"
            className="shadow-sm border-gray-200 rounded-md"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-800">{room.roomNo}</span>
              <Tag color={room.statusColor} className="m-0 px-3 rounded">
                {room.status}
              </Tag>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
              <span className="font-semibold">{room.type}</span>
              <span>{room.view}</span>
            </div>

            <Divider className="my-3" />

            <div className="flex justify-end">
              <Button className="custom-blue-btn" onClick={() => onClose(true)}>
                Get Room
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Drawer>
  );
};

export default GetRoomForm;
