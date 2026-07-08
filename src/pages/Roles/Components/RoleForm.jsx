import React, { useEffect, useState } from "react";
import { Button, Form, Input, Divider, Drawer } from "antd";
import Loader from "../../../component/Loader/Loader";
import PermissionAssignDrawer from "./PermissionAssignDrawer";
import { getRoleDetails, upsertRole } from "../../../api/roleApi";
import useApiQuery from "../../../hooks/useApiQuery";
import Toast from "../../../component/Toast/Toast";
import FormButtons from "../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../hooks/useApiMutation";

const { TextArea } = Input;

const RoleForm = ({
  mode,
  roles = [],
  loading = false,
  switchToEdit,
  page,
  setPage,
  selectedRow,
  setSelectedRow,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();
  const [permDrawerOpen, setPermDrawerOpen] = useState(false);
  const [currentPermissions, setCurrentPermissions] = useState([]);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const createRole = useApiMutation({
    mutationFn: upsertRole,
    invalidateKeys: [["roles"]],
    shouldInvalidate: page === 1
  });

  const editRole = useApiMutation({
    mutationFn: upsertRole,
    invalidateKeys: [["roles"]],
  });

  // console.log('RoleForm Debug:', {
  //   selectedRow: selectedRow?.uuid,
  //   mode,
  //   drawerOpen,
  //   shouldCallAPI: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen
  // });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "roles_details",
    fetchQueryFunction: getRoleDetails,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen,
    }
  });

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
      setCurrentPermissions([]);
    } else if (data) {
      form.setFieldsValue({ ...data });

      const initialSelectedIds = [];
      data.permissions?.forEach((group) => {
        group.permissions?.forEach((p) => {
          if (p.selected) initialSelectedIds.push(p.id);
        });
      });
      setCurrentPermissions(initialSelectedIds);
    }
  }, [data, mode]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        permissionId: currentPermissions.map((id) => parseInt(id, 10)),
      };

      createRole.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Role Created Successfully!");
        }
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        uuid: data?.uuid,
        permission: {
          ids: currentPermissions.map((id) => parseInt(id, 10)),
        }
      };
      editRole.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Role Updated Successfully");
        },
      });
    }
  };

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Role Details"
    : isEdit
      ? "Role Edit"
      : "Role Create";

  const handlePermissionSave = (newIds) => {
    const newIdsAsInt = newIds.map((id) => parseInt(id, 10));

    setCurrentPermissions(newIdsAsInt);
    const updatePermissionsValues = {
      uuid: data?.uuid,
      name: data?.name,
      code: data?.code,
      description: data?.description || "",
      permission: {
        ids: newIdsAsInt
      }
    };

    editRole.mutate(updatePermissionsValues, {
      onSuccess: () => {
        Toast.success("Permissions updated successfully");
      },
      onError: () =>
        Toast.error("An error occurred while updating permissions"),
    });
    setPermDrawerOpen(false);
  };

  const darkModeStyle = `
    dark:border dark:border-gray-600 dark:!bg-[#141414] 
    dark:text-gray-100
  `;

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>{DrawerTitle}</span>
            {isView ? (
              <Button type="primary" onClick={switchToEdit}>
                Edit
              </Button>
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                mode={mode}
                loading={
                  isAdd
                    ? createRole.isPending
                    : editRole.isPending
                }
              />
            )}
          </div>
        }
        size={500}
        onClose={onClose}
        open={drawerOpen}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* ── Role Info Fields ── */}
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input readOnly={isView} placeholder="Enter Role Name" />
            </Form.Item>
            <Form.Item label="Code" name="code" rules={[{ required: true }]}>
              <Input readOnly={isView} placeholder="Enter Role Code" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <TextArea readOnly={isView} placeholder="Enter Description" />
            </Form.Item>

            {/* ── Permissions Section (edit / view only, not add) ── */}
            {!isAdd && (
              <>
                <Divider />
                <div
                  className={`bg-[#f5f5f5] p-4 rounded-lg mb-5 flex justify-between items-center ${darkModeStyle}`}
                >
                  <span>
                    Permissions Selected: <b>{currentPermissions.length}</b>
                  </span>

                  {!isView && (
                    <Button
                      type="primary"
                      loading={editRole?.isPending}
                      onClick={() => setPermDrawerOpen(true)}
                    >
                      Manage Permissions
                    </Button>
                  )}
                </div>
              </>
            )}

            {/* ── Permission Assign Drawer ── */}
            <PermissionAssignDrawer
              open={permDrawerOpen}
              onClose={() => setPermDrawerOpen(false)}
              rolePermissions={data?.permissions || []}
              selectedPermissions={currentPermissions}
              onSave={handlePermissionSave}
            />
          </Form>
        )}
      </Drawer>
    </>
  );
};

export default RoleForm;