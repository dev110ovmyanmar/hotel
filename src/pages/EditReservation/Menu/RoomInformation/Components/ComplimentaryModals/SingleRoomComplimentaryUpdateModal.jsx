import React, { useEffect, useState } from "react";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { complimentaryUpdate } from "../../../../../../api/reservationSectionApi";
import { queryClient } from "../../../../../../app/queryClient";
import { Button, Checkbox, Form, Select, Alert } from "antd";
import Modal from "antd/es/modal/Modal";
import Toast from "../../../../../../component/Toast/Toast";
import { darkModeStyle, textWhiteInDarkStyle } from "../../../../../../utils";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";

const SingleRoomComplimentaryUpdateModal = ({
    reservationData,
    open,
    onCancel,
}) => {
    // Validation Logic Setup
    const checkin = reservationData?.checkinDate
        ? new Date(reservationData.checkinDate)
        : null;
    if (checkin) checkin.setHours(0, 0, 0, 0);

    const checkout = reservationData?.checkoutDate
        ? new Date(reservationData.checkoutDate)
        : null;
    if (checkout) checkout.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isCheckinValid = checkin ? checkin <= today : false;
    const isCheckoutValid = checkout ? checkout > today : false;
    const isStatusValid = reservationData?.roomStatus?.code === "checked_in" || reservationData?.roomStatus?.code === "confirmed";

    // Global reservation validity block
    const isModificationAllowed =
        isCheckinValid && isCheckoutValid && isStatusValid;

    const initData = queryClient.getQueryData(["initData", "authenticated"]);
    const complimentaryStatuses = initData?.statuses?.complimentary_status;
    const [roomAllocation, setRoomAllocation] = useState(null);
    const [selectedStatusUuid, setSelectedStatusUuid] = useState("");
    const [form] = Form.useForm();

    // Centralized Clean Up and Close Handler
    const handleClose = () => {
        setRoomAllocation(null);
        setSelectedStatusUuid("");
        form.resetFields();
        onCancel(); // Trigger original parent onCancel action
    };

    useEffect(() => {
        if (!open) return; // Only process initialization logic if the modal is actively open

        if (
            Array.isArray(complimentaryStatuses) &&
            complimentaryStatuses.length > 0 &&
            !selectedStatusUuid
        ) {
            if (reservationData?.complimentaryStatus) {
                const currentStatus = complimentaryStatuses.find(
                    (s) => s.uuid === reservationData?.complimentaryStatus?.uuid,
                );
                if (currentStatus) {
                    setSelectedStatusUuid(currentStatus.uuid);
                    form.setFieldsValue({
                        statusUuid: {
                            value: currentStatus.uuid,
                            label: currentStatus.name,
                        },
                    });
                }
            } else {
                const defaultStatus = complimentaryStatuses[0];
                setSelectedStatusUuid(defaultStatus.uuid);
                form.setFieldsValue({
                    statusUuid: { value: defaultStatus.uuid, label: defaultStatus.name },
                });
            }
        }
    }, [complimentaryStatuses, selectedStatusUuid, form, reservationData, open]);

    useEffect(() => {
        if (!reservationData || !open) return; // Only populate if modal is actively opening

        const nights = reservationData.rates || [];
        const initialCompDates = nights
            .filter((n) => n.isComplimentary)
            .map((n) => n.date);

        setRoomAllocation({
            roomInfo: {
                id: reservationData.id,
                uuid: reservationData.uuid,
                number: reservationData.room?.roomNo || "-",
                type: reservationData.roomType?.name || "Unknown Room Type",
                isComplimentary: reservationData?.isComplimentary,
            },
            ratePlan: reservationData.ratePlan || {
                name: "Unknown",
                code: "N/A",
                channelVisibility: {},
            },
            nights: nights,
            compDates: initialCompDates,
        });
    }, [reservationData, open]);

    // Helper utility to check if a specific date is in the past (today is now editable)
    const isPastDate = (dateString) => {
        const targetDate = new Date(dateString);
        targetDate.setHours(0, 0, 0, 0);
        return targetDate < today;
    };

    // Toggle specific date with guard clause
    const handleToggleDate = (dateString) => {
        if (
            !isModificationAllowed
            || isPastDate(dateString)
        )
            return;

        setRoomAllocation((prev) => {
            if (!prev) return null;
            const isComp = prev.compDates.includes(dateString);
            const updatedCompDates = isComp
                ? prev.compDates.filter((d) => d !== dateString)
                : [...prev.compDates, dateString];

            return { ...prev, compDates: updatedCompDates };
        });
    };

    // Toggle all eligible dates (protects today and previous dates)
    const handleToggleAllDates = (checked) => {
        if (!isModificationAllowed) return;

        setRoomAllocation((prev) => {
            if (!prev) return null;
            if (checked) {
                const eligibleDates = prev.nights
                    .map((n) => n.date)
                    .filter((date) => !isPastDate(date));
                const existingLockedCompDates = prev.compDates.filter((date) =>
                    isPastDate(date),
                );

                return {
                    ...prev,
                    compDates: [
                        ...new Set([...existingLockedCompDates, ...eligibleDates]),
                    ],
                };
            } else {
                const preservedLockedDates = prev.compDates.filter((date) =>
                    isPastDate(date),
                );
                return { ...prev, compDates: preservedLockedDates };
            }
        });
    };

    const calculateRowTotal = (nights, compDates) => {
        let gross = 0;
        let savings = 0;

        (nights || []).forEach((n) => {
            const priceVal = parseFloat(n.originalPrice) || 0;
            gross += priceVal;
            if ((compDates || []).includes(n.date)) {
                savings += priceVal;
            }
        });

        return { gross, savings, net: gross - savings };
    };

    const updateComplimentaryMutation = useApiMutation({
        mutationFn: complimentaryUpdate,
        invalidateKeys: [["reservation-room"], ["reservation-room-comp"]],
    });

    const handleSave = async () => {
        try {
            await form.validateFields();
        } catch (error) {
            return;
        }

        if (!roomAllocation) return;

        const payload = {
            complimentaryStatus: {
                uuid: selectedStatusUuid,
            },
            reservationRooms: [
                {
                    uuid: roomAllocation.roomInfo.uuid,
                    dates: roomAllocation.compDates,
                },
            ],
        };

        updateComplimentaryMutation.mutate(payload, {
            onSuccess: (data) => {
                Toast.success(data?.response || "Complimentary updated successfully.");
                handleClose(); // Reset state on successful save tracking
            },
            onError: (error) => {
                Toast.error("Failed to update complimentary status.");
                console.error(error);
            },
        });
    };

    // Derived variables fallback safely if roomAllocation drops to null during exit transitions
    const { gross, savings, net } = calculateRowTotal(
        roomAllocation?.nights,
        roomAllocation?.compDates,
    );
    const allNights = roomAllocation?.nights || [];

    const manageableNights = allNights.filter((n) => !isPastDate(n.date));
    const isAllSelected =
        manageableNights.length > 0 &&
        manageableNights.every((n) => roomAllocation?.compDates?.includes(n.date));
    const isIndeterminate =
        !isAllSelected &&
        manageableNights.some((n) => roomAllocation?.compDates?.includes(n.date));

    return (
        <Modal
            open={open}
            onCancel={handleClose} // Clean state when clicking cross icon or outside modal bounding box
            footer={[
                <Button key="back" onClick={handleClose}>
                    {" "}
                    {/* Clean state when clicking Cancel Button */}
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={updateComplimentaryMutation.isPending}
                    onClick={handleSave}
                    disabled={!isModificationAllowed || !roomAllocation}
                    className={
                        !isModificationAllowed || !roomAllocation ? "!text-gray-400" : ""
                    }
                >
                    Save
                </Button>,
            ]}
            width={800}
            styles={{
                content: {
                    backgroundColor: "#f1f5f9",
                    borderRadius: "1rem",
                    padding: "24px",
                },
            }}
        >
            <div className="text-slate-800 font-sans">
                <div className="mb-6 flex flex-col gap-3">
                    <div>
                        <h2
                            className={`text-base font-bold t$ext-slate-900 ${textWhiteInDarkStyle}`}
                        >
                            Complimentary Offer
                        </h2>
                    </div>

                    {!isModificationAllowed && (
                        <Alert
                            title="Modifications Restricted"
                            description={
                                <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                                    {!isStatusValid && (
                                        <li>
                                            Room status must be checked-in (Current status:{" "}
                                            {reservationData?.roomStatus?.name || "N/A"}).
                                        </li>
                                    )}
                                    {!isCheckinValid && (
                                        <li>Check-in date cannot be in the future.</li>
                                    )}
                                    {!isCheckoutValid && (
                                        <li>Checkout date must be later than today's date.</li>
                                    )}
                                </ul>
                            }
                            type="error"
                            showIcon
                            className="rounded-xl border border-red-200 shadow-xs"
                        />
                    )}

                    {Array.isArray(complimentaryStatuses) &&
                        complimentaryStatuses.length > 0 && (
                            <Form form={form} layout="vertical">
                                <Form.Item
                                    name="statusUuid"
                                    className="!mt-5 mb-0"
                                    label={
                                        <span
                                            className={`text-sm font-semibold text-slate-700  ${textWhiteInDarkStyle}`}
                                        >
                                            Complimentary Reason:
                                        </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select a status",
                                        },
                                    ]}
                                >
                                    <Select
                                        options={complimentaryStatuses.map((status) => ({
                                            value: status.uuid,
                                            label: status.name,
                                        }))}
                                        labelInValue
                                        onChange={(obj) => setSelectedStatusUuid(obj.value)}
                                        placeholder="Select Status"
                                        style={{ minWidth: 200 }}
                                        open={
                                            !isModificationAllowed ? isModificationAllowed : undefined
                                        }
                                    />
                                </Form.Item>
                            </Form>
                        )}
                </div>

                {roomAllocation && (
                    <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-100 mb-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`bg-slate-100 font-mono text-xs px-2 py-0.5 rounded text-slate-700 border border-slate-200 font-bold ${darkModeStyle}`}
                                        >
                                            Room - {roomAllocation.roomInfo.number}
                                        </span>
                                        <h3
                                            className={`text-sm font-bold text-slate-900 ${textWhiteInDarkStyle}`}
                                        >
                                            {roomAllocation.roomInfo.type}
                                        </h3>
                                    </div>
                                    <div className="flex items-center">
                                        <span
                                            className={`text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded font-medium ${darkModeStyle}`}
                                        >
                                            🏷️ {roomAllocation.ratePlan.name} (
                                            {roomAllocation.ratePlan.code})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-300 block uppercase font-bold tracking-tight">
                                        Net Amount
                                    </span>
                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                        <p className="inline-flex items-center gap-1 m-0">
                                            <span>
                                                <PriceTag value={net} />
                                            </span>
                                            <span>MMK</span>
                                        </p>
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    🗓️ Stay Dates
                                </h4>
                                {allNights.length > 0 && (
                                    <div
                                        className={`border transition-colors px-3 py-1.5 rounded-md flex items-center ${isModificationAllowed && manageableNights.length > 0
                                            ? "bg-slate-50 hover:bg-slate-100 border-slate-200"
                                            : "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                                            }
                                        ${darkModeStyle}
                                        `}
                                    >
                                        <Checkbox
                                            checked={isAllSelected}
                                            indeterminate={isIndeterminate}
                                            onChange={(e) => handleToggleAllDates(e.target.checked)}
                                            className={`text-xs font-semibold text-slate-700 ${!isModificationAllowed || manageableNights.length === 0 ? "pointer-events-none" : null}`}
                                        >
                                            Mark Dates from Today as Complimentary
                                        </Checkbox>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
                                {roomAllocation.nights.map((night) => {
                                    const isComp = roomAllocation.compDates.includes(night.date);
                                    const disabledDate = !isModificationAllowed
                                        || isPastDate(night.date);
                                    const displayValue = isComp
                                        ? 0
                                        : parseFloat(night.originalPrice);

                                    return (
                                        <button
                                            key={night.date}
                                            type="button"
                                            onClick={() => handleToggleDate(night.date)}
                                            disabled={disabledDate}
                                            className={`flex-none w-28 p-2.5 rounded-lg border text-left transition-all ${disabledDate
                                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                                                : isComp
                                                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70"
                                                }
                                                ${darkModeStyle}
                                                `}
                                        >
                                            <span className="text-[9px] block text-slate-400 font-semibold">
                                                {night.date}
                                            </span>
                                            <span
                                                className="text-xs font-bold block mt-0.5"
                                                style={{ color: isComp ? "green" : "inherit" }}
                                            >
                                                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                                    <PriceTag value={displayValue} />
                                                    <span>MMK</span>
                                                </span>
                                            </span>
                                            <span className="text-[8px] block mt-1 font-medium opacity-70">
                                                {isComp ? "🎁 Waived" : "Available"}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default SingleRoomComplimentaryUpdateModal;
