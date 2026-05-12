import { Button, Card, DatePicker, Form, Select, TimePicker } from "antd";
import useApiQuery from "../../hooks/useApiQuery";
import { queryClient } from "../../app/queryClient";
import dayjs from "dayjs";
import { availabilitySearch, reservationMeta } from "../../api/reservationSectionApi";
import { useEffect, useState } from "react";
import { useApiMutation } from "../../hooks/useApiMutation";

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

}) => {
    const dateRange = Form.useWatch("filter", form);
    const sourceTypeValue = Form.useWatch("sourceType", form); // Added this line to watch sourceType

    const [selectedSourceType, setSelectedSourceType] = useState(null);

    const { data: reservationMetas } = useApiQuery({
        fetchQueryName: "reservation-meta",
        fetchQueryFunction: reservationMeta,
    });

    const agenciesOptions = reservationMetas?.agencies.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];

    const companyOptions = reservationMetas?.companies.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];


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
            totalNight: totalNights
        };

        availabilitySearchResults.mutate(modifiedValues);
    };

    const handleChange = (value, option) => {
        setSelectedSourceType(option?.label);
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
    }, [totalNights,form])

    // Range Picker
    const disabledDate = current => {
        return current < dayjs().startOf('day');
    };

    return (
        <Card >
            <Form
                // values={searchButtonDisable}
                form={form}
                onFinish={searchSubmit}
                layout="vertical"
                onValuesChange={() => { setSearchButtonDisable(false) }}
            >
                <h1 className="text-lg font-bold my-2">Create New Reservation</h1>
                <div className="flex flex-wrap gap-3">
                    <div className="flex-[3] min-w-[320px]">
                        <Form.Item name="filter" label="Check-in / Check-out Date" rules={[{ required: true, message: "Please Select Date" }]}>
                            <RangePicker
                                className="!w-full"
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

                            />
                        </Form.Item>
                    </div>

                    <div >
                        <Form.Item name="totalNight" label="Nights" rules={[{ required: true }]}>
                            <div className="w-[61px] h-[32px] bg-[#fafafa] rounded-md flex flex-col justify-center items-center">

                                <p className="text-xs leading-none">{totalNights}</p>
                                <p className="text-xs leading-none">Nights</p>

                            </div>
                        </Form.Item>
                    </div>

                    <div className="w-full min-w-[200px] sm:w-[45%] md:w-[30%] md:flex-1 lg:flex-2">
                        <Form.Item name="bookedVia" label="Booking Source" rules={[{ required: true, message: "Please Select Booking Source" }]}>
                            <Select
                                options={bookedViaOptions}
                                className="w-[100%] "
                                placeholder="Select Booked Via"
                            >
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="w-full min-w-[200px] sm:w-[45%] md:w-[30%] lg:flex-2">
                        <Form.Item name="sourceType" label="Source Type" rules={[{ required: true, message: "Please Select Source Type" }]}>
                            <Select
                                options={sourceTypeOptions}
                                className="w-[100%]"
                                onChange={handleChange}
                                placeholder="Select Source Type"
                            ></Select>
                        </Form.Item>
                    </div>

                    <div className="w-[200px]">
                        {
                            (selectedSourceType === "Agency" ||
                                selectedSourceType === "Company") && (

                                <Form.Item name="source" label="Source Name" rules={[{ required: true, message: "Please Select Source Name" }]}>
                                    <Select
                                        options={selectedSourceType === "Agency" ? agenciesOptions : companyOptions}
                                        className="w-[100%] "
                                        placeholder="Select Source Name"

                                    ></Select>
                                </Form.Item>

                            )
                        }
                    </div>

                    <div className="mt-[30px] flex items-center ">
                        {
                            afterRoomConfirm ?
                                null
                                :
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={availabilitySearchResults?.isPending}
                                        disabled={searchButtonDisable}
                                    // onClick={()=>setSearchButtonDisable(true)}
                                    >
                                        Search
                                    </Button>
                                </Form.Item>
                        }
                    </div>
                </div>

            </Form>

        </Card>
    )
}

export default ReservationForm;