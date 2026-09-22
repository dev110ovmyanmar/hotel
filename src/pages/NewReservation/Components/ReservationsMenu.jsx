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
  inquiry: { color: "#faad14", bg: "#fff7e6", border: "#faad14" },
  booking: { color: "#1677ff", bg: "#e6f4ff", border: "#1677ff" },
  arrival: { color: "#52c41a", bg: "#f6ffed", border: "#52c41a" },
  departure: { color: "#fa8c16", bg: "#fff2e8", border: "#fa8c16" },
  "in-house": { color: "#13c2c2", bg: "#e6fffb", border: "#13c2c2" },
  cancelled: { color: "#ff4d4f", bg: "#fff1f0", border: "#ff4d4f" },
  all: { color: "#0712a6", bg: "#c6defd", border: "#0712a6" },
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
  const [perPage, setPerPage] = useState(12);

  const [cachedCounts, setCachedCounts] = useState(null);

  const validStatuses = Object.keys(statusColors);
  const isValidStatus = validStatuses.includes(activeStatus);

  useEffect(() => {
    if (!routeStatus || routeStatus === ":status") {
      navigate("/reservations/all", { replace: true });
    } else if (!validStatuses.includes(routeStatus)) {
      navigate("/404", { replace: true });
    }
  }, [routeStatus, navigate]);

  const { data, isFetching , isLoading} = useApiQuery({
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
    options: {
      enabled: isValidStatus,
    },
  });

  useEffect(() => {
    if (data?.count) {
      setCachedCounts(data.count);
    }
  }, [data]);

  const displayCounts = cachedCounts || data?.count;

  useEffect(() => {
    setPage(1);
  }, [keyword, activeStatus, perPage]);

  const items = [
    {
      label: "Inquiry",
      key: "inquiry",
      count: displayCounts?.inquiryCount,
    },
    {
      label: "Booking",
      key: "booking",
      count: displayCounts?.bookingCount,
    },
    {
      label: "Arrivals",
      key: "arrival",
      count: displayCounts?.arrivalCount,
    },
    {
      label: "Departures",
      key: "departure",
      count: displayCounts?.departureCount,
    },
    {
      label: "In-house",
      key: "in-house",
      count: displayCounts?.inHouseCount,
    },
    {
      label: "Cancelled",
      key: "cancelled",
      count: displayCounts?.cancelledCount,
    },
    { label: "All", key: "all", count: displayCounts?.totalCount },
  ];

  const handleTabChange = (key) => {
    navigate(`/reservations/${key}`);
    setKeyword("");

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
        type={view === "grid" ? "primary" : "default"}
        className={`rounded-sm border-2 border-gray-300 transition-all duration-200 ${view === "grid"
            ? "bg-[#1677ff] shadow-sm text-gray-100! border-[#1677ff]!"
            : "hover:text-gray-500 hover:bg-gray-200!"
          }`}
        onClick={() => handleViewChange("grid")}
      />
      <Button
        icon={<UnorderedListOutlined />}
        type={view === "table" ? "primary" : "default"}
        className={`rounded-sm border-2 border-gray-300 transition-all duration-200 ${view === "table"
            ? "bg-[#1677ff] shadow-sm text-gray-100! border-[#1677ff]!"
            : "hover:text-gray-500 hover:bg-gray-200!"
          }`}
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
                    count={item?.count ?? 0}
                    showZero
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
      <div className="w-full px-6">
        <ReservationSearchBar
          searchPlaceholder="Search ....."
          keyword={keyword}
          setKeyword={setKeyword}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <Spin spinning={isLoading}>
          {view === "grid" ? (
            <ReservationsGrid
              data={data?.data || []}
              page={page}
              perPage={perPage}
              total={data?.pagination?.total}
              changePage={setPage}
              changePerPage={setPerPage}
              loading={isFetching}
            />
          ) : (
            <ReservationsTable
              data={data?.data || []}
              page={page}
              perPage={perPage}
              total={data?.pagination?.total}
              changePage={setPage}
              changePerPage={setPerPage}
              loading={isFetching}
            />
          )}
        </Spin>
      </div>
    </>
  );
};

export default ReservationMenu;