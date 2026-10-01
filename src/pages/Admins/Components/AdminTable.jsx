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
import { loadState } from "./../../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "./../../../variables/constants";
import Toast from "../../../component/Toast/Toast";
import usePermission from "../../../hooks/usePermission"; // <-- Permission hook
import { PERMISSIONS } from "../../../variables/permission";
import ColorStatusTag from './../../../component/ColorStatusTag/ColorStatusTag';
import { IoPersonCircleOutline } from "react-icons/io5";

const AdminTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
}) => {
  const { hasPermission } = usePermission();

  const localAdminDetails = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.uuid;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const columns = [
    {
      title: "ID",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
      width: 150,
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        // Define all possible actions
        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.ADMIN_VIEW,
            onClick: () => {
              setDrawerOpen(true);
              setMode("view");
              setSelectedData(record);
            },
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.ADMIN_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
          {
            key: "reset",
            label: "Reset Password",
            icon: <KeyOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.ADMIN_RESET_PASSWORD,
            hidden: localAdminDetails === record?.uuid,
            onClick: () => {
              setConfirmModal(true);
              setSelectedData(record);
            },
          },
        ];

        // Filter actions based on permission & hidden flags
        const items = actions
          .filter(
            (action) =>
              (!action.permission || hasPermission(action.permission)) && !action.hidden,
          )
          .map((action) => ({
            key: action.key,
            label: (
              <Space size={4} style={smallStyle} onClick={action.onClick}>
                {action.icon}
                <span style={{ fontSize: "14px" }}>{action.label}</span>
              </Space>
            ),
          }));
        return (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => {
                const action = actions.find(a => a.key === key);
                action?.onClick?.();
              },
            }}
            trigger={["click"]}
          >
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  // Reset Password API
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
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="adminIdentifier"
        loading={loading}
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

      />

      <Modal
        open={confirmModal}
        onCancel={() => setConfirmModal(false)}
        title="Reset Password Confirmation"
        onOk={resetPasswordOk}
        confirmLoading={resetPasswordFunction.isPending}
      >
        <div className="space-y-3 py-2">
          <p className="text-gray-700">
            Are you sure you want to reset password for this person ?
          </p>
          <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
            <IoPersonCircleOutline className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-700">
              {selectedData?.name} - {selectedData?.role?.name}
              <div>{" "}{selectedData?.email}</div>
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTable;
