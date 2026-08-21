import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Button,
  Alert,
  Tag,
} from "antd";
import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import PriceTag from "../../../../../component/PriceTag/PriceTag";

const AdjustmentDrawer = ({
  open,
  onClose,
  lineData,
  onConfirm,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [postingType, setPostingType] = React.useState("debit");
  const [validationErrors, setValidationErrors] = React.useState([]);

  const isVoided = !!lineData?.voidedAt;
  const isChildLine = !!lineData?.parentLineId;
  const isAdjustment = lineData?.transactionType?.code === "adjustment";
  const canAdjust = !isVoided && !isChildLine && !isAdjustment;

  const blockReason = isVoided
    ? "Cannot adjust a voided line"
    : isChildLine
    ? "Cannot adjust a child line"
    : isAdjustment
    ? "Cannot adjust an adjustment line"
    : null;

  useEffect(() => {
    if (open && lineData) {
      form.resetFields();
      const opposite = lineData.postingType === "debit" ? "credit" : "debit";
      setPostingType(opposite);
      setValidationErrors([]);
      form.setFieldsValue({
        postingType: opposite,
        amount: undefined,
        description: undefined,
        remark: undefined,
      });
    }
  }, [open, lineData, form]);

  const validateAdjustment = (values) => {
    const errors = [];

    if (values.postingType === "credit") {
      const max = lineData?.grandTotal || 0;
      if ((values.amount || 0) > max) {
        errors.push(
          `Credit amount (${(values.amount || 0).toLocaleString()}) exceeds original (${max.toLocaleString()})`
        );
      }
    }

    if (values.amount !== undefined && values.amount !== null) {
      if (values.amount <= 0) errors.push("Amount must be greater than 0");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (values) => {
    if (!lineData || !canAdjust || !validateAdjustment(values)) return;

    await onConfirm({
      uuid: lineData.uuid,
      postingType: values.postingType,
      amount: values.amount,
      quantity: 1,
      description: values.description,
      remark: values.remark,
    });
  };

  return (
    <Drawer
      title="Adjust Line"
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
      destroyOnClose
      closeIcon={<CloseOutlined />}
      className="adjustment-drawer"
      extra={
        <div className="flex justify-end gap-3">
          {/* <Button onClick={onClose}>Cancel</Button> */}
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
            disabled={!canAdjust || validationErrors.length > 0}
          >
            Update
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
              <PriceTag value={Number(lineData.grandTotal)} />
              <span>{dayjs(lineData.postedAt).format("DD-MM-YYYY")}</span>
            </div>
          </div>

          {/* Block Reason — shown immediately, no interaction required */}
          {blockReason && (
            <Alert
              message={blockReason}
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              className="rounded-lg"
            />
          )}

          {/* Adjustment Form */}
          <Form
            form={form}
            layout="vertical"
            disabled={!canAdjust}
            onFinish={handleSubmit}
            onValuesChange={(changed, all) => {
              if (changed.postingType !== undefined)
                setPostingType(changed.postingType);
              validateAdjustment(all);
            }}
          >
            {/* Type & Amount — Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              {/* Amount */}
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Required" },
                  { type: "number", min: 0.01, message: "Must be > 0" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(v) =>
                    v === undefined || v === null || v === ""
                      ? ""
                      : `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => (v ? v.replace(/[^\d.]/g, "") : "")}
                  suffix={lineData?.currency?.code || "MMK"}
                  placeholder="Enter amount"
                  controls={false}
                  min={0.01}
                />
              </Form.Item>

              {/* Posting Type */}
              <Form.Item
                name="postingType"
                label="Type"
                rules={[{ required: true, message: "Required" }]}
              >
                <Radio.Group
                  className="w-full"
                  optionType="button"
                >
                  <Radio.Button
                    value="debit"
                    style={{margin: 2}}
                  >
                    Debit
                  </Radio.Button>
                  <Radio.Button
                    value="credit"
                    style={{margin: 2}}
                  >
                    Credit
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            {/* Live Validation Errors — shown directly below the input */}
            {canAdjust && validationErrors.length > 0 && (
              <Alert
                message={validationErrors[0]}
                type="error"
                showIcon
                icon={<WarningOutlined />}
                className="rounded-lg -mt-2 mb-4"
              />
            )}

            {/* Description - Full Width */}
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="Reason for adjustment"
                maxLength={255}
              />
            </Form.Item>

            {/* Remark - Full Width */}
            <Form.Item name="remark" label="Remark">
              <Input.TextArea
                rows={2}
                placeholder="Optional notes"
                maxLength={500}
              />
            </Form.Item>
          </Form>
        </div>
      )}
    </Drawer>
  );
};

export default AdjustmentDrawer;
