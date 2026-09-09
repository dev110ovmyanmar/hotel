import React, { useState, useMemo, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Row,
  Col,
  Select,
  Radio,
  Typography,
  Card,
  Divider,
  Segmented,
  Button
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { createFolioPaymentRefund } from "../../../../api/reservationSectionApi";
import { reservationMeta } from "../../../../api/reservationSectionApi";
import { numberValidator } from "../../../../variables/constants";
import { useApiQuery } from "../../../../hooks/useApiQuery";
import Loader from "../../../../component/Loader/Loader";
import PriceInput from "../../../../component/PriceInput/PriceInput";

const { Title, Text } = Typography;

// Color Configuration Map for Segmented Tabs
const CHANNEL_COLORS = {
  all: { bg: "#f1f5f9", text: "#475569" },      // Slate
  cash: { bg: "#dcfce7", text: "#15803d" },     // Emerald Green
  card: { bg: "#dbeafe", text: "#1d4ed8" },     // Blue
  wallet: { bg: "#fae8ff", text: "#a21caf" },   // Fuchsia/Purple
  bank: { bg: "#fef9c3", text: "#a16207" },     // Yellow/Gold
  ota: { bg: "#ffedd5", text: "#c2410c" },      // Orange
};

const AddRefundForm = ({
  open,
  onClose,
  bookingDetails,
  providerTypes,
  reservationUuid
}) => {
  const [form] = Form.useForm();

  const { data: reservationMetaData, isLoading: reservationMetaLoading } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
    params: {
      reservation: { uuid: reservationUuid }
    },
    options: {
      enabled: !!open,
    },
  });

  const guests = reservationMetaData?.main_guests || [];
  const paymentMethodsData = reservationMetaData?.payment_methods || [];
  const folios = reservationMetaData?.folios || [];
  const depositStatus = bookingDetails?.reservation?.depositStatus;

  const [submitting, setSubmitting] = useState(false);

  // Track selected category filter by UUID state
  const [selectedProviderUuid, setSelectedProviderUuid] = useState("all");

  const selectedMethod = Form.useWatch("paymentMethod", form);

  // Clear selections when form closes
  useEffect(() => {
    if (!open) {
      setSelectedProviderUuid("all");
    }
  }, [open]);

  // --- Transform providerTypes into Ant Design Segmented options ---
  const segmentedOptions = useMemo(() => {
    const baseOptions = Array.isArray(providerTypes)
      ? providerTypes.map((type) => {
        const normalizedName = type.name?.toLowerCase() || "";
        const colorConfig = CHANNEL_COLORS[normalizedName];

        return {
          label: (
            <span style={{ color: colorConfig ? colorConfig.text : "inherit", fontWeight: 500 }}>
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
        label: <span style={{ color: CHANNEL_COLORS.all.text, fontWeight: 500 }}>All Types</span>,
        value: "all",
        style: { backgroundColor: CHANNEL_COLORS.all.bg }
      },
      ...baseOptions
    ];
  }, [providerTypes]);

  // --- Transform folios array into Select dropdown options ---
  const folioOptions = useMemo(() => {
    const foliosArray = Array.isArray(folios) ? folios : [];
    return foliosArray.map((folio) => ({
      label: folio.folioNo || "Unknown",
      value: folio.uuid,
    }));
  }, [folios]);

  // --- Transform guests array into Select dropdown options ---
  const guestOptions = useMemo(() => {
    const guestsArray = Array.isArray(guests) ? guests : [];
    return guestsArray.map((guest) => {
      const titlePrefix = guest.title ? `${guest.title} ` : "";
      const phoneSuffix = guest.phone ? ` (${guest.phone})` : "";

      return {
        label: `${titlePrefix}${guest.name}${phoneSuffix}`,
        value: guest.uuid,
      };
    });
  }, [guests]);

  const methodsArray = Array.isArray(paymentMethodsData) ? paymentMethodsData : [];

  const filteredMethods = useMemo(() => {
    return methodsArray.filter((method) => {
      if (selectedProviderUuid === "all") return true;
      return method.type?.uuid === selectedProviderUuid;
    });
  }, [methodsArray, selectedProviderUuid]);

  const { mutate: createFolioRefund, isPending } = useApiMutation({
    mutationFn: createFolioPaymentRefund,
    invalidateKeys: [["reservation-details"]],
    options: {
      onSuccess: () => {
        setSubmitting(false);
        onClose();
        form.resetFields();
        setSelectedProviderUuid("all");
      },
      onError: () => {
        setSubmitting(false);
      },
    },
  });

  const onFinish = (values) => {
    setSubmitting(true);
    const payload = {
      reservation: { uuid: bookingDetails?.reservation?.uuid },
      guest: { uuid: values.guest },
      folio: { uuid: values.folio },
      paymentMethod: { uuid: values.paymentMethod },
      amount: Number(values.amount),
    };
    createFolioRefund(payload);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      afterOpenChange={(open) => {
        if (open) {
          form.resetFields();
        }
      }}
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Add Refund</span>
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
            loading={isPending}
            disabled={submitting || depositStatus === false}
          >
            Create
          </Button>
        </div>
      }
    >
      {reservationMetaLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      ) : depositStatus === false ? (
        <div className="flex justify-center items-center h-full">
          <Text
            className="border-2 border-red-500 px-6 py-2 rounded-md !text-red-500"
          >
            No Deposit Found
          </Text>
        </div>
      ) : (
        < Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          {/* --- METHOD TITLE LABEL --- */}
          <div className="flex items-center !mb-3">
            <Title level={5} className="!mb-0">Select Refund Method</Title>
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

                // Direct synchronization check without rendering lifecycle delays
                const liveFiltered = methodsArray.filter(m => value === "all" || m.type?.uuid === value);
                const currentSelection = form.getFieldValue("paymentMethod");

                if (!liveFiltered.some(m => m.uuid === currentSelection)) {
                  form.setFieldsValue({ paymentMethod: undefined });
                }
              }}
              className="p-1 rounded-lg bg-slate-50/50 border border-slate-100"
            />
          </div>

          {/* --- UNIFIED PAYMENT METHODS GRID --- */}
          {filteredMethods.length > 0 ? (
            <div className="mb-6">
              <Form.Item name="paymentMethod" rules={[{ required: true, message: "Please select a refund method" }]}>
                <Radio.Group className="w-full">
                  <Row gutter={[12, 12]}>
                    {filteredMethods.map((method) => (
                      <Col span={6} key={method.uuid}>
                        <Card
                          hoverable
                          onClick={() => {
                            form.setFieldsValue({ paymentMethod: method.uuid });
                            form.validateFields(["paymentMethod"]);
                          }}
                          className={`text-center rounded-lg relative transition-all duration-200 cursor-pointer ${selectedMethod === method.uuid
                            ? "border-2 border-blue-500 shadow-sm bg-blue-50/10"
                            : "border border-slate-200 hover:border-slate-300"
                            }`}
                          bodyStyle={{ padding: "12px 6px" }}
                        >
                          <div className="flex justify-center items-center w-full h-8 mb-2">
                            <img
                              src={method.file}
                              alt={method.name}
                              className="h-7 w-auto object-contain rounded"
                            />
                          </div>
                          <Text strong className="text-[11px] block truncate text-slate-700">
                            {method.name}
                          </Text>
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
              No refund methods configuration available for this type.
            </div>
          )}

          <Divider className="my-5" />

          {/* --- FOLIO & GUEST ROW --- */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className=" font-medium">Folio No</span>}
                name="folio"
                rules={[{ required: true, message: "Required" }]}
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
                label={<span className=" font-medium">Guest</span>}
                name="guest"
              >
                <Select
                  showSearch
                  placeholder="Select a guest"
                  options={guestOptions}
                  className="w-full rounded"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* --- AMOUNT ROW --- */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className=" font-medium">Amount</span>}
                name="amount"
                getValueProps={(value) => ({ value: value !== null && value !== undefined ? String(value) : "" })}
                rules={[
                  { required: true, message: "Amount required" },
                  { validator: numberValidator }
                ]}
              >
                <PriceInput
                  min={0}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Drawer >
  );
};

export default AddRefundForm;