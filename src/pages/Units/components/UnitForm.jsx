import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";

const UnitForm = ({ initialValues, mode, onSubmit, open, onClose, loading, switchToEdit, statusOptions }) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          shortName: initialValues.shortName,
          // Handle both flat and nested responses from API
          statusUuid: initialValues.status?.uuid || initialValues.statusUuid,
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, open, form]);

  // Use watch to get the value in real-time for the read-only display
  const currentStatusUuid = Form.useWatch("statusUuid", form);
  const getStatusLabel = (val) => statusOptions?.find((s) => s.value === val)?.label || "-";

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <span>{mode === "view" ? "View Category" : mode === "edit" ? "Edit Unit" : "Add Unit"}</span>
          {isView ? (
            <Button type="primary" onClick={switchToEdit}>Edit</Button>
          ) : (
            <FormButtons onClick={() => form.submit()} mode={mode} />
          )}
        </div>
      }
      width={500} // size={500} is not a valid AntD prop, use width
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {loading ? <Loader /> : (
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            label="Unit Name"
            name="name"
            rules={[{ required: true, message: "Please input unit name!" }]}
          >
            <Input placeholder="e.g. Guest Amenities" readOnly={isView} />
          </Form.Item>

        <Form.Item
            label="Short Name"
            name="shortName"
            rules={[{ required: true, message: "Please input unit short name!" }]}
          >
            <Input placeholder="e.g. Guest Amenities" readOnly={isView} />
          </Form.Item>

          <Form.Item
            name="statusUuid"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            {isView ? (
              <div className="border border-gray-200 rounded-lg px-4 h-11 flex items-center bg-gray-50 text-gray-600">
                {getStatusLabel(currentStatusUuid)}
              </div>
            ) : (
              <Select 
                options={statusOptions || []} 
                className="h-11" 
                placeholder="Select Status" 
              />
            )}
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UnitForm;