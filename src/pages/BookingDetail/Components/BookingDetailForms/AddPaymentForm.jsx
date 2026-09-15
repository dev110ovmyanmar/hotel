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
    Upload,
    Divider,
    Segmented,
    Alert // Add this import
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { PlusOutlined, AlertOutlined } from "@ant-design/icons";
import { createFolioAddPayment } from "../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { reservationMeta } from "../../../../api/reservationSectionApi";
import Toast from "../../../../component/Toast/Toast";
import { useApiQuery } from "../../../../hooks/useApiQuery";
import { borderDarkMode, darkModeStyle, textColorDarkMode, textWhiteInDarkStyle } from "../../../../utils";
import Loader from "../../../../component/Loader/Loader";
import PriceInput from "../../../../component/PriceInput/PriceInput";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Color Configuration Map for Segmented Tabs
const CHANNEL_COLORS = {
    all: { bg: "#f1f5f9", text: "#475569" },      // Slate
    cash: { bg: "#dcfce7", text: "#15803d" },     // Emerald Green
    card: { bg: "#dbeafe", text: "#1d4ed8" },     // Blue
    wallet: { bg: "#fae8ff", text: "#a21caf" },   // Fuchsia/Purple
    bank: { bg: "#fef9c3", text: "#a16207" },     // Yellow/Gold
    ota: { bg: "#ffedd5", text: "#c2410c" },      // Orange
};

