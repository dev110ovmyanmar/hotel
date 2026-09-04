import React, { useEffect, useState } from "react";
import {
    Drawer,
    Form,
    InputNumber,
    Button,
    Tag,
    Divider,
    Space,
    Badge,
    message,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    UserOutlined,
    CalendarOutlined,
    CoffeeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { upsertDailyOccupaction } from "../../../../../../api/dailyOccupactionApi";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";

const STATUS_COLORS = {
    active: { color: "#389E0D", background: "#F6FFED", borderColor: "#B7EB8F" },
    updated: { color: "#0958D9", background: "#E6F4FF", borderColor: "#91CAFF" },
    cancelled: { color: "#CF1322", background: "#FFF1F0", borderColor: "#FFA39E" },
};

const SectionCard = ({ title, children }) => (
    <div className="bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
        <h4 className="font-semibold text-slate-900 dark:text-gray-500 tracking-wider mb-3">
            {title}
        </h4>
        <div className="divide-y divide-slate-200/70 dark:divide-gray-700/70">
            {children}
        </div>
    </div>
);

const InfoRow = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
        <span className="text-slate-700 dark:text-gray-200">
            {label}
        </span>
        <div
            className={`flex justify-end gap-1 ${highlight
                ? 'text-red-500 dark:text-red-400'
                : ''
                }`}
        >
            {highlight && <span>-</span>}
            <PriceTag value={value} />
            <span>MMK</span>
        </div>
    </div>
);

