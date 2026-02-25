
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Image, Drawer, AutoComplete } from "antd";
import { data, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../../../component/Toast/Toast";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { adminDetailsFunApi, createAdminFun, editAdminFun } from "../../../../api/adminFunApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { loadState } from "../../../../utils";
import { queryClient } from "../../../../app/queryClient";


const AdminForm = ({ mode, selectedData, setSelectedData, drawerOpen, setDrawerOpen }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", {}]);
  
  const roles = initData?.roles?.map(role => ({
    value: role.uuid,
    label: role.name
  }));

  const statuses = initData?.statuses?.status?.map(status => ({
    value: status.uuid,
    label: status.name
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
        role: data?.role?.uuid
      });
      setSelectedData(data)
    }
  }, [data])

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
          Toast.success("Admin Created Successfully!")
        }
      });
    }
    if (isEdit ) {
      const editValues = {
        ...values,           // merge new form values
        role: { uuid: values.role },
        status: { uuid: values.status },
        uuid: data?.uuid,     
      };

      editAdminFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Admin Updated Successfully!")
        },
      });
    }
  };

  return (

    <div className="flex justify-center" >
      < Drawer
        size={720}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closable={false}
        extra={
          < CloseOutlined
            onClick={() => setDrawerOpen(false)}
            style={{ fontSize: 18, cursor: "pointer" }}
          />
        }
        title={
          mode === "view"
            ? "Admin Details"
            : mode === "edit"
              ? "Edit Admin"
              : "Create Admin"
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
          className="w-full px-4 max-w-lg md:max-w-2xl"
          validateTrigger="onSubmit"
          onFinish={onFinish}

        >
          <Form.Item label="Admin Name" name="name" rules={[{ required: true, message: "Admin Name is Required" }]}>
            <Input disabled={isView} />
          </Form.Item>

          <Form.Item
            label="Admin Email"
            name="email"
            rules={[{ required: true, message: "Admin Email is Required" }]}
          >
            <Input disabled={isView} />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Select
              showSearch
              options={roles}
            />
          </Form.Item>

          <Form.Item
            label="Staff"
            name="staff"
          >
            <Input disabled={isView} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is Required" }]}
          >
            <Select
              showSearch
              options={statuses}
            />
          </Form.Item>

          {!isView && (
            <div className="flex justify-end sm:mb-2 md:mb-3" >
              <Button
                type="default"
                disabled={isView}
                onClick={() => navigate(-1)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" disabled={isView} loading={isAdd? createAdminFunction.isPending : editAdminFunction.isPending} >
                {isAdd ? "Create" : "Save"}
              </Button>
            </div>
          )}
        </Form>
      </Drawer >

    </div >
  )
};


export default AdminForm;
