import React from "react";
import { Card, Tag, Button } from "antd";

const GetRoomForm = ({ onSelectRoom, onClose }) => {
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
      status: "Available",
      statusColor: "green",
    },
  ];

  const handleAssignClick = (roomNo) => {
    onSelectRoom(roomNo); // Action 1: Pass data to parent
    onClose(); // Action 2: Close the results/drawer
  };

  return (
    <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto p-1">
      {rooms.map((room) => (
        <Card
          key={room.id}
          size="small"
          className="shadow-sm border-gray-200 rounded-md hover:border-blue-400 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 text-sm">
                {room.roomNo}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {room.type}
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center gap-1 mr-40">
                <Tag
                  color={room.statusColor}
                  className="m-0 px-2 rounded text-[10px]"
                >
                  {room.status}
                </Tag>

                <span className="text-[10px] text-gray-400">{room.view}</span>
              </div>

              <Button
                className="custom-blue-btn"
                onClick={() => onSelectRoom(room.roomNo)}
              >
                Assign
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GetRoomForm;
// assign button click add action like close this GetRoomForm
