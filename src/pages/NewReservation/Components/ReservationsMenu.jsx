import React, { useEffect, useState } from "react";
import { Tabs, Badge, Space, Button, Spin } from "antd";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import ReservationsGrid from "./ReservationsGrid";
import { reservationList } from "../../../api/reservationSectionApi";
import ReservationsTable from "./ReservationsTable";
import useApiQuery from "../../../hooks/useApiQuery";
import { LIMITS } from "../../../variables/constants";
import ReservationSearchBar from "./ReservationsSearch";
import { useNavigate, useParams } from "react-router-dom";

const statusColors = {
  inquery: { color: "#faad14", bg: "#fff7e6", border: "#faad14" },
  booking: { color: "#1677ff", bg: "#e6f4ff", border: "#1677ff" },
  arrival: { color: "#52c41a", bg: "#f6ffed", border: "#52c41a" },
  departure: { color: "#fa8c16", bg: "#fff2e8", border: "#fa8c16" },
  "in-house": { color: "#13c2c2", bg: "#e6fffb", border: "#13c2c2" },
  cancelled: { color: "#ff4d4f", bg: "#fff1f0", border: "#ff4d4f" },
  all: { color: "#373434", bg: "#f5f5f5", border: "#373434" },
};

const ReservationMenu = ({ onStatusChange, onViewChange }) => {
  const navigate = useNavigate();
  const { status: routeStatus } = useParams();

  const activeStatus =
    !routeStatus || routeStatus === ":status" ? "all" : routeStatus;

  const [view, setView] = useState("grid");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  useEffect(() => {
    if (!routeStatus || routeStatus === ":status") {
      navigate("/reservations/all", { replace: true });
    }
  }, [routeStatus, navigate]);

  const { data, isLoading } = useApiQuery({
    fetchQueryName: ["reservation-list", activeStatus, keyword, page, perPage],
    fetchQueryFunction: reservationList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: { name: activeStatus === "all" ? null : activeStatus },
    },
  });

  const reservationCounts = data?.count;

  useEffect(() => {
    setPage(1);
  }, [keyword, activeStatus, perPage]);

  const items = [
    {
      label: "Inquiry",
      key: "inquery",
      count: reservationCounts?.inqueryCount,
    },
    {
      label: "Booking",
      key: "booking",
      count: reservationCounts?.bookingCount,
    },
    {
      label: "Arrivals",
      key: "arrival",
      count: reservationCounts?.arrivalCount,
    },
    {
      label: "Departures",
      key: "departure",
      count: reservationCounts?.departureCount,
    },
    {
      label: "In-house",
      key: "in-house",
      count: reservationCounts?.inHouseCount,
    },
    {
      label: "Cancelled",
      key: "cancelled",
      count: reservationCounts?.cancelledCount,
    },
    { label: "All", key: "all", count: reservationCounts?.totalCount },
  ];

  const handleTabChange = (key) => {
    navigate(`/reservations/${key}`);

    if (onStatusChange) {
      onStatusChange(key);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);

    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const renderExtraContent = (
    <Space size="small" style={{ marginRight: 20 }}>
      <Button
        icon={<AppstoreOutlined />}
        type={view === "grid" ? "primary" : "text"}
        onClick={() => handleViewChange("grid")}
      />
      <Button
        icon={<UnorderedListOutlined />}
        type={view === "table" ? "primary" : "text"}
        onClick={() => handleViewChange("table")}
      />
    </Space>
  );

  return (
    <>
      <div className="px-6">
        <Tabs
          activeKey={activeStatus}
          tabBarExtraContent={renderExtraContent}
          onChange={handleTabChange}
          className="custom-tabs"
          items={items.map((item) => {
            const colors = statusColors[item.key] || {};
            return {
              key: item.key,
              label: (
                <span>
                  {item.label}
                  <Badge
                    count={item.count}
                    style={{
                      color: colors.color,
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.border}`,
                      fontSize: "12px",
                      borderRadius: "3px",
                      marginLeft: "8px",
                      marginRight: "8px",
                    }}
                  />
                </span>
              ),
            };
          })}
        />
      </div>
      <div className="w-full px-6 mt-5">
        <ReservationSearchBar
          searchPlaceholder="Search ....."
          keyword={keyword}
          setKeyword={setKeyword}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        {view === "grid" ? (
          <ReservationsGrid
            data={data?.data || []}
            page={page}
            perPage={perPage}
            total={data?.pagination?.total}
            changePage={setPage}
            changePerPage={setPerPage}
            loading={isLoading}
          />
        ) : (
          <ReservationsTable
            data={data?.data || []}
            page={page}
            perPage={perPage}
            total={data?.pagination?.total}
            changePage={setPage}
            changePerPage={setPerPage}
            loading={isLoading}
          />
        )}
      </div>
    </>
  );
};

export default ReservationMenu;
