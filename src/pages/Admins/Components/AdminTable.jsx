import { Button, Dropdown, Modal,  Space, Table, Tag } from 'antd';
import { useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import AdminForm from "./AdminForm/AdminForm";
import { KeyOutlined, MoreOutlined } from '@ant-design/icons';
import { useApiMutation } from '../../../hooks/useApiMutation';
import { resetFunction } from '../../../api/resetFunctionApi';

const AdminTable = ({ data, page, perPage, total, changePage, changePerPage }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);


  const columns = [
    {
      title: 'No.',
      render: (_, record) => <div>{record?.id}</div>,
      width: 70
    },
    {
      title: 'Admin Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Admin Email',
      dataIndex: 'email',
      key: 'email',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => <div>{record?.role.name}</div>
    },
    {
      title: 'Staff',
      dataIndex: 'staff',
      key: 'staff',
      render: text => <div>{text ? text : "-"}</div>,
      width: 70
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) =>
        <Tag color={record?.status?.name === "Active" ? "green" : "red"}>{record?.status?.name.toUpperCase()}</Tag>,
      width: 150
    },
    {
      title: 'Action',
      width:70,
      render: (_, record) => {
        const items = [
          {
            key: "1",
            label: (
              <Space onClick={() => { setDrawerOpen(true); setMode("view"); setSelectedData(record) }}>
                <AiTwotoneEye   />
                <span >View</span>
              </Space>
            )
          },
          {
            key: "2",
            label: (
              <Space onClick={() => { setDrawerOpen(true); setMode("edit"); setSelectedData(record) }}>
                <FiEdit  />
                <span >Edit</span>
              </Space>

            )
          },
          {
            key: "3",
            label: (
              <Space onClick={() => { setConfirmModal(true); setSelectedData(record) }}>
                <KeyOutlined  />
                <span >Reset Passoword</span>
              </Space>

            )
          },
        ];

        return (
          <Dropdown menu={{ items }} placement='topLeft' trigger={["click"]}>
            <MoreOutlined />
          </Dropdown>
        )
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
      }
    }
  });

  const resetPasswordOk = () => {
    if (!selectedData?.uuid) return;
    resetPasswordFunction.mutate(selectedData?.uuid);
  }

  return (
    <div id="scrollId" className="w-full h-[63vh]" >

      <Table
        size='small'
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
            changePerPage(perPage)
          },
          showSizeChanger: true
        }}

      />

      <AdminForm
        mode={mode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />

      <Modal
        open={confirmModal}
        onCancel={() => setConfirmModal(false)}
        title="Are you sure you want to reset password?"
        onOk={resetPasswordOk}
        confirmLoading={resetPasswordFunction.isPending}

      >

      </Modal>
    </div>
  )
};


export default AdminTable;