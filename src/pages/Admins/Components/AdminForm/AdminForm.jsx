import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Image, Drawer, AutoComplete } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import {
  adminDetailsFunApi,
  createAdminFun,
  editAdminFun,
} from "../../../../api/adminFunctionApi";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { Divider } from 'antd';
import AddOnDrawer from './AddOnDrawer';
import { adminPermission } from './../../../../api/adminFunctionApi';
import Toast from './../../../../component/Toast/Toast';

const AdminForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData"]);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const roles = initData?.roles?.map((role) => ({
    value: role.uuid,
    label: role.name,
  }));

  const statuses = initData?.statuses?.status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const createAdminFunction = useApiMutation({
    mutationFn: createAdminFun,
    invalidateKeys: [["admins"]],
    page: page
  });

  const editAdminFunction = useApiMutation({
    mutationFn: editAdminFun,
    invalidateKeys: [["admins"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "admin-details",
    fetchQueryFunction: adminDetailsFunApi,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  const [allowMode, setAllowMode] = useState(""); // "allow" or "notAllow"


  const changesNotAllowList = data?.permissions?.changesNotAllowList;
  const changesAllowList = data?.permissions?.changesAllowList;
  const allowPermissionIds =
    changesAllowList?.flatMap(module =>
      module.permissions
        .filter(p => p.selected === true)
        .map(p => p.id)
    ) || [];

  const notAllowPermissionIds =
    changesNotAllowList?.flatMap(module =>
      module.permissions
        .filter(p => p.selected === true)
        .map(p => p.id)
    ) || [];


  const addOnAdminPermission = useApiMutation({
    mutationFn: adminPermission,
    invalidateKeys: [["admins"]],
    page: page
  });


  const onSave = (values) => {
    const modifiedValues = {
      uuid: data?.uuid,
      permission: {
        ids: values
      }

    };
    addOnAdminPermission.mutate(modifiedValues,
      {
        onSuccess: () => {
          setAdminDrawerOpen(false);
          Toast.success("Added Permission Successfully");
          setSelectedPermissions(values);
        }
      }
    )
  }

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        status: data?.status?.uuid,
        role: data?.role?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        role: { uuid: values.role },
        status: { uuid: values.status },
      };

      createAdminFunction.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Admin Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values, // merge new form values
        role: { uuid: values.role },
        status: { uuid: values.status },
        uuid: data?.uuid,
      };

      editAdminFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Admin Updated Successfully!");
        },
      });
    }
  };

  const adminDrawerFunction = (mode) => {
    setAllowMode(mode);
    setAdminDrawerOpen(true);
  };

  useEffect(() => {
    if (data && allowMode === "allow") {
      setSelectedPermissions(allowPermissionIds);
    }
  }, [data]);

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Admin Details"
                : mode === "edit"
                  ? "Edit Admin"
                  : "Create Admin"}
            </span>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={
                  mode === "add" ? createAdminFunction.isPending : editAdminFunction.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
          disabled={isView}

        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Admin Name is Required" }]}
            aut
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Admin Email is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select
              showSearch
              options={roles}
              open={isView ? false : undefined}
            />
          </Form.Item>

          <Form.Item label="Staff" name="staff" readOnly={isView}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is Required" }]}
          >
            <Select
              showSearch
              options={statuses}
              open={isView ? false : undefined}
            />
          </Form.Item>

          {
            isEdit && (
              <div className="mt-6">
                <Divider />

                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Original :{" "}
                    <b>{changesNotAllowList?.length}</b>
                  </span>

                  {changesNotAllowList?.length <= 0 ? null : (
                    <Button
                      type="primary"
                      onClick={() => adminDrawerFunction("notAllow")}
                    >
                      View Permissions
                    </Button>
                  )}

                </div>

                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Add On :{" "}
                    <b>{changesAllowList?.length}</b>
                  </span>

                  {changesAllowList?.length <= 0 ? null : (
                    <Button
                      type="primary"
                      onClick={() => adminDrawerFunction("allow")}
                    >
                      Add On Permissions
                    </Button>
                  )}

                </div>

                <AddOnDrawer
                  mode={allowMode}
                  open={adminDrawerOpen}
                  onClose={() => setAdminDrawerOpen(false)}
                  loading={addOnAdminPermission.isPending}
                  rolePermissions={allowMode === "notAllow" ? changesNotAllowList : changesAllowList}
                  selectedPermissions={allowMode === "notAllow" ? notAllowPermissionIds : selectedPermissions}
                  onSave={onSave}
                />

              </div>

            )
          }

        </Form>
      </Drawer>
    </div>
  );
};

export default AdminForm;
