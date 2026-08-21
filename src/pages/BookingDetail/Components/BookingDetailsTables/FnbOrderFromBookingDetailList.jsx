import React from "react";
import { Card, Row, Col, Typography, Tag, Space, Table } from "antd";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import dayjs from "dayjs";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";

const { Text } = Typography;

const FnbOrderFromBookingDetailList = ({ data }) => {
  const getStatusTag = (status) => {
    const colors = {
      pending: "warning",
      confirm: "processing",
      completed: "success",
      cancelled: "error",
      delivered: "cyan",
    };
    console.log(data, "FnbOrderFromBookingDetailList")

    return (
      <Tag
        color={colors[status.toLowerCase()] || "default"}
        className="rounded-full px-3"
      >
        {status}
      </Tag>
    );
  };

  const CustomTitle = (
    <Space>
      <div className="food-icon-box">
        <IoRestaurantOutline style={{ color: "#d56333", fontSize: "18px" }} />
      </div>
      <Text>Food Beverage Order</Text>
    </Space>
  );

  const columns = [
    {
      title: "Room No",
      dataIndex: ["reservationRoom", "room", "roomNo"],
      key: "roomNo",
    },
    {
      title: "Fnb Order Date",
      dataIndex: "orderAt",
      key: "orderAtDate",
      render: (text) => {
        const date = dayjs(text).format("YYYY-MM-DD")
        return (
          <div>{date}</div>
        );
      },
    },
    {
      title: "Fnb Order Time",
      dataIndex: "orderAt",
      key: "orderAtTime",
      render: (text) => {
        const date = dayjs(text).format("hh:mm A")
        return (
          <div>{date}</div>
        );
      },
    },
    {
      title: "Order Type",
      key: "orderType",
      render: (record, text) => {
        return (
          <div className="flex-col">
            <div>{record?.orderType.name}</div>
            {record?.orderType.code === "dine_in" &&
              <div>Table No - {record?.restaurantTable ? `(${record?.restaurantTable?.tableNo})` : null}</div>
            }
          </div>
        )
      }
    },
    {
      title: "Fnb Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        console.log(status, "statusfnborder")
        return (
          status ? <ColorStatusTag status={status} /> : "-"
        );
      },
    },

  ];
  return (
    <>
      {
        data?.length !== 0 && (
          <Card title={CustomTitle} className="food-card line-height">
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              pagination={false}
            />
          </Card>
        )
      }
    </>
  );
};

export default FnbOrderFromBookingDetailList;
