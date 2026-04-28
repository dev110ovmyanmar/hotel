import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col,
  DatePicker,
  Button,
  TimePicker,
  InputNumber,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import FormItem from "antd/es/form/FormItem";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { truncate } from "lodash";
import {
  getFormattedDate,
  getFormattedDateTime,
} from "../../../../../../utils";

const onChange = (value) => {
  console.log("changed", value);
};

const ServiceAddOnForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  onSuccess,
  open,
  onClose,
  reservationId,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        serviceOrderDate: selectedData.serviceOrderDate
          ? dayjs(selectedData.serviceOrderDate)
          : null,
        serviceOrderTime: selectedData.serviceOrderTime
          ? dayjs(selectedData.serviceOrderTime)
          : null,
      });
    } else if (drawerOpen && mode === "add") {
      form.resetFields();
    }
  }, [selectedData, drawerOpen, form, mode]);

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      serviceOrderDate: getFormattedDate(values.serviceOrderDate, false),
      serviceOrderTime: getFormattedDateTime(values.serviceOrderTime, false),
    };

    console.log("Submitted Values:", formattedValues);

    const existingData = JSON.parse(localStorage.getItem("services")) || [];
    if (mode === "add") {
      localStorage.setItem(
        "services",
        JSON.stringify([
          ...existingData,
          { ...formattedValues, id: Date.now() },
        ]),
      );
    } else {
      const updated = existingData.map((item) =>
        item.id === selectedData.id
          ? { ...formattedValues, id: item.id }
          : item,
      );
      localStorage.setItem("services", JSON.stringify(updated));
    }

    setDrawerOpen(false);
    onSuccess();
  };

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    onChange,
    style: { width: 150 },
  };

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={650}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Service Add On Details"
                : mode === "edit"
                  ? "Edit Service Add On"
                  : "Create Service Add On"}
            </span>

            {isView ? (
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <FormButtons onClick={() => form.submit()} mode={mode} />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isView}
          initialValues={{
            quantity: 1,
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Service Order Date" name="serviceOrderDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Service Order Time"
              name="serviceOrderTime"
              className="flex-1"
            >
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <FormItem label="Room No" name="roomNo" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Select Service"
              name="selectService"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Service"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Select Package" name="selectPackage">
              <Select
                placeholder="Select Package"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true }]}
            >
              <InputNumber
                {...sharedProps}
                placeholder="Outlined"
                readOnly={isView}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Unit Price"
              name="unitPrice"
              rules={[{ required: true }]}
            >
              <InputNumber
                className="!w-full"
                min={0}
                placeholder="Enter Unit Price"
                suffix="MMK"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Sub Total"
            name="subTotal"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Sub Total"
              suffix="MMK"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Select Tax" name="selectTax">
              <Select
                placeholder="Select Tax"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Tax Amount" name="taxAmount">
              <InputNumber
                className="!w-full"
                min={0}
                placeholder="Enter Total tax"
                suffix="MMK"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Total Amount"
            name="totalAmount"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Total Amount"
              suffix="MMK"
            />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select
              placeholder="Select Status"
              style={{ width: "100%" }}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default ServiceAddOnForm;
