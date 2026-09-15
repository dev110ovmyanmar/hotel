import { Button, Card, DatePicker, Form, Input, Select, TimePicker } from "antd";
import useApiQuery from "../../hooks/useApiQuery";
import { queryClient } from "../../app/queryClient";
import dayjs from "dayjs";
import { availabilitySearch, reservationMeta } from "../../api/reservationSectionApi";
import { useEffect, useState } from "react";
import { useApiMutation } from "../../hooks/useApiMutation";
import { FaMoon } from "react-icons/fa";
import { values } from "lodash";
import { darkModeStyle } from "../../utils";

const { RangePicker } = DatePicker;

const ReservationForm = ({
    form,
    afterRoomConfirm,
    availabilitySearchResults,
    setReservationFormValues,
    searchButtonDisable,
    setSearchButtonDisable,
    defaultFilter,
    bookedViaOptions,
    sourceTypeOptions,
    setSearchReservation,
    setSelectedData
}) => {

    const dateRange = Form.useWatch("filter", form);
    const sourceTypeValue = Form.useWatch("sourceType", form); // Added this line to watch sourceType

    const [selectedSourceType, setSelectedSourceType] = useState(null);
    const selectedRoomTypes = Form.useWatch("roomType", form);
    const selectedRatePlans = Form.useWatch("ratePlan", form);

    const hasSelectedData =
        (selectedRoomTypes?.length ?? 0) > 0 ||
        (selectedRatePlans?.length ?? 0) > 0;

    const { data: reservationMetas } = useApiQuery({
        fetchQueryName: "reservation-meta",
        fetchQueryFunction: reservationMeta,
    });

    let agenciesOptions = reservationMetas?.agencies.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];

    let companyOptions = reservationMetas?.companies.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];

    let referralAgentOptions = reservationMetas?.referral_agents.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];


    let roomTypeOptions = reservationMetas?.room_types?.filter(item => item?.status.code === "active")
        .map((item) => ({
            label: item?.name,
            value: item.id
        }));

    let ratePlanOptions = reservationMetas?.rate_plans?.map((item) => ({
        label: item?.name,
        value: item.id
    }));


    const initData = queryClient.getQueryData(["initData", "authenticated"]);
    const checkInTime = initData?.property?.checkinTime;
    const checkOutTime = initData?.property?.checkoutTime;

    const checkInDate = dateRange?.[0];
    const checkOutDate = dateRange?.[1];

    const totalNights =
        checkInDate && checkOutDate
            ? checkOutDate.startOf("day").diff(
                checkInDate.startOf("day"),
                "day"
            )
            : 0;

    const searchSubmit = (values) => {
        setReservationFormValues(values);
        const modifiedValues = {
            ...values,
            filter: {
                checkinDate: values?.filter?.[0] ? dayjs(values?.filter?.[0]).format("YYYY-MM-DD") : null,
                checkoutDate: values?.filter?.[1] ? dayjs(values?.filter?.[1]).format("YYYY-MM-DD") : null,
            },
            bookedVia: {
                uuid: values.bookedVia,
            },
            sourceType: {
                uuid: values.sourceType,
            },
            source: {
                uuid: values.source,
            },
            totalNight: totalNights,
            roomType: {
                ids: values?.roomType
            },
            ratePlan: {
                ids: values?.ratePlan
            }

        };

        console.log(modifiedValues, "ValuesSearchSubmit")

        availabilitySearchResults.mutate(modifiedValues);
    };
    const handleChange = (value, option) => {
        setSelectedSourceType(option?.label);

        form.setFieldsValue({
            source: undefined,
        });
    };

    // Added this useEffect to update selectedSourceType when sourceTypeValue changes
    useEffect(() => {
        if (sourceTypeValue) {
            const selectedOption = sourceTypeOptions.find(option => option.value === sourceTypeValue);
            if (selectedOption) {
                setSelectedSourceType(selectedOption.label);
            }
        } else {
            setSelectedSourceType(null);
        }
    }, [sourceTypeValue, sourceTypeOptions]);

    useEffect(() => {
        const currentValues = form.getFieldsValue();
        if (
            bookedViaOptions?.length > 0 &&
            sourceTypeOptions?.length > 0 &&
            !currentValues.bookedVia &&
            !currentValues.sourceType
        ) {
            form.setFieldsValue({
                filter: defaultFilter,
                bookedVia: bookedViaOptions[0]?.value,
                sourceType: sourceTypeOptions[0]?.value,
            });
        }
    }, [bookedViaOptions, sourceTypeOptions, form, defaultFilter]);

    useEffect(() => {
        if (totalNights) {
            form.setFieldsValue({
                totalNight: totalNights
            })
        }
    }, [totalNights, form])

    // Range Picker
    const disabledDate = (current, info) => {
        const today = dayjs().startOf("day");

        if (current.isBefore(today, "day")) {
            return true;
        }

        if (
            info.from &&
            current.isSame(info.from, "day")
        ) {
            return true;
        }

        return false;
    };

    return (
        <Card
            className="!bg-gradient-to-r from-[#215282] to-[#000B60]"
        >
            <Form
                form={form}
                onFinish={searchSubmit}
                layout="vertical"
                onValuesChange={() => {
                    setSearchButtonDisable(false);
                    setSearchReservation(false);
                    setSelectedData([]);
                }}
                className="reservation-form"
            >
                <div className="flex justify-between">
                    <h1 className="text-lg font-bold text-[#ffffff] my-2">New Reservation</h1>
                    {
                        afterRoomConfirm ?
                            null
                            :
                            <Form.Item className="hidden md:block">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={availabilitySearchResults?.isPending}
                                    disabled={searchButtonDisable}
                                    className={
                                        searchButtonDisable
                                            ? "min-w-[125px] !text-gray-400 !border-gray-400/50 cursor-not-allowed"
                                            : "min-w-[125px] !bg-gray-100 !text-gray-900 !shadow-lg shadow-gray-900/50"
                                    }
                                // className="min-w-[125px] !bg-gradient-to-r from-[#000B60] to-[#215282] !border-blue-400/50 !shadow-lg shadow-blue-600/50"


                                >
                                    {/* !bg-gradient-to-r from-[#CACDCB] to-[#104171] */}
                                    Search
                                </Button>
                            </Form.Item>
                    }
                </div>

                <div className="flex flex-wrap gap-x-2 order-info-forms">
                    <div className="w-100 flex-auto md:flex-initial">
                        <Form.Item
                            name="filter"
                            label={
                                <p className="text-gray-100">Check-in / Check-out Date</p>
                            }
                            rules={[{ required: true, message: "Please Select Date" }]}>
                            <RangePicker
                                format="YYYY-MM-DD HH:mm"
                                disabledDate={disabledDate}
                                onChange={(dates) => {
                                    if (!dates) return;

                                    const updatedDates = [
                                        dates[0]
                                            ?.hour(dayjs(checkInTime, "HH:mm:ss").hour())
                                            ?.minute(dayjs(checkInTime, "HH:mm:ss").minute()),

                                        dates[1]
                                            ?.hour(dayjs(checkOutTime, "HH:mm:ss").hour())
                                            ?.minute(dayjs(checkOutTime, "HH:mm:ss").minute()),
                                    ];

                                    form.setFieldsValue({
                                        filter: updatedDates,
                                    });
                                }}
                                disabled={afterRoomConfirm}
                                className={afterRoomConfirm ? `!w-full !bg-gray-100 ${darkModeStyle} date-picker-disabled` : "!w-full"}

                            />
                        </Form.Item>
                    </div>

                    <div className="flex-initial">
                        <Form.Item
                            name="totalNight"
                            label={
                                <p className="text-gray-100 hidden">Nights</p>
                            }
                        >
                            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 ml-auto sm:ml-0">
                                <FaMoon className="text-xs" />
                                <span className="text-xs font-bold whitespace-nowrap">
                                    {totalNights}
                                    {totalNights === 1 ? " Night" : " Nights"}
                                </span>
                            </div>
                        </Form.Item>
                    </div>

                    <div className="w-60 md:w-52 lg:w-50 flex-auto md:flex-initial">
                        <Form.Item
                            name="bookedVia"
                            label={
                                <p className="text-gray-100">Booking Source</p>
                            }
                            rules={[{ required: true, message: "Please Select Booking Source" }]}
                            getValueProps={(value) => {
                                return {
                                    value: afterRoomConfirm ?
                                        bookedViaOptions?.find(item => item.value === value)?.label :
                                        value
                                }
                            }}
                        >

                            {
                                afterRoomConfirm ?
                                    <Input
                                        readOnly={afterRoomConfirm}
                                    /> :
                                    <Select
                                        options={bookedViaOptions}
                                        // className="w-[100%] "
                                        placeholder="Select Booked Via"
                                    >
                                    </Select>
                            }
                        </Form.Item>
                    </div>

                    <div className="w-60 md:w-52 lg:w-50 flex-auto md:flex-initial">
                        <Form.Item
                            name="sourceType"
                            label={
                                <p className="text-gray-100">Source Type</p>
                            }
                            rules={[{ required: true, message: "Please Select Source Type" }]}
                            getValueProps={(value) => {
                                return {
                                    value: afterRoomConfirm ?
                                        sourceTypeOptions?.find(item => item.value === value)?.label :
                                        value
                                }
                            }}
                        >
                            {
                                afterRoomConfirm ?
                                    <Input
                                        readOnly={afterRoomConfirm}
                                        className="w-[100%] "
                                    /> :
                                    <Select
                                        options={sourceTypeOptions}
                                        className="w-[100%]"
                                        onChange={handleChange}
                                        placeholder="Select Source Type"
                                    ></Select>
                            }
                        </Form.Item>

                    </div>

                    <div className="w-60 md:w-52 lg:w-50 flex-auto md:flex-initial">
                        {
                            (selectedSourceType === "Agency" ||
                                selectedSourceType === "Company" ||
                                selectedSourceType === "Referral Agent") && (

                                <Form.Item
                                    name="source"
                                    label={
                                        <p className="text-gray-100">Source Name</p>
                                    }
                                    rules={[{ required: true, message: "Please Select Source Name" }]}
                                    getValueProps={(value) => {
                                        return {
                                            value: (afterRoomConfirm && selectedSourceType === "Agency") ?
                                                agenciesOptions?.find(item => item?.value === value)?.label :
                                                (afterRoomConfirm && selectedSourceType === "Company") ?
                                                    companyOptions?.find(item => item?.value === value)?.label :
                                                    (afterRoomConfirm && selectedSourceType === "Referral Agent") ?
                                                        referralAgentOptions?.find(item => item?.value === value)?.label :
                                                        value
                                        }
                                    }}
                                >
                                    {
                                        afterRoomConfirm ?
                                            <Input
                                                className="w-[100%]"
                                                readOnly={afterRoomConfirm}
                                            /> :
                                            <Select
                                                options={selectedSourceType === "Agency" ? agenciesOptions : selectedSourceType === "Company" ? companyOptions : referralAgentOptions}
                                                placeholder="Select Source Name"
                                                className="!w-[100%]"
                                            ></Select>
                                    }
                                </Form.Item>

                            )
                        }
                    </div>
                </div>

                <div className="flex gap-2 sm:flex-wrap w-[80%] lg:w-[75%] sm:w-[100%] order-info-forms">
                    {
                        (!afterRoomConfirm || selectedRoomTypes?.length > 0) &&
                        <div className="w-70 lg:w-65 sm:w-100 flex-auto">
                            <Form.Item
                                name="roomType"
                                label={
                                    <p className="text-gray-100">Room Type</p>
                                }
                                className="w-full"
                            >
                                <Select
                                    options={roomTypeOptions}
                                    placeholder="Select Room Type"
                                    mode="multiple"
                                    open={afterRoomConfirm ? !afterRoomConfirm : undefined}
                                    className={afterRoomConfirm ? "close-icon-hide" : ""}
                                    showSearch={!afterRoomConfirm}
                                    suffixIcon={afterRoomConfirm ? null : undefined}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </div>
                    }

                    {
                        (!afterRoomConfirm || selectedRatePlans?.length > 0) &&
                        <div className="w-20 lg:w-35 sm:w-100 flex-auto">
                            <Form.Item
                                name="ratePlan"
                                label={
                                    <p className="text-gray-100">Rate Plan</p>
                                }
                                className="w-full"
                            >
                                <Select
                                    options={ratePlanOptions}
                                    placeholder="Select Rate Plan"
                                    mode="multiple"
                                    open={afterRoomConfirm ? !afterRoomConfirm : undefined}
                                    className={afterRoomConfirm ? "close-icon-hide" : ""}
                                    showSearch={!afterRoomConfirm}
                                    suffixIcon={afterRoomConfirm ? null : undefined}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </div>
                    }
                </div>

                {/* Mobile Button */}
                {
                    afterRoomConfirm ?
                        null
                        :
                        <div className="flex justify-end">
                            <Form.Item className="block md:hidden !mt-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={availabilitySearchResults?.isPending}
                                    disabled={searchButtonDisable}
                                    className={
                                        searchButtonDisable
                                            ? "min-w-[125px] !text-gray-400 !border-gray-400/50 cursor-not-allowed"
                                            : "min-w-[125px] !bg-gray-100 !text-gray-900 !shadow-lg shadow-gray-900/50"
                                    }
                                    // className="min-w-[125px] !bg-gradient-to-r from-[#000B60] to-[#215282] !border-blue-400/50 !shadow-lg shadow-blue-600/50"
                                >
                                    Search
                                </Button>
                            </Form.Item>
                        </div>
                }

            </Form>

        </Card >

    )
}

export default ReservationForm;