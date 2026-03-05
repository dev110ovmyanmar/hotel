import React, { useState, useMemo } from "react";
import { Table, Drawer, Button, message, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import RoleDrawer from "./RoleDrawer";
import {
  fetchRoleData,
  createRoleFun,
  updateRoleFun,
  updateRolePermissionFun,
} from "../../api/roleApi.js";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import Loader from "../../component/Loader/Loader";
import useRoleColumns from "./useRoleColumns.jsx";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";

const RolesListing = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [messageApi, contextHolder] = message.useMessage();

  // ✅ Fetch role list ONCE — keyword removed from params (we filter client-side)
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roles",
    fetchQueryFunction: fetchRoleData,
    params: { page: currentPage, perPage: pageSize }, // ❌ removed keyword
  });

  const roles = Array.isArray(data?.data) ? data.data : [];
  const total = data?.total || 0;

  // ✅ CREATE mutation
  const createRoleFunction = useApiMutation({
    mutationFn: createRoleFun,
    invalidateKeys: [["roles"]],
  });

  // ✅ UPDATE mutation
  const updateRoleFunction = useApiMutation({
    mutationFn: updateRoleFun,
    invalidateKeys: [["roles", "roleDetail"]],
  });

  // ✅ UPDATE PERMISSION mutation
  const updatePermissionFunction = useApiMutation({
    mutationFn: updateRolePermissionFun,
    invalidateKeys: [["roles", "roleDetail"]],
  });

  // ✅ Client-side filter only — no API call triggered
  const filteredRoles = useMemo(() => {
    if (!keyword.trim()) return roles;

    const lowerKeyword = keyword.toLowerCase();
    return roles.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerKeyword) ||
        item.code?.toLowerCase().includes(lowerKeyword) ||
        item.description?.toLowerCase().includes(lowerKeyword),
    );
  }, [keyword, roles]);

  const handleEdit = (record) => {
    setSelectedRow(record);
    setCurrentMode("edit");
    setOpen(true);
  };

  const handleView = (record) => {
    setSelectedRow(record);
    setCurrentMode("view");
    setOpen(true);
  };

  const switchToEdit = () => {
    setCurrentMode("edit");
  };

  const onClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setOpen(true);
  };

  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";
  const isAdd = currentMode === "add";

  const DrawerTitle = isView
    ? "Role View"
    : isEdit
      ? "Role Edit"
      : isAdd
        ? "Role Create"
        : "";

  const columns = useRoleColumns(handleEdit, handleView, handleAdd);

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <>
          {/* <div className="mb-4 flex items-center justify-between gap-4 px-5">
            <Input
              placeholder="Search roles by name, code..."
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 300 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Add Role
            </Button>
          </div> */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
            <ListHeader
              title="Role List"
              searchPlaceholder="Search roles by name, code...."
              keyword={keyword}
              setKeyword={setKeyword}
              addButtonText="Add Role"
              onAdd={handleAdd}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredRoles}
            rowKey="id"
            className="mx-5"
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              // ✅ Use filtered count so pagination reflects search results
              total: keyword ? filteredRoles.length : total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30", "50"],
              placement: "bottomRight",
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
          />
        </>
      )}

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>{DrawerTitle}</span>
            {isView && (
              <Button type="primary" onClick={switchToEdit}>
                Edit
              </Button>
            )}
          </div>
        }
       width={500}
        onClose={onClose}
        open={open}
      >
        <RoleDrawer
          mode={currentMode}
          selectedData={selectedRow}
          setDrawerOpen={setOpen}
          roles={roles}
          createRoleFunction={createRoleFunction}
          updateRoleFunction={updateRoleFunction}
          updatePermissionFunction={updatePermissionFunction}
          messageApi={messageApi}
        />
      </Drawer>
    </>
  );
};

export default RolesListing;
