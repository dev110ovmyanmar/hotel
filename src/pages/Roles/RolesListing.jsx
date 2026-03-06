import React, { useState, useMemo } from "react";
import { Table, Drawer, Button, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import RoleForm from "./Components/RoleForm.jsx";
import {
  fetchRoleData,
  createRoleFun,
  updateRoleFun,
  updateRolePermissionFun,
} from "../../api/roleApi.js";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import RolesTable from "./Components/RolesTable.jsx";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";


const RolesListing = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch role list ONCE — keyword removed from params (we filter client-side)
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roles",
    fetchQueryFunction: fetchRoleData,
    params: { page: currentPage, perPage: pageSize }, // ❌ removed keyword
  });

  const roles = Array.isArray(data?.data) ? data.data : [];
  

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

  return (
    <>
      <>
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

        <RolesTable
          dataSource={filteredRoles}
          loading={isLoading}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
        />
      </>
      <RoleForm
        mode={currentMode}
        selectedData={selectedRow}
        setDrawerOpen={setOpen}
        roles={roles}
        createRoleFunction={createRoleFunction}
        updateRoleFunction={updateRoleFunction}
        updatePermissionFunction={updatePermissionFunction}
        switchToEdit={switchToEdit}
        DrawerTitle={DrawerTitle}
        onClose={onClose}
        open={open}
      />
    </>
  );
};

export default RolesListing;
