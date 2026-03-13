import React, { useEffect, useMemo } from "react";
import { Button, Form, Input, AutoComplete, Drawer } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";

const { TextArea } = Input;

const PermissionForm = ({
  initialValues,
  mode,
  onSubmit,
  open,
  onClose,
  onCancel,
  permissions = [],
  loading = false,
  switchToEdit,
  DrawerTitle,
}) => {
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
        const extractedModule = code.includes(".")
          ? code.split(".")[0]
          : values.module || "privacy policy";
        onSubmit({ ...values, module: extractedModule });
      } else {
        onSubmit(values);
      }
    }
  };

  const moduleOptions = useMemo(() => {
    const modules = [
      ...new Set(permissions.map((p) => p.module).filter(Boolean)),
    ];
    return modules.map((m) => ({ value: m }));
  }, [permissions]);

  const validateUniqueName = (_, value) => {
    if (!value) return Promise.resolve();
    const duplicate = permissions.find(
      (p) =>
        p.name.toLowerCase() === value.trim().toLowerCase() &&
        (!isEdit || p.id !== initialValues?.id),
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
        (!isEdit || p.id !== initialValues?.id),
    );
    return duplicate
      ? Promise.reject(new Error("Permission code already exists"))
      : Promise.resolve();
  };

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
              <FormButtons onClick={() => form.submit()} mode={mode} />
            )}
          </div>
        }
        size={500}
        onClose={onClose}
        open={open}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
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
                  { validator: validateUniqueName },
                ]}
              >
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="room view"
                />
              </Form.Item>

              <Form.Item
                label="Code"
                name="code"
                rules={[
                  { required: true, message: "Please input permission code!" },
                  { validator: validateUniqueCode },
                ]}
              >
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="room.view"
                />
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
                  />
                </Form.Item>
              )}

              <Form.Item label="Description" name="description">
                <TextArea
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  // placeholder="Enter description for related permission"
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>
    </>
  );
};

export default PermissionForm;
