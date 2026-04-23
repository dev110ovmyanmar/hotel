import React from "react";
import { Badge, Button, Space, Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";

const ReservationListMenu = ({ view, onViewChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegment = location.pathname.split("/").pop();

  const activeKey =
    pathSegment === "reservation" || !pathSegment ? "inquiry" : pathSegment;

  const onChange = (key) => {
    navigate(`/reservation/${key}`);
  };

  const renderExtraContent = (
    <Space size="small" style={{ marginRight: 20 }}>
      <Button
        icon={<AppstoreOutlined />}
        type={view === "grid" ? "primary" : "text"}
        onClick={() => onViewChange("grid")}
      />
      <Button
        icon={<UnorderedListOutlined />}
        type={view === "table" ? "primary" : "text"}
        onClick={() => onViewChange("table")}
      />
    </Space>
  );

  return (
    <div className="w-full px-6">
      <Tabs
        activeKey={activeKey} 
        tabBarExtraContent={renderExtraContent}
        onChange={onChange}
        items={[
          {
            label: (
              <Space>
                Inquiry
                <Badge count={5} />
              </Space>
            ),
            key: "inquiry",
          },
          {
            label: (
              <Space>
                Booking
                <Badge count={5} />
              </Space>
            ),
            key: "booking",
          },
          {
            label: (
              <Space>
                Arrivals
                <Badge count={5} />
              </Space>
            ),
            key: "arrivals",
          },
          {
            label: (
              <Space>
                Departures
                <Badge count={5} />
              </Space>
            ),
            key: "departures",
          },
          {
            label: (
              <Space>
                In-house
                <Badge count={15} />
              </Space>
            ),
            key: "in-house",
          },
          {
            label: (
              <Space>
                Cancelled
                <Badge count={15} />
              </Space>
            ),
            key: "cancelled",
          },
          {
            label: (
              <Space>
                All
                <Badge count={15} />
              </Space>
            ),
            key: "all",
          },
        ]}
      />
    </div>
  );
};

export default ReservationListMenu;
