import { Divider, Tag } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

const ReservationHeader = () => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Liam Johnson Smith</h1>
          <Tag color="warning" className="rounded-full px-3">
            Pending
          </Tag>
        </div>

        <div className="flex justify-between space-x-10 mx-40">
          <div className="flex flex-col">
            <span>Arrival</span>
            <span className="text-xs font-semibold mt-1">
              11/11/2026
              <span className="ml-2 border border-gray-300 text-gray-800 px-2 py-0.5 text-xs font-medium">
                2:00 PM
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span>Departure</span>
            <span className="text-xs mt-1 font-semibold">
              13/11/2026
              <span className="ml-2 border border-gray-300 text-gray-800 px-2 py-0.5  text-xs font-medium">
                12:00 PM
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
          gap: "6px",
          // marginLeft: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <IoPeopleSharp />
          <h1 style={{ margin: 0, fontSize: "10px" }}>2</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FaChild />
          <h1 style={{ margin: 0, fontSize: "10px" }}>1</h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#000000" }}>|</span>
          <span style={{ fontWeight: "100", color: "#555" }}>1 Extra bed</span>
        </div>
      </div>
      <Divider className="custom-divider" />
    </div>
  );
};

export default ReservationHeader;
