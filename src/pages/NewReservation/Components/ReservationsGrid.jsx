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
import { FaChild, FaGift, FaMoon } from "react-icons/fa";
import { IoCalendarOutline, IoDocumentTextOutline, IoPeopleSharp } from "react-icons/io5";
import PriceTag from "../../../component/PriceTag/PriceTag";
import ReservationStatusColor from "./../../../component/ReservationStatusColor/ReservationStatusColor";
import dayjs from "dayjs";
import PrintReservation from "../../../component/Topbar/PrintReservation";

const ReservationsGrid = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const navigate = useNavigate();
  const [printOpen, setPrintOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState();

  // Updated to pass item?.uuid as a clear path parameter
  const handleMenuClick = (item) => {
    if (item?.uuid) {
      navigate(`/reservations/${item.uuid}/room-information`);
    }
  };

  if (!data || data.length === 0) {
    return (
      <Empty description="No Reservations Found" style={{ marginTop: 60 }} />
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {data.map((item) => {
          console.log(item, "DATEITEmRESERVATionGRid")
          return (
            <>
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card
                  className="custom-blue-header"
                  title={
                    <span className="font-semibold capitalize text-[#ffffff]">
                      {item?.guest?.name}
                    </span>
                  }
                  extra={
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "edit",
                            label: "Edit",
                            icon: <EditOutlined />,
                            onClick: () => handleMenuClick(item),
                          },
                          ...(item?.roomStatus?.code === "confirmed"
                            ? [
                              {
                                key: "print",
                                label: "Print",
                                icon: <PrinterOutlined />,
                                onClick: () => {
                                  setPrintOpen(true),
                                    setSelectedReservation(item)
                                }
                              },
                            ]
                            : []),
                        ],
                      }}
                      trigger={["click"]}
                    >
                      <Button
                        type="text"
                        icon={
                          <MoreOutlined
                            style={{ color: "#ffffff", fontSize: "25px" }}
                          />
                        }
                      />
                    </Dropdown>
                  }
                >
                  {/* Info Row */}
                  <div
                    className="cursor-pointer"
                    onClick={() => handleMenuClick(item)}
                  >
                    <div style={{ marginBottom: 12 }}>
                      <Space size="middle" >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <IoDocumentTextOutline className="text-indigo-700 text-lg" />{" "}
                          {item?.ratePlan?.name}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <IoPeopleSharp className="text-blue-500 " /> {item.adults}
                        </span>

                        {/* {item.children && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <FaChild className="text-pink-500" /> {item.children}
                          </span>
                        )} */}
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
                        {item.checkinDate
                          ? dayjs(item.checkinDate).format("YYYY-MM-DD")
                          : "-"}
                      </div>

                      <div className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg border border-gray-100 ml-auto sm:ml-0">
                        <FaMoon className="text-xs" />
                        <span className="text-xs font-bold whitespace-nowrap">
                          {`${item.totalNight} ${item.totalNight === 1 ? "Night" : "Nights"}`}
                        </span>
                      </div>

                      <div
                        style={{ flex: 1, padding: "8px", background: "#fafafa" }}
                        className="dark:!bg-[#141414]"
                      >
                        {item.checkoutDate
                          ? dayjs(item.checkoutDate).format("YYYY-MM-DD")
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
                        <span style={{ color: "#8c8c8c" }}>Res No:</span>
                        <span className="font-bold text-indigo-800">
                          {item?.reservation?.reservationNo}
                        </span>
                      </div>

                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span style={{ color: "#8c8c8c" }}>Room Type:</span>
                        <span>{item?.roomType?.name}</span>
                      </div>

                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span style={{ color: "#8c8c8c" }}>Room No:</span>
                        <span>
                          {item?.room?.roomNo ? (
                            item.room.roomNo
                          ) : (
                            <span className="text-blue-600 font-medium cursor-pointer hover:text-indigo-800">
                              Assign Room
                            </span>
                          )}
                        </span>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span style={{ color: "#8c8c8c" }}>Contact No:</span>
                        <span>{item?.guest?.phone ? item.guest.phone : "-"}</span>
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <span style={{ color: "#8c8c8c", borderRadius: "5px" }}>
                          Status:
                        </span>

                        <ReservationStatusColor status={item?.roomStatus} />
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
                        <span>Total Charges</span>
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
            </>
          )
        })}
      </Row>

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
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

      <PrintReservation
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        data={selectedReservation}
      />

    </div>
  );
};

export default ReservationsGrid;