const AddPaymentForm = ({
    open,
    onClose,
    bookingDetails,
    paymentCompletedStatus,
    providerTypes,
    reservationUuid,
}) => {
    const [form] = Form.useForm();

    const { data: reservationMetaData, isFetching: reservationMetaFetching } = useApiQuery({
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
    const admins = reservationMetaData?.admins || [];
    const folios = reservationMetaData?.folios || [];
    const paymentMethodsData = reservationMetaData?.payment_methods || [];

    // Track selected category filter by UUID state
    const [selectedProviderUuid, setSelectedProviderUuid] = useState("all");
    const [selectedFolioBalance, setSelectedFolioBalance] = useState(null);
    const [isBalanceZero, setIsBalanceZero] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const selectedMethod = Form.useWatch("paymentMethod", form);
    const selectedFolioUuid = Form.useWatch("folio", form);

    const cashsMethod = paymentMethodsData.find(
        (method) => method.name?.trim().toLowerCase() === "cashs",
    );

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
            // Store balanceAmount for reference
            balanceAmount: folio.balanceAmount,
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

    const adminOptions = useMemo(() => {
        const adminsArray = Array.isArray(admins) ? admins : [];
            return adminsArray.map((admin) => {
            return {
                label: `${admin.name}`,
                value: admin.uuid,
            };
        });
    })

    // --- Check balanceAmount when folio selection changes ---
    useEffect(() => {
        if (selectedFolioUuid && folios.length > 0) {
            const selectedFolio = folios.find(folio => folio.uuid === selectedFolioUuid);
            if (selectedFolio) {
                const total = selectedFolio.balanceAmount;
                setSelectedFolioBalance(total);
                setIsBalanceZero(total === 0 || total === null || total === undefined);
            }
        } else {
            setSelectedFolioBalance(null);
            setIsBalanceZero(false);
        }
    }, [selectedFolioUuid, folios]);

    const { mutate: createFolioPayment, isPending } = useApiMutation({
        mutationFn: createFolioAddPayment,
        invalidateKeys: [["reservation-details"], ["folios"]],
        options: {
            onSuccess: () => {
                setSubmitting(false);
                onClose();
                form.resetFields();
                setSelectedProviderUuid("all");
                setIsBalanceZero(false);
                setSelectedFolioBalance(null);
            },
            onError: () => {
                setSubmitting(false);
            },
        },
    });

    const onFinish = (values) => {
        // Prevent submission if balanceAmount is zero
        if (isBalanceZero) {
            Toast.error("Cannot add payment. The selected folio has a zero balance.");
            return;
        }

        setSubmitting(true);
        const payload = {
            reservation: { uuid: bookingDetails?.reservation?.uuid || bookingDetails?.uuid },
            guest: { uuid: values.guest },
            folio: { uuid: values.folio },
            paymentMethod: { uuid: values.paymentMethod },
            paymentStatus: { uuid: values.paymentStatus },
            amount: Number(values.amount),
            transactionNo: values.transactionNo,
            receivedBy: {uuid: values.receivedBy},
            externalReference: values.externalReference,
            remarks: values.remark,
            paymentDate: values.paymentDate ? values.paymentDate.format("YYYY-MM-DD HH:mm:ss") : undefined,
        };
        createFolioPayment(payload);
    };

    const methodsArray = Array.isArray(paymentMethodsData) ? paymentMethodsData : [];

    const filteredMethods = methodsArray.filter((method) => {
        if (selectedProviderUuid === "all") return true;
        return method.type?.uuid === selectedProviderUuid;
    });

    const textSlateToWhiteInDark = `
    text-slate-600 font-medium ${textWhiteInDarkStyle}
    `;

    // Get selected folio details for display
    const getSelectedFolioDetails = () => {
        if (!selectedFolioUuid) return null;
        return folios.find(folio => folio.uuid === selectedFolioUuid);
    };

    const selectedFolio = getSelectedFolioDetails();

    const disablePayment = selectedFolioBalance < 0 || isBalanceZero ;

    return (
        <Drawer
            open={open}
            onClose={onClose}
            afterOpenChange={(onClose) => {
                form.resetFields();
                form.setFieldsValue({
                    paymentStatus: paymentCompletedStatus?.uuid,
                    paymentMethod: cashsMethod?.uuid,
                });
                setSelectedProviderUuid("all");
                setIsBalanceZero(false);
                setSelectedFolioBalance(null);
            }}
            size={550}
            title={
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Add Payment</span>
                    <Button
                        type="primary"
                        onClick={() => {
                            form.submit();
                        }}
                        loading={isPending}
                        disabled={submitting || isBalanceZero}
                    >
                        Create
                    </Button>
                </div>
            }
        >
            {
                reservationMetaFetching ?
                    <div className="flex min-h-screen items-center justify-center">
                        <Loader />
                    </div>
                    :
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ paymentType: "full" }}
                    >
                        <div className="flex items-center !mb-3">
                            <Title level={5} className="!mb-0 text-slate-700">Select Payment Method</Title>
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
                                    const choiceStillVisible = filteredMethods.some(m => m.uuid === currentSelection);
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
                                <Form.Item name="paymentMethod" rules={[{ required: true, message: "Please select a payment method" }]}>
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
                                                        className={`text-center rounded-lg relative transition-all duration-200 cursor-pointer ${selectedMethod === method.uuid
                                                            ? "!border-2 !border-blue-500 !shadow-sm dark:!bg-gray-900 dark:!backdrop-filter-md"
                                                            : "!border !border-slate-200 hover:border-slate-300"
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
                            <div className={`text-center py-6 text-slate-400 bg-slate-50 rounded-lg mb-6 border border-dashed border-slate-200 ${darkModeStyle}`}>
                                No payment methods configuration available for this type.
                            </div>
                        )}

                        <Divider className="my-5" />

                        {/* --- FOLIO & GUEST ROW --- */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className={textSlateToWhiteInDark}>Folio No</span>}
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
                            {
                                !disablePayment && (
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className={textSlateToWhiteInDark}>Guest</span>}
                                            name="guest"
                                        >
                                            <Select
                                                showSearch={{
                                                    filterOption: (input, option) =>
                                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                                                }}
                                                placeholder="Select a guest"
                                                options={guestOptions}
                                                className="w-full rounded"
                                            />
                                        </Form.Item>
                                    </Col>
                                )
                            }

                        </Row>

                        {/* --- ALERT: Show when balanceAmount is zero --- */}
                        {selectedFolio && (isBalanceZero || selectedFolioBalance < 0) && (
                            <Alert
                                message="Cannot Add Payment"
                                description={
                                    <div>
                                        <p className="mb-1">
                                            <strong>Folio:</strong> {selectedFolio.folioNo}
                                        </p>
                                        <p className="mb-0">
                                            <strong>Balance:</strong> {selectedFolio.balanceAmount !== null && selectedFolio.balanceAmount !== undefined
                                                ? `${selectedFolio.balanceAmount.toLocaleString()} MMK`
                                                : '0 MMK'}
                                        </p>
                                        {
                                           selectedFolioBalance < 0 ? 
                                            <p className="mt-2 mb-0 text-red-600">
                                            This folio is over paid. No payments can be added.
                                            </p> : 
                                            <p className="mt-2 mb-0 text-red-600">
                                            This folio has a zero balance. No payments can be added.
                                            </p>
                                        }
                                    </div>
                                }
                                type="warning"
                                showIcon
                                className="mb-4"
                            />
                        )}

                        {/* --- CONDITIONALLY RENDER OTHER FIELDS --- */}
                        {!disablePayment ? 
                            <>
                                {/* --- STATUS & AMOUNT ROW --- */}
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            label={<span className={textSlateToWhiteInDark}>Status</span>}
                                            name="paymentStatus"
                                            rules={[{ required: true, message: "Required" }]}
                                        >
                                            <Select placeholder="Select status" className="w-full rounded">
                                                {paymentCompletedStatus?.uuid && (
                                                    <Option value={paymentCompletedStatus.uuid}>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                            <span className=" font-medium">
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
                                            label={<span className={textSlateToWhiteInDark}>Amount{selectedFolioBalance !== null && <> ({selectedFolioBalance < 0 ? "Over Paid:" : "Balance:"} <PriceTag value={selectedFolioBalance} /> MMK)</>}</span>}
                                            name="amount"
                                            getValueProps={(value) => ({ value: value !== null && value !== undefined ? String(value) : "" })}
                                            rules={[
                                                { required: true, message: "Amount required" },
                                                {
                                                    validator: (_, value) => {
                                                        if (value !== undefined && value !== null && value < 1) {
                                                            return Promise.reject(
                                                                new Error("Amount must be at least 1 MMK")
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        if (selectedFolioBalance !== null && value > selectedFolioBalance) {
                                                            return Promise.reject(
                                                                new Error(`Amount cannot exceed balance of ${selectedFolioBalance.toLocaleString()} MMK`)
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <PriceInput
                                                min={0}
                                                placeholder="0.00"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* --- PAYMENT DATE & TRANSACTION NO ROW --- */}
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label={<span className={textSlateToWhiteInDark}>Payment Date</span>} name="paymentDate">
                                            <DatePicker className="w-full rounded" showTime format="YYYY-MM-DD HH:mm:ss" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label={<span className={textSlateToWhiteInDark}>Transaction No</span>} name="transactionNo">
                                            <Input placeholder="Enter Transaction Number" className="rounded w-full" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* --- EXTERNAL REFERENCE ROW --- */}
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label={<span className={textSlateToWhiteInDark}
                                            name="receivedBy">
                                            Received By
                                        </span>}>
                                            <Select
                                                showSearch={{
                                                    filterOption: (input, option) =>
                                                        (option?.label ?? "")
                                                            .toLowerCase()
                                                            .includes(input.toLowerCase()),
                                                }}
                                                placeholder="Select a admin"
                                                options={adminOptions}
                                                className="w-full rounded"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12}>
                                        <Form.Item label={<span className={textSlateToWhiteInDark}>External Reference</span>} name="externalReference">
                                            <Input placeholder="Enter External Reference" className="rounded w-full" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                {/* --- REMARK FIELD --- */}
                                <Form.Item label={<span className={textSlateToWhiteInDark}>Remark</span>} name="remark">
                                    <TextArea rows={3} placeholder="Add operational adjustments or audit notes here..." className="rounded w-full" />
                                </Form.Item>
                            </>  : null
                        }
                    </Form>
            }
        </Drawer>
    );
};

export default AddPaymentForm;