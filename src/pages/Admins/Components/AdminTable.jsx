import { Button, Dropdown, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";
import AdminForm from "./AdminForm/AdminForm";
import {
  KeyOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { resetFunction } from "../../../api/resetFunctionApi";
import { loadState } from './../../../utils/Utils';
import { LOCAL_STORAGE_KEYS } from './../../../variables/constants';

const AdminTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const localAdminDetails = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.uuid;

  const columns = [
    {
      title: "No",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (_, record) => <div>{record?.role.name}</div>,
    },
    {
      title: "Staff",
      dataIndex: "staff",
      key: "staff",
      render: (text) => <div>{text ? text : "-"}</div>,
      width: 70,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tag color={record?.status?.name === "Active" ? "green" : "red"}>
          {record?.status?.name.toUpperCase()}
        </Tag>
      ),
      width: 150,
    },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const items = [
          {
            key: "1",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setDrawerOpen(true);
                  setMode("view");
                  setSelectedData(record);
                }}
              >
                <EyeOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>View</span>
              </Space>
            ),
          },
          {
            key: "2",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setDrawerOpen(true);
                  setMode("edit");
                  setSelectedData(record);
                }}
              >
                <EditOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Edit</span>
              </Space>
            ),
          },
          localAdminDetails !== record?.uuid &&
          {
            key: "3",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setConfirmModal(true);
                  setSelectedData(record);
                }}
              >
                <KeyOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Reset Password</span>
              </Space>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  const resetPasswordFunction = useApiMutation({
    mutationFn: resetFunction,
    invalidateKeys: [["reset"]],
    options: {
      onSuccess: () => {
        setConfirmModal(false);
        Toast.success("Password reset successfully");
      },
    },
  });

  const resetPasswordOk = () => {
    if (!selectedData?.uuid) return;
    resetPasswordFunction.mutate(selectedData?.uuid);
  };

  return (
    <div id="scrollId">
      <Table
        // size="small"
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="adminIdentifier"
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (page, perPage) => {
            changePage(page);
            changePerPage(perPage);
          },
          showSizeChanger: true,
        }}
      />

      <AdminForm
        page={page}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        width={500}
      />

      <Modal
        open={confirmModal}
        onCancel={() => setConfirmModal(false)}
        title="Are you sure you want to reset password?"
        onOk={resetPasswordOk}
        confirmLoading={resetPasswordFunction.isPending}
      ></Modal>
    </div>
  );
};

export default AdminTable;
