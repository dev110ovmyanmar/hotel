import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Tag,
  Dropdown,
  Button,
  Space,
  Pagination,
  Empty,
} from "antd";
import {
  PhoneOutlined,
  MoreOutlined,
  EditOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import PriceTag from "../../../component/PriceTag/PriceTag";
import ReservationStatusColor from "./../../../component/ReservationStatusColor/ReservationStatusColor";
import dayjs from "dayjs";

const ReservationsGrid = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const navigate = useNavigate();

  const handleMenuClick = (uuid) => {
    navigate(`/reservation/booking-detail`, { state: { bookingId: uuid } });
  };

  if (!data || data.length === 0) {
    return (
      <Empty description="No Reservations Found" style={{ marginTop: 60 }} />
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {data.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              title={
                <span style={{ fontWeight: 600 }}>{item?.guest?.name}</span>
              }
              extra={
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        onClick: () => handleMenuClick(item.uuid),
                      },
                      {
                        key: "print",
                        label: "Print",
                        icon: <PrinterOutlined />,
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              }
            >
              {/* Info Row */}
              <div
                className="cursor-pointer"
                onClick={() => handleMenuClick(item.uuid)}
              >
                <div style={{ marginBottom: 12 }}>
                  <Space size="middle" style={{ color: "#555" }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <PhoneOutlined /> {item?.guest?.phone}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <IoPeopleSharp /> {item.adults}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <FaChild /> {item.children}
                    </span>
                  </Space>
                </div>

                {/* Date Box */}
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #f0f0f0",
                    borderRadius: "4px",
                    textAlign: "center",
                    marginBottom: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{ flex: 1, padding: "8px", background: "#fafafa" }}
                    className="dark:!bg-[#141414]"
                  >
                    {item.actualCheckin
                      ? dayjs(item.actualCheckin).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderLeft: "1px solid #f0f0f0",
                      borderRight: "1px solid #f0f0f0",
                      backgroundColor: "#e2e2e2",
                    }}
                    className="dark:!bg-[#333333]"
                  >
                    {`${item.totalNight} ${item.totalNight === 1 ? "Night" : "Nights"}`}
                  </div>
                  <div
                    style={{ flex: 1, padding: "8px", background: "#fafafa" }}
                    className="dark:!bg-[#141414]"
                  >
                    {item.actualCheckout
                      ? dayjs(item.actualCheckout).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                </div>

                {/* Details List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#8c8c8c" }}>Order Id</span>
                    <span>{item.id}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#8c8c8c" }}>Booking Date</span>
                    <span>
                      {item.createdAt
                        ? dayjs(item.actualCheckin).format("DD/MM/YYYY")
                        : "-"}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#8c8c8c" }}>Rooms</span>
                    <span>{item.totalRooms}</span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "#8c8c8c", borderRadius: "5px" }}>
                      Status
                    </span>

                    <ReservationStatusColor status={item?.reservationStatus} />
                  </div>

                  <hr
                    style={{
                      border: "none",
                      borderTop: "1px solid #f0f0f0",
                      margin: "8px 0",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Total</span>
                    <span
                      style={{
                        display: "flex",
                        gap: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <PriceTag value={item.grandTotal} />
                      <span>MMK</span>
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={page}
          total={total}
          pageSize={perPage}
          pageSizeOptions={["12", "24", "36", "48"]}
          onChange={(page, perPage) => {
            changePage(page);
            changePerPage(perPage);
          }}
          showSizeChanger={true}
        />
      </div>
    </div>
  );
};

export default ReservationsGrid;
