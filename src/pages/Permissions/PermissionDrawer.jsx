import React, { useEffect, useMemo } from "react";
import { Button, Form, Input, Row, Col, Spin, AutoComplete } from "antd";

const { TextArea } = Input;

const PermissionDrawer = ({ initialValues, mode, onSubmit, onCancel, permissions = [], loading = false }) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  useEffect(() => {
  if (initialValues) {
    form.setFieldsValue(initialValues);
  } else {
    form.resetFields();
  }
}, [initialValues, form]);

  const handleSubmit = (values) => {
    if (onSubmit) {
      if (isAdd) {
        const code = values.code || "";
        const extractedModule = code.includes('.') ? code.split(".")[0] : values.module || "privacy policy";
        onSubmit({ ...values, module: extractedModule });
      } else {
        onSubmit(values);
      }
    }
  };

  // const handleModuleChange = (value) => {
  //   const currentCode = form.getFieldValue("code") || "";
  //   const action = currentCode.split(".")[1] || "";
  //   if (action) {
  //     form.setFieldsValue({ code: `${value}.${action}` });
  //   }
  // };


  const moduleOptions = useMemo(() => {
    const modules = [...new Set(permissions.map(p => p.module).filter(Boolean))];
    return modules.map(m => ({ value: m }));
  }, [permissions]);

  const validateUniqueName = (_, value) => {
    if (!value) return Promise.resolve();
    const duplicate = permissions.find(
      (p) =>
        p.name.toLowerCase() === value.trim().toLowerCase() &&
        (!isEdit || p.id !== initialValues?.id)
    );
    return duplicate
      ? Promise.reject(new Error("Permission name already exists"))
      : Promise.resolve();
  };

  const validateUniqueCode = (_, value) => {
    if (!value) return Promise.resolve();
    const duplicate = permissions.find(
      (p) =>
        p.code.toLowerCase() === value.trim().toLowerCase() &&
        (!isEdit || p.id !== initialValues?.id)
    );
    return duplicate
      ? Promise.reject(new Error("Permission code already exists"))
      : Promise.resolve();
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin />
        </div>
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={handleSubmit}
          >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input permission name!" },
            { validator: validateUniqueName }
          ]}
        >
          <Input readOnly={isView} style={{ cursor: isView ? 'default' : 'text' }} placeholder="room view" />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[
            { required: true, message: "Please input permission code!" },
            { validator: validateUniqueCode }
          ]}
        >
          <Input readOnly={isView} style={{ cursor: isView ? 'default' : 'text' }} placeholder="room.view"/>
        </Form.Item>

        {isEdit && (
          <Form.Item 
            label="Module" 
            name="module"
            rules={[{ required: true, message: "Please input module!" }]}
          >
            <AutoComplete
              options={moduleOptions}
              placeholder="Enter or select module"
              // onChange={handleModuleChange}
              // filterOption={(inputValue, option) =>
              //   option.value.toLowerCase().includes(inputValue.toLowerCase())
              // }
            />
          </Form.Item>
        )}

        <Form.Item label="Description" name="description">
          <TextArea rows={4} readOnly={isView} style={{ cursor: isView ? 'default' : 'text' }} placeholder="Enter description for related permission"/>
        </Form.Item>
          </Form>

          {!isView && (
            <Row gutter={16}>
              <Col span={12}>
                <Button block onClick={onCancel}>Cancel</Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block onClick={() => form.submit()}>
                  {isEdit ? "Update" : "Save"}
                </Button>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default PermissionDrawer;