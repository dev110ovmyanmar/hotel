import { Button, Card, DatePicker, Form, Select, TimePicker } from "antd";
import useApiQuery from "../../hooks/useApiQuery";
import { queryClient } from "../../app/queryClient";
import dayjs from "dayjs";
import { availabilitySearch, reservationMeta } from "../../api/reservationSectionApi";
import { useEffect, useState } from "react";
import { useApiMutation } from "../../hooks/useApiMutation";
import { data } from "react-router-dom";

const { RangePicker } = DatePicker;


const ReservationForm = ({
    form,
    afterRoomConfirm,
    availabilitySearchResults,
    setReservationFormValues,
}) => {
    const dateRange = Form.useWatch("filter", form);

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

    const checkInDate = dateRange?.[0]?.format("YYYY-MM-DD");
    const checkOutDate = dateRange?.[1]?.format("YYYY-MM-DD");

    const totalNights = checkInDate && checkOutDate ? dayjs(checkOutDate).diff(dayjs(checkInDate), "day") : 0;

    const bookedViaOptions = initData?.statuses?.booked_via.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];


    const sourceTypeOptions = initData?.statuses?.source_type.map((item) => ({
        label: item.name,
        value: item.uuid,
    })) || [];

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
        };

        availabilitySearchResults.mutate(modifiedValues);
    };

    const handleChange = (value, option) => {
        setSelectedSourceType(option?.label);
    };

    // useEffect(() => {
    //     if (bookedViaOptions?.length > 0 || sourceTypeOptions?.length > 0) {
    //         form.setFieldsValue({
    //             bookedVia: bookedViaOptions?.[0]?.value,
    //             sourceType: sourceTypeOptions?.[0]?.value,
    //         });
    //     }
    // }, [bookedViaOptions, sourceTypeOptions]);

    useEffect(() => {
        if (totalNights) {
            form.setFieldsValue({
                totalNight: totalNights
            })
        }
    }, [totalNights])

    // Range Picker
    const disabledDate = current => {
        return current < dayjs().startOf('day');
    };

    return (
        <Card >
            <Form
                form={form}
                onFinish={searchSubmit}
                layout="vertical"
                initialValues={{
                    bookedVia: bookedViaOptions?.[0]?.value,
                    sourceType: sourceTypeOptions?.[0]?.value,
                    filter: [
                        dayjs().hour(14).minute(0), // check-in
                        dayjs().add(1, "day").hour(12).minute(0), // check-out
                    ],
                }}
            >
                <h1 className="text-lg font-bold my-2">Create New Reservation</h1>
                <div className="flex gap-6 justify-between">
                    <div className="flex-3">
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

                    <div className="flex items-center">
                        <Form.Item name="totalNight" label="Nights" className="mb-0" rules={[{ required: true }]}>
                            <div className="w-[61px] h-[32px] bg-[#fafafa] rounded-md flex flex-col justify-center items-center">

                                <p className="text-xs leading-none">{totalNights}</p>
                                <p className="text-xs leading-none">Nights</p>

                            </div>
                        </Form.Item>
                    </div>

                    <div className="flex-2">
                        <Form.Item name="bookedVia" label="Booking Source" rules={[{ required: true, message: "Please Select Booking Source" }]}>
                            <Select
                                options={bookedViaOptions}
                                className="w-[100%] "
                                placeholder="Select Booked Via"
                            >
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex-2">
                        <Form.Item name="sourceType" label="Source Type" rules={[{ required: true, message: "Please Select Source Type" }]}>
                            <Select
                                options={sourceTypeOptions}
                                className="w-[100%]"
                                onChange={handleChange}
                                placeholder="Select Source Type"
                            ></Select>
                        </Form.Item>
                    </div>

                    <div className="flex-1">
                        {
                            (selectedSourceType === "Agency" ||
                                selectedSourceType === "Company") && (

                                <Form.Item name="source" label="Booking Source" rules={[{ required: true, message: "Please Select Booking Source" }]}>
                                    <Select
                                        options={selectedSourceType === "Agency" ? agenciesOptions : companyOptions}
                                        className="w-[100%] "
                                        placeholder="Select Booking Source"

                                    ></Select>
                                </Form.Item>

                            )
                        }
                    </div>

                    <div className="mt-7">
                        {
                            afterRoomConfirm ?
                                null
                                :
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={availabilitySearchResults?.isPending}>
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