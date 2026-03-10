import { UsergroupAddOutlined, UserOutlined } from "@ant-design/icons";
import { Divider } from "antd";

const ReservationHeader = () => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold">Liam Johnson Smith</h1>
        <div className="flex justify-between space-x-10 mx-40">
          <div className="flex flex-col">
            <span>Arrival</span>
            <span className="text-xs font-semibold mt-1">
              11/11/2026
              <span className="ml-2 border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                10:00 PM
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span>Departure</span>
            <span className="text-xs mt-1 font-semibold">
              13/11/2026
              <span className="ml-2 border border-gray-300 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                10:00 PM
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span>Night</span>
            <span className="text-xs mt-1 font-semibold ">2</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginLeft: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UsergroupAddOutlined />
          <h1 style={{ margin: 0 }}>1</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserOutlined />
          <h1 style={{ margin: 0 }}>1</h1>
        </div>
      </div>
      <Divider className="custom-divider" />
    </div>
  );
};

export default ReservationHeader;
