import { Dropdown, Space, Table, Button } from "antd";
import { useState, useEffect } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { MdOutlineMeetingRoom } from "react-icons/md";
import RoomInformationForm from "./RoomInformationForms/RoomInformationForm";
import RoomMoveDrawer from "./RoomInformationForms/RoomMoveDrawer";
import AssignRoomForm from "./RoomInformationForms/AssignRoomForm";
import { set } from "lodash";
import dayjs from "dayjs";
import NoteDrawer from "./RoomInformationForms/NoteDrawer";

const RoomInformationTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    const savedRoomInfo = JSON.parse(localStorage.getItem("roomInfo")) || [];
    setDataSource(savedRoomInfo);
  }, []);

  const refreshData = () => {
    const savedRoomInfo = JSON.parse(localStorage.getItem("roomInfo")) || [];
    setDataSource(savedRoomInfo);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    // {
    //   title: "Room",
    //   dataIndex: "roomType",
    //   key: "roomType",
    //   className: "font-medium",
    //   render: (text, record) => {
    //     const isAssignRoom = text === "Assign Room";

    //     return (
    //       <span
    //         style={{
    //           color: isAssignRoom ? "#1890ff" : "inherit",
    //           cursor: isAssignRoom ? "pointer" : "default",
    //           textDecoration: isAssignRoom,
    //         }}
    //         onClick={(e) => {
    //           if (isAssignRoom) {
    //             e.stopPropagation();
    //             setSelectedData(record);
    //             setAssignRoomOpen(true);
    //           }
    //         }}
    //       >
    //         {/* {text} */}
    //         <div>
    //             <div className="font-medium">{text}</div>
    //             <div className="text-xs text-gray-500">{text}</div>
    //           </div>
    //       </span>
    //     );
    //   },
    // },
   {
  title: "Room",
  key: "newRoom", 
  dataIndex: "newRoom", // Ensure dataIndex matches your data key
  className: "font-medium",
  render: (text, record) => {
    // Check if the value of 'newRoom' is exactly "Assign Room"
    const isAssignRoom = text === "Assign Room";

    return (
      <span
        style={{
          // Apply blue color if it is an Assign Room action
          color: isAssignRoom ? "#1890ff" : "inherit",
          cursor: isAssignRoom ? "pointer" : "default",
          display: "inline-block",
        }}
        onClick={(e) => {
          if (isAssignRoom) {
            e.stopPropagation();
            setSelectedData(record);
            setAssignRoomOpen(true);
          }
        }}
      >
        <div className="flex flex-col">
          {/* Top Line: The Room Name/Action */}
          <div className={`font-medium ${isAssignRoom ? "text-blue-500" : "text-gray-900"}`}>
            {text || "-"}
          </div>

          {/* Bottom Line: The Room Type category */}
          <div className="text-xs text-gray-500">
            {record.roomType}
          </div>
        </div>
      </span>
    );
  },
},

    {
      title: "Name",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Arrival",
      key: "arrivalDate",
      render: (_, record) => {
        const date = record.arrivalDate
          ? dayjs(record.arrivalDate).format("DD/MM/YYYY")
          : "-";

        return <div className="font-medium">{date}</div>;
      },
    },

    {
      title: "Departure",
      key: "departureDate",
      render: (_, record) => {
        const date = record.departureDate
          ? dayjs(record.departureDate).format("DD/MM/YYYY")
          : "-";

        return <div className="font-medium">{date}</div>;
      },
    },

    {
      title: "Room Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Rate Plan",
      dataIndex: "ratePlan",
      key: "ratePlan",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: (
              <Space
                size={4}
                onClick={() => {
                  setSelectedData(record);
                  setMode("view");
                  setDrawerOpen(true);
                }}
              >
                <EyeOutlined style={{ fontSize: "12px" }} />
                <span>View Info</span>
              </Space>
            ),
          },
          {
            key: "2",
            label: (
              <Space
                size={4}
                onClick={() => {
                  setSelectedData(record);
                  setMode("edit");
                  setDrawerOpen(true);
                }}
              >
                <EditOutlined style={{ fontSize: "12px" }} />
                <span>Edit Info</span>
              </Space>
            ),
          },
          {
            key: "3",
            label: (
              <Space
                size={4}
                onClick={() => {
                  setSelectedData(record);
                  setRoomMoveOpen(true);
                }}
              >
                <MdOutlineMeetingRoom style={{ fontSize: "12px" }} />
                <span>Room Move</span>
              </Space>
            ),
          },
          {
            key: "4",
            label: (
              <Space
                size={4}
                onClick={() => {
                  setSelectedData(record);
                  setNoteOpen(true);
                }}
              >
                <UploadOutlined style={{ fontSize: "12px" }} />
                <span>Service Note</span>
              </Space>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />

      <RoomInformationForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        onSuccess={refreshData}
      />

      <RoomMoveDrawer
        open={roomMoveOpen}
        selectedData={selectedData}
        onClose={() => setRoomMoveOpen(false)}
        reservationId={selectedData?.id}
      />

      <AssignRoomForm
        open={assignRoomOpen}
        onClose={() => setAssignRoomOpen(false)}
        selectedData={selectedData}
      />

      <NoteDrawer open={noteOpen} onClose={() => setNoteOpen(false)} />
    </div>
  );
};

export default RoomInformationTable;
