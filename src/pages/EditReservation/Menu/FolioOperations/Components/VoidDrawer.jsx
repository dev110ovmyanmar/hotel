import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Alert,
  Tag,
} from "antd";
import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PriceTag from "../../../../../component/PriceTag/PriceTag";

const VoidDrawer = ({
  open,
  onClose,
  lineData,
  onConfirm,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const isVoided = !!lineData?.voidedAt;
  const isChildLine = !!lineData?.parentLineId;
  const isAdjustment = lineData?.transactionType?.code === "adjustment";
  const canVoid = !isVoided && !isChildLine && !isAdjustment;

  const blockReason = isVoided
    ? "Line is already voided"
    : isChildLine
    ? "Cannot void a child line"
    : isAdjustment
    ? "Cannot void an adjustment line"
    : null;

  useEffect(() => {
    if (open && lineData) {
      form.resetFields();
      form.setFieldsValue({
        remark: undefined,
      });
    }
  }, [open, lineData, form]);

  const handleSubmit = async (values) => {
    if (!lineData || !canVoid) return;

    await onConfirm({
      uuid: lineData.uuid,
      remark: values.remark,
    });
  };

  return (
    <Drawer
      title="Void Line"
      placement="right"
      size={550}
      open={open}
      onClose={onClose}
      destroyOnClose
      closeIcon={<CloseOutlined />}
      className="void-drawer"
      extra={
        <div className="flex justify-end gap-3">
          <Button
            type="primary"
            danger
            loading={loading}
            onClick={() => form.submit()}
            disabled={!canVoid}
          >
            Void
          </Button>
        </div>
      }
    >
      {lineData && (
        <div className="space-y-5">
          {/* Original Line Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {lineData.itemNameSnapshot}
              </span>
              <Tag color={lineData.postingType === "debit" ? "red" : "green"}>
                {lineData.postingType.toUpperCase()}
              </Tag>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              {/* <PriceTag value={Number(lineData.grandTotal)} /> */}
              <div className="flex items-center gap-1">
                <PriceTag value={Number(lineData.grandTotal)} />
                <span>(MMK)</span>
              </div>
              <span>{dayjs(lineData.postedAt).format("DD MMM YYYY")}</span>
            </div>
          </div>

          {/* Block Reason */}
          {blockReason && (
            <Alert
              message={blockReason}
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              className="rounded-lg"
            />
          )}

          {/* Void Form */}
          <Form
            form={form}
            layout="vertical"
            disabled={!canVoid}
            onFinish={handleSubmit}
          >
            {/* Remark - Full Width */}
            <Form.Item
              name="remark"
              label="Remark"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Reason for void"
                maxLength={500}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Drawer>
  );
};

export default VoidDrawer;
