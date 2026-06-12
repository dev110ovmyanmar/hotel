import React, { useState } from "react";
import { Drawer, Table, Tag, Space, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CloseOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { reservationGuestList } from "../../../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../../../variables/constants";
import { useLocation } from "react-router-dom";

const GuestListDrawer = ({
  visible,
  onClose,
  drawerOpen,
  setDrawerOpen,
  reservationUuid,
  reservationRoomUuid,
  selectedData,
}) => {
  const uuid = reservationRoomUuid?.uuid;
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [keyword, setKeyword] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "reservation-guest",
    fetchQueryFunction: reservationGuestList,
    params: {
      pagination: {
        page,
        perPage,
      },
      keyword,
      // reservation: { uuid },
      reservationRoom: { uuid: selectedData?.uuid },
      status:showActiveOnly,
    },
  });
 
  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => {
        return record?.guest?.name || record?.name || "-";
      },
    },
    {
      title: "NRC",
      dataIndex: ["guest", "nrcNo"],
      key: "nrc",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Phone",
      dataIndex: ["guest", "phone"],
      key: "phone",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Guest Type",
      dataIndex: "isPrimary",
      key: "isPrimary",
      render: (text) => (
        <div>{text === true ? "Main Guest" : "Share Guest"}</div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Guest">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title="Guest List"
      placement="right"
      width={700}
      onClose={setDrawerOpen}
      open={drawerOpen}
    >
      <div
      >
        <Table columns={columns} dataSource={data?.data} pagination={false} />
      </div>
    </Drawer>
  );
};

export default GuestListDrawer;
