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
import PriceInput from "../../../../../component/PriceInput/PriceInput";

const RebateDrawer = ({
  open,
  onClose,
  lineData,
  onConfirm,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [postingType, setPostingType] = React.useState("debit");
  const [validationErrors, setValidationErrors] = React.useState([]);
  const [rebateType, setRebateType] = React.useState("full");

  const isVoided = !!lineData?.voidedAt;
  const isChildLine = !!lineData?.parentLineId;
  const isAdjustment = lineData?.transactionType?.code === "adjustment";
  const canAdjust = !isVoided && !isChildLine && !isAdjustment;

  const blockReason = isVoided
    ? "Cannot rebate a voided line"
    : isChildLine
      ? "Cannot rebate a child line"
      : isAdjustment
        ? "Cannot rebate an adjustment line"
        : null;

  useEffect(() => {
    if (open && lineData) {
      form.resetFields();
      const opposite = lineData.postingType === "debit" ? "credit" : "debit";
      setPostingType(opposite);
      setValidationErrors([]);
      setRebateType("full");
      form.setFieldsValue({
        postingType: opposite,
        rebateType: "full",
        amount: undefined,
        description: undefined,
        remark: undefined,
      });
    }
  }, [open, lineData, form]);

  const validateAdjustment = (values) => {
    const errors = [];

    // Only validate amount for partial rebate
    if (values.rebateType === "partial") {
      if (values.amount === undefined || values.amount === null) {
        errors.push("Amount is required for partial rebate");
      } else if (values.amount <= 0) {
        errors.push("Amount must be greater than 0");
      } else {
        const max = lineData?.grandTotal || 0;
        if (values.amount > max) {
          errors.push(
            `Amount (${values.amount.toLocaleString()}) exceeds original (${max.toLocaleString()})`,
          );
        }
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (values) => {
    if (!lineData || !canAdjust || !validateAdjustment(values)) return;

    const payload = {
      uuid: lineData.uuid,
      description: values.description,
      remark: values.remark,
    };

    if (values.rebateType === "partial") {
      payload.amount = values.amount;
    }

    await onConfirm(payload);
  };

  return (
    <Drawer
      title="Rebate Line"
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
      destroyOnClose
      closeIcon={<CloseOutlined />}
      className="rebate-drawer"
      extra={
        <div className="flex justify-end gap-3">
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
              {/* <PriceTag value={Number(lineData.grandTotal)} /> */}
              <div className="flex items-center gap-1">
                <PriceTag value={Number(lineData.grandTotal)} />
                <span>(MMK)</span>
              </div>
              <span>{dayjs(lineData.postedAt).format("DD MMM YYYY")}</span>
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
              if (changed.rebateType !== undefined)
                setRebateType(changed.rebateType);
              validateAdjustment(all);
            }}
          >
            {/* Rebate Type */}
            <Form.Item
              name="rebateType"
              label="Rebate Type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Radio.Group className="w-full" optionType="button">
                <Radio.Button value="full" style={{ margin: 2 }}>
                  Full Rebate
                </Radio.Button>
                <Radio.Button value="partial" style={{ margin: 2 }}>
                  Partial Rebate
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {/* Amount - Only shown for partial rebate */}
            {rebateType === "partial" && (
              <Form.Item
                name="amount"
                label="Amount"
                rules={[
                  { required: true, message: "Required" },
                  ]}
              >
                <PriceInput
                min={1}
                    placeholder="Enter Amount"
                />
              </Form.Item>
            )}

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
            >
              <Input.TextArea
                rows={1}
                placeholder="Description for rebate"
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

export default RebateDrawer;