const DailyOccupationDetailDrawer = ({
    open,
    onClose,
    data,
    roomType,
    reservationRoomUuid,
    initialEditMode = false,
    isPastDate = false,
    disableEdit = false,
}) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    const maxAdults = roomType?.maxAdults || 0;
    const maxChildren = roomType?.maxChildren || 0;
    const maxExtraBed = roomType?.maxExtraBed || 0;
    const maxOccupancy = roomType?.maxOccupancy || 0;

    const maxLimits = {
        adults: maxAdults,
        extraBedCount: maxExtraBed,
        extraPersonCount: maxOccupancy,
        babyCotCount: maxOccupancy,
    };


    const childrenAges = Form.useWatch("childrenAges", form) || [];

    const mutation = useApiMutation({
        mutationFn: upsertDailyOccupaction,
        invalidateKeys: [["dailyOccupactions"], ["reservation-room-details"], ["reservation-room"]],
    });

    // Helper to load form values from data
    const syncFormValues = (d) => {
        if (!d) return;
        form.setFieldsValue({
            adults: d.adults ?? 0,
            extraBedCount: d.extraBedCount ?? 0,
            extraPersonCount: d.extraPersonCount ?? 0,
            babyCotCount: d.babyCotCount ?? 0,
            childrenAges: d.children?.map((child) => child.age) ?? [],
        });
    };

    // Re-sync form data whenever drawer opens or data payload changes
    useEffect(() => {
        if (open && data) {
            setIsEditing(initialEditMode);
            syncFormValues(data);
        }
        if (!open) {
            setIsEditing(false);
            form.resetFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, data]);

    const handleCloseDrawer = () => {
        setIsEditing(false);
        form.resetFields();
        onClose();
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                uuid: reservationRoomUuid,
                stayDate: data.stayDate,
                adults: values.adults,
                extraBedCount: values.extraBedCount,
                extraPersonCount: values.extraPersonCount,
                babyCotCount: values.babyCotCount,
                mealPlan: {
                    uuid: data.mealPlan?.uuid,
                },
                childrenAges: values.childrenAges || [],
            };

            await mutation.mutateAsync(payload);
            Toast.success("Occupation details updated successfully");
            setIsEditing(false);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    // Don't render content if no data, but let the Drawer handle its open/close animation
    const hasData = !!data;

    return (
        <Drawer
            open={open}
            onClose={handleCloseDrawer}
            width={480}
            className="dark:bg-gray-900"
            headerStyle={{ borderBottom: "1px solid rgba(229, 231, 235, 0.5)" }}
            title={
                <div className="flex justify-between items-center pr-2">
                    <div>
                        <h2 className="font-bold text-base text-slate-800 dark:text-white m-0">
                            Daily Occupancy Details
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasData && !isEditing && !isPastDate && !disableEdit && (
                            <Button type="primary" onClick={() => setIsEditing(true)}>
                                Edit
                            </Button>
                        )}
                        {hasData && isEditing && (
                            <FormButtons
                                mode="update"
                                isPending={mutation.isPending}
                                onClick={handleSave}
                            />
                        )}
                    </div>
                </div>
            }
        >
            {!hasData ? (
                <div className="flex items-center justify-center h-40 text-slate-400">
                    No data available
                </div>
            ) : (
                <Form form={form} layout="vertical" requiredMark={false}>
                    <div className="space-y-4">
                        {/* Header Banner: Stay Date & Status */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200/80 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <CalendarOutlined className="text-lg" />
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">
                                        Stay Date
                                    </span>
                                    <span className="text-base font-bold text-slate-800 dark:text-white">
                                        {dayjs(data.stayDate).format("DD MMM YYYY")}
                                    </span>
                                </div>
                            </div>

                            {data.occupancyStatus && (
                                <span
                                    className="font-medium text-xs rounded-md px-2 py-0.5 border inline-block"
                                    style={STATUS_COLORS[data.occupancyStatus.code]}
                                >
                                    {data.occupancyStatus.name}
                                </span>
                            )}
                        </div>

                        {/* Guest Information */}
                        <SectionCard
                            title="Occupancy"
                            icon={<UserOutlined className="text-emerald-500" />}
                        >
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="ant-form-item-label">Adults &ensp;
                                            <span className="text-xs text-slate-400">Max: {maxLimits.adults}</span>
                                            </label>
                                        </div>
                                        <Form.Item name="adults"
                                            className="mb-2"
                                        >
                                            <InputNumber
                                                min={0}
                                                className="!w-full rounded-lg" />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="ant-form-item-label">Children &ensp;
                                            <span className="text-xs text-slate-400">Max: {maxChildren}</span>
                                            </label>
                                        </div>
                                        <Form.Item className="mb-2">
                                            <div className="px-2 py-1 !w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900 font-semibold text-slate-700 dark:text-slate-300">
                                                {childrenAges.length}
                                            </div>
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="ant-form-item-label">Extra Bed &ensp;
                                            <span className="text-xs text-slate-400">Max: {maxLimits.extraBedCount}</span>
                                            </label>
                                        </div>
                                        <Form.Item
                                            name="extraBedCount"
                                            className="mb-2"
                                        >
                                            <InputNumber min={0} className="!w-full rounded-lg" />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="ant-form-item-label">Extra Person &ensp;
                                            <span className="text-xs text-slate-400">Max: {maxLimits.extraPersonCount}</span>
                                            </label>
                                        </div>
                                        <Form.Item
                                            name="extraPersonCount"
                                            className="mb-2"
                                        >
                                            <InputNumber min={0} className="!w-full rounded-lg" />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="ant-form-item-label">Baby Cot &ensp;
                                            <span className="text-xs text-slate-400">Max: {maxLimits.babyCotCount}</span>
                                            </label>
                                        </div>
                                        <Form.Item
                                            name="babyCotCount"
                                            className="mb-2"
                                        >
                                            <InputNumber min={0} className="!w-full rounded-lg" />
                                        </Form.Item>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-y-3 gap-x-4 bg-slate-50/50 dark:bg-gray-900/40 p-3 rounded-lg border border-slate-100 dark:border-gray-700/50">
                                    <div>
                                        <span className="text-xs text-slate-400 block">Adults</span>
                                        <span className="font-semibold text-slate-700 dark:text-gray-200">
                                            {data.adults}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Children</span>
                                        <span className="font-semibold text-slate-700 dark:text-gray-200">
                                            {data.childrenCount}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Extra Bed</span>
                                        <span className="font-semibold text-slate-700 dark:text-gray-200">
                                            {data.extraBedCount}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">
                                            Extra Person
                                        </span>
                                        <span className="font-semibold text-slate-700 dark:text-gray-200">
                                            {data.extraPersonCount}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Baby Cot</span>
                                        <span className="font-semibold text-slate-700 dark:text-gray-200">
                                            {data.babyCotCount}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Dynamic Children Ages Section */}
                            {isEditing && (
                                <>
                                    <Divider className="my-3 text-xs text-slate-400">
                                        Children Age
                                    </Divider>

                                    <Form.List name="childrenAges">
                                        {(fields, { add, remove }) => (
                                            <div className="space-y-2">
                                                {fields.map(({ key, name }) => (
                                                    <div key={key} className="bg-slate-50 dark:bg-gray-900/50 p-2 rounded-lg border border-slate-200/60 dark:border-gray-700">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-xs font-medium text-slate-500 min-w-[60px]">
                                                                Child {name + 1}
                                                            </span>

                                                            <Form.Item
                                                                name={name}
                                                                noStyle
                                                                rules={[
                                                                    { required: true, message: "Please enter age" },
                                                                    {
                                                                        type: "number",
                                                                        min: 1,
                                                                        max: 10,
                                                                        message: "Age must be between 1 and 10",
                                                                    },
                                                                ]}
                                                            >
                                                                <InputNumber
                                                                    min={1}
                                                                    max={10}
                                                                    defaultValue={1}
                                                                    mode="spinner"
                                                                    className="flex-1 rounded-md"
                                                                    placeholder="Age"
                                                                    style={{ width: "100%" }}
                                                                />
                                                            </Form.Item>

                                                            <span className="text-xs text-slate-400">years</span>

                                                            <Button
                                                                type="text"
                                                                danger
                                                                size="small"
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => remove(name)}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}

                                                <Button
                                                    block
                                                    type="dashed"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => add(1)}
                                                    className="mt-2 rounded-lg border-slate-300 dark:border-gray-600 text-slate-600 dark:text-gray-300"
                                                >
                                                    Add Child
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </>
                            )}
                        </SectionCard>

                        {
                            !isEditing &&
                            <>
                                {/* Financial Breakdown */}
                                <SectionCard title="Charges Summary">
                                    {(() => {
                                        const dc = data.dailyCharge || {};
                                        const feeRows = [
                                            ["Sub Total", dc.subTotal],
                                            ["Tax", dc.taxTotal],
                                            // ["Service Charge", dc.serviceChargeTotal],
                                            ["Incentive", dc.incentiveTotal],
                                            ["Discount", dc.discountTotal],
                                        ];

                                        return (
                                            <>
                                                <InfoRow label="Room Charge" value={dc.roomRate || 0} />
                                                <InfoRow label="Child Charge" value={dc.childChargeTotal || 0} />
                                                <InfoRow label="Extra Bed Charge" value={dc.extraBedTotal || 0} />
                                                <InfoRow label="Extra Person Charge" value={dc.extraPersonTotal || 0} />
                                                <InfoRow label="Baby Cot Charge" value={dc.babyCotTotal || 0} />
                                                <InfoRow label="Meal Charge" value={dc.mealChargeTotal || 0} />

                                                <div className="my-2 border-t border-dashed border-slate-300 dark:border-gray-600" />

                                                {feeRows.map(([label, value]) => (
                                                    <InfoRow
                                                        key={label}
                                                        label={label}
                                                        value={value}
                                                        highlight={label === "Incentive" || label === "Discount"}
                                                    />
                                                ))}

                                                <div className="my-2 border-t border-dashed border-slate-300 dark:border-gray-600" />

                                                <div className="flex justify-between items-center rounded-xl px-4 py-3.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                                                    <span className="font-bold text-slate-800 dark:text-gray-100">
                                                        Grand Total
                                                    </span>
                                                    <div className="flex justify-end gap-1 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                                                        <PriceTag value={dc.grandTotal || 0} />
                                                        <span>MMK</span>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </SectionCard>
                            </>
                        }

                    </div>
                </Form>
            )
            }
        </Drawer >
    );
};

export default DailyOccupationDetailDrawer;