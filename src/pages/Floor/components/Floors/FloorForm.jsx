import React, { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import { createFloor, floorDetail } from "../../../../api/floorApi";
import useApiQuery from "../../../../hooks/useApiQuery";

const Floorform = ({ initialValues, selectedData, mode, onSuccess }) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { mutate, isPending } = useApiMutation({
    mutationFn: createFloor,
    options: {
      onSuccess: () => {
        Toast.success(
          isEdit ? "Updated successfully!" : "Created successfully!",
        );

        form.resetFields();
        onSuccess?.();
      },
      onError: (err) => Toast.error(err.message || "Failed!"),
    },
  });

  const handleSubmit = (values) => {
    const payload = {
      ...values,
    };
    if (isEdit && initialValues?.uuid) {
      payload.uuid = initialValues.uuid;
    }

    mutate(payload);
  };

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "floorDetails",
    fetchQueryFunction: floorDetail,
    params: { uuid: initialValues?.uuid },
    options: {
      enabled: (isEdit || isView) && !!initialValues?.uuid,
    },
  });

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: "100%" }}
      disabled={isView}
      onFinish={handleSubmit}
    >
      <Form.Item label="Floor Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Floor No" name="floorNo">
        <Input />
      </Form.Item>
      <Form.Item label="Descriptiom" name="description">
        <Input />
      </Form.Item>
      <Form.Item>
        <div className="flex justify-between gap-4">
          <Button type="default" onClick={handleCancel} block>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" block loading={isPending}>
            save
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default Floorform;
