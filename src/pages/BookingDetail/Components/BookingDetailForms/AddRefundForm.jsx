import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";

const AddReundForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();

  const paymentMethod = Form.useWatch("paymentMethod", form);

  const onFinish = (values) => {
    console.log("Amend Booking Data:", {
      reservationId,
      ...values,
    });
    onClose();
    form.resetFields();
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Add Refund</span>
          <FormButtons onClick={() => form.submit()} />
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Booking Total"
            name="bookingTotal"
            className="flex-1"
          >
            <InputNumber
              className="!w-full"
              min={1}
              placeholder="Enter Base Price"
              suffix="MMK"
            />
          </Form.Item>

          <Form.Item
            label="Payment Method"
            name="paymentMethod"
            className="flex-1"
          >
            <Select
              placeholder="Select Payment Method"
              style={{ width: "100%" }}
              options={[
                { value: "Cash", label: "Cash" },
                { value: "Digital", label: "Digital" },
              ]}
            />
          </Form.Item>
        </div>

    
        {paymentMethod !== "Cash" && (
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Bank" name="bank">
              <Select
                placeholder="Select Bank"
                style={{ width: "100%" }}
                options={[
                  { value: "KBZ", label: "KBZ" },
                  { value: "AYA", label: "AYA" },
                  { value: "CB", label: "CB" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Bank A/C" name="bankA/C" className="flex-1">
              <Input className="w-full" placeholder="Enter Bank Account" />
            </Form.Item>
          </div>
        )}

        <Form.Item label="Refund Amount" name="refundAmount">
          <InputNumber
            min={1}
            placeholder="Enter Base Price"
            suffix="MMK"
            style={{ width: 240 }}
          />
        </Form.Item>

        <FormItem label="Comment" name="comment">
          <TextArea />
        </FormItem>

        <FormItem
          label={
            <span className="text-[15px] font-semibold">
              Upload Refund Form
            </span>
          }
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          >
            {imageUrl ? (
              <img
                draggable={false}
                src={imageUrl}
                alt="avatar"
                style={{ width: "100%" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </FormItem>
      </Form>
    </Drawer>
  );
};

export default AddReundForm;