import React, { useState, useMemo, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  Select,
  Radio,
  Typography,
  Card,
  Divider,
  Segmented,
  InputNumber,
} from "antd";
import { createFolioPaymentDeposit } from "../../../../api/reservationSectionApi";
import { reservationMeta } from "../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { useApiQuery } from "../../../../hooks/useApiQuery";
import {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";
import { numberValidator } from "../../../../variables/constants";
import Loader from "../../../../component/Loader/Loader";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Color Configuration Map for Segmented Tabs
const CHANNEL_COLORS = {
  all: { bg: "#f1f5f9", text: "#727e8f" },
  cash: { bg: "#dcfce7", text: "#15803d" },
  card: { bg: "#dbeafe", text: "#1d4ed8" },
  wallet: { bg: "#fae8ff", text: "#a21caf" },
  bank: { bg: "#fef9c3", text: "#a16207" },
  ota: { bg: "#ffedd5", text: "#c2410c" },
};

const AddDepoistForm = ({
  open,
  onClose,
  bookingDetails,
  paymentCompletedStatus,
  providerTypes,
  reservationUuid,
}) => {
  const [form] = Form.useForm();

  const { data: reservationMetaData, isLoading: reservationMetaDataLoading } =
    useApiQuery({
      fetchQueryName: "reservation-meta",
      fetchQueryFunction: reservationMeta,
      params: {
        reservation: { uuid: reservationUuid },
      },
      options: {
        enabled: !!open && !!reservationUuid,
      },
    });

  const guests = reservationMetaData?.main_guests || [];
  const paymentMethodsData = reservationMetaData?.payment_methods || [];
  const folios = reservationMetaData?.folios || [];

  // Track selected category filter by UUID state
  const [selectedProviderUuid, setSelectedProviderUuid] = useState("all");
  const selectedMethod = Form.useWatch("paymentMethod", form);

  // --- AUTOMATICALLY FILL AND SELECT COMPLETED STATUS IN UI ---
  useEffect(() => {
    if (!open) return;
    if (reservationMetaDataLoading) return;

    const defaultValues = {};

    if (folios.length > 0) {
      defaultValues.folio = folios[0].uuid;
    }

    const cashsMethod = paymentMethodsData.find(
      (method) => method.name?.trim().toLowerCase() === "cashs",
    );

    if (cashsMethod) {
      defaultValues.paymentMethod = cashsMethod.uuid;
    }

    if (paymentCompletedStatus?.uuid) {
      defaultValues.paymentStatus = paymentCompletedStatus.uuid;
    }
    setSelectedProviderUuid("all");

    if (Object.keys(defaultValues).length > 0) {
      form.setFieldsValue(defaultValues);
    }
  }, [
    open,
    reservationMetaDataLoading,
    paymentMethodsData,
    folios,
    paymentCompletedStatus,
    form,
  ]);

  // --- Transform providerTypes into Ant Design Segmented options ---
  const segmentedOptions = useMemo(() => {
    const baseOptions = Array.isArray(providerTypes)
      ? providerTypes.map((type) => {
          const normalizedName = type.name?.toLowerCase() || "";
          const colorConfig = CHANNEL_COLORS[normalizedName];

          return {
            label: (
              <span
                style={{
                  color: colorConfig ? colorConfig.text : "inherit",
                  fontWeight: 500,
                }}
              >
                {type.name}
              </span>
            ),
            value: type.uuid,
            style: colorConfig ? { backgroundColor: colorConfig.bg } : {},
          };
        })
      : [];

    return [
      {
        label: (
          <span style={{ color: CHANNEL_COLORS.all.text, fontWeight: 500 }}>
            All Types
          </span>
        ),

        value: "all",
        style: { backgroundColor: CHANNEL_COLORS.all.bg },
      },

      ...baseOptions,
    ];
  }, [providerTypes]);

  // --- Transform folios array into Select dropdown options ---
  const folioOptions = useMemo(() => {
    if (!Array.isArray(folios)) {
      return [];
    }

    return folios.map((folio) => ({
      label: folio.folioNo || "Unknown",

      value: folio.uuid,
    }));
  }, [folios]);

  // --- Transform guests array into Select dropdown options ---
  const guestOptions = useMemo(() => {
    if (!Array.isArray(guests)) {
      return [];
    }

    return guests.map((guest) => {
      const titlePrefix = guest.title ? `${guest.title} ` : "";

      const phoneSuffix = guest.phone ? ` (${guest.phone})` : "";

      return {
        label: `${titlePrefix}${guest.name}${phoneSuffix}`,
        value: guest.uuid,
      };
    });
  }, [guests]);

  const { mutate: createFolioPayment, isPending } = useApiMutation({
    mutationFn: createFolioPaymentDeposit,
    invalidateKeys: [["reservation-details"]],

    options: {
      onSuccess: () => {
        form.resetFields();
        setSelectedProviderUuid("all");
        onClose();
      },
    },
  });

  const onFinish = (values) => {
    const payload = {
      reservation: { uuid: bookingDetails?.reservation?.uuid },
      guest: { uuid: values.guest },
      folio: { uuid: values.folio },
      paymentMethod: { uuid: values.paymentMethod },
      paymentStatus: { uuid: values.paymentStatus },
      amount: values.amount,
      transactionNo: values.transactionNo,
      externalReference: values.externalReference,
      remarks: values.remark,
      paymentDate: values.paymentDate
        ? values.paymentDate.format("YYYY-MM-DD HH:mm:ss")
        : undefined,
    };

    createFolioPayment(payload);
  };

  const methodsArray = Array.isArray(paymentMethodsData)
    ? paymentMethodsData
    : [];

  const filteredMethods = methodsArray.filter((method) => {
    if (selectedProviderUuid === "all") return true;

    return method.type?.uuid === selectedProviderUuid;
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnHidden
      title={
        <div className="flex justify-between items-center">
          <span>Add Deposit</span>

          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
            loading={isPending}
          >
            Create
          </Button>
        </div>
      }
    >
      {reservationMetaDataLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            paymentType: "full",
          }}
        >
          <div className="flex items-center !mb-3">
            <Title level={5} className="!mb-0 text-slate-700">
              Select Payment Method
            </Title>

            <span className="text-red-500 ml-1 mt-1 font-bold">*</span>
          </div>

          {/* --- PROVIDER TYPES FILTER TABS --- */}
          <div className="mb-5">
            <Segmented
              block
              options={segmentedOptions}
              value={selectedProviderUuid}
              onChange={(value) => {
                setSelectedProviderUuid(value);

                const currentSelection = form.getFieldValue("paymentMethod");

                if (value === "all") {
                  return;
                }

                // Check whether the currently
                // selected payment method belongs
                // to the newly selected provider.
                const choiceStillVisible = methodsArray.some(
                  (method) =>
                    method.uuid === currentSelection &&
                    method.type?.uuid === value,
                );

                // If not visible anymore,
                // clear the payment method.
                if (!choiceStillVisible) {
                  form.setFieldValue("paymentMethod", undefined);
                }
              }}
              className="p-1 rounded-lg bg-slate-50/50 border border-slate-100"
            />
          </div>

          {/* --- UNIFIED PAYMENT METHODS GRID --- */}
          {filteredMethods.length > 0 ? (
            <div className="mb-6">
              <Form.Item
                name="paymentMethod"
                rules={[
                  {
                    required: true,
                    message: "Please select a payment method",
                  },
                ]}
              >
                <Radio.Group className="w-full">
                  <Row gutter={[12, 12]}>
                    {filteredMethods.map((method) => (
                      <Col span={6} key={method.uuid}>
                        <Card
                          hoverable
                          onClick={() => {
                            form.setFieldValue("paymentMethod", method.uuid);

                            form.validateFields(["paymentMethod"]);
                          }}
                          className={`
                              text-center
                              rounded-lg
                              relative
                              transition-all
                              duration-200
                              cursor-pointer

                              ${
                                selectedMethod === method.uuid
                                  ? "!border-2 !border-blue-500 shadow-sm"
                                  : "border border-slate-200 hover:border-slate-300"
                              }
                            `}
                          bodyStyle={{
                            padding: "12px 6px",
                          }}
                        >
                          {/* PAYMENT IMAGE */}

                          <div className="flex justify-center items-center w-full h-8 mb-2">
                            <img
                              src={method.file}
                              alt={method.name}
                              className="h-7 w-auto object-contain rounded"
                            />
                          </div>

                          {/* PAYMENT NAME */}

                          <Text
                            strong
                            className="text-[11px] block truncate text-slate-700"
                          >
                            {method.name}
                          </Text>

                          {/* RADIO */}

                          <Radio
                            value={method.uuid}
                            className="absolute top-1 right-1 m-0 raw-radio-adjust"
                            checked={selectedMethod === method.uuid}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </Form.Item>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg mb-6 border border-dashed border-slate-200">
              No payment methods configuration available for this type.
            </div>
          )}

          <Divider className="my-5" />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">Folio No</span>}
                name="folio"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Select
                  placeholder="Select folio"
                  className="w-full rounded"
                  options={folioOptions}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">Guest</span>}
                name="guest"
              >
                <Select
                  showSearch={{
                    filterOption: (input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase()),
                  }}
                  placeholder="Select a guest"
                  options={guestOptions}
                  className="w-full rounded"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">Status</span>}
                name="paymentStatus"
                rules={[
                  {
                    required: true,
                    message: "Required",
                  },
                ]}
              >
                <Select placeholder="Select status" className="w-full rounded">
                  {paymentCompletedStatus?.uuid && (
                    <Option value={paymentCompletedStatus.uuid}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />

                        <span className="font-medium">
                          {paymentCompletedStatus.name}
                        </span>
                      </div>
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">Amount</span>}
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Amount required",
                  },
                  {
                    validator: numberValidator,
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{
                    width: "100%",
                  }}
                  suffix="MMK"
                  placeholder="0.00"
                  formatter={priceFormatter}
                  parser={priceParser}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">Payment Date</span>}
                name="paymentDate"
              >
                <DatePicker
                  className="w-full rounded"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">Transaction No</span>}
                name="transactionNo"
              >
                <Input
                  placeholder="Enter Transaction Number"
                  className="rounded w-full"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="font-medium">External Reference</span>}
                name="externalReference"
              >
                <Input
                  placeholder="Enter External Reference"
                  className="rounded w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="font-medium">Remark</span>}
            name="remark"
          >
            <TextArea
              rows={3}
              placeholder="Add operational adjustments or audit notes here..."
              className="rounded w-full"
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default AddDepoistForm;
