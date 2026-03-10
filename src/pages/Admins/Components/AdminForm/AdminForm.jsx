import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Image, Drawer, AutoComplete } from "antd";
import Toast from "../../../../component/Toast/Toast";
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

const AdminForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", {}]);

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
  });

  const editAdminFunction = useApiMutation({
    mutationFn: editAdminFun,
    invalidateKeys: [["admins"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "admins",
    fetchQueryFunction: adminDetailsFunApi,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

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
                  createAdminFunction.isLoading || editAdminFunction.isLoading
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
        </Form>
      </Drawer>
    </div>
  );
};

export default AdminForm;
