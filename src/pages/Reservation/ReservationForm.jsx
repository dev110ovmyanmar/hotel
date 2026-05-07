import { Button, Card, DatePicker, Form, Select, TimePicker } from "antd";
import useApiQuery from "../../hooks/useApiQuery";
import { queryClient } from "../../app/queryClient";
import dayjs from "dayjs";
import { availabilitySearch, reservationMeta } from "../../api/availabilitySearchApi";
import { useEffect, useState } from "react";
import { useApiMutation } from "../../hooks/useApiMutation";


const ReservationForm = ({
    afterRoomConfirm,
    availabilitySearchResults,
    setReservationFormValues
}) => {

    const [form] = Form.useForm();

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

    const checkInDate = Form.useWatch(["filter", "checkinDate"], form);
    const checkOutDate = Form.useWatch(["filter", "checkoutDate"], form);

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
                checkinDate: values?.filter?.checkinDate ? dayjs(values?.filter?.checkinDate).format("YYYY-MM-DD") : null,
                checkoutDate: values?.filter?.checkoutDate ? dayjs(values?.filter?.checkoutDate).format("YYYY-MM-DD") : null,
            },
            bookedVia: {
                uuid: values.bookedVia,
            },
            sourceType: {
                uuid: values.sourceType,
            },
            source: {
                uuid: values.source,
            }
        };

        availabilitySearchResults.mutate(modifiedValues);
    };

    const handleChange = (value, option) => {
        setSelectedSourceType(option?.label);
    };

    useEffect(() => {
        form.setFieldsValue({
            checkInTime: dayjs(checkInTime, 'HH:mm:ss'),
            checkOutTime: dayjs(checkOutTime, 'HH:mm:ss'),
            totalNight: totalNights
        });
    }, [checkInTime, checkOutTime, totalNights]);

    return (
        <Card >
            <Form
                form={form}
                onFinish={searchSubmit}
                layout="vertical"
            >
                <h1 className="text-lg font-bold my-2">Create New Reservation</h1>
                <div className="flex w-full gap-2 my-5">
                    <div className="flex-1">
                        {/* <p className="mb-2">Check-in Date</p> */}
                        <Form.Item name={["filter", "checkinDate"]} label="Check-in Date">
                            <DatePicker
                                className="w-[100%] "
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </div>

                    <div className="flex-1">
                        {/* <p className="mb-2">Check-in Time</p> */}
                        <Form.Item name="checkInTime" label="Check-in Time">
                            <TimePicker
                                className="w-[100%]"
                                defaultValue={dayjs(checkInTime, 'HH:mm:ss')}
                                disabled={true}
                            />
                        </Form.Item>
                    </div>

                    <div className="flex-1">
                        {/* <p className="mb-2">Check-out Date</p> */}
                        <Form.Item name={["filter", "checkoutDate"]} label="Check-out Date">
                            <DatePicker
                                className="w-[100%]"
                                format="YYYY-MM-DD"
                            />
                        </Form.Item>
                    </div>

                    <div className="flex-1">
                        {/* <p className="mb-2">Check-out Time</p> */}
                        <Form.Item name="checkOutTime" label="Check-out Time">
                            <TimePicker
                                className="w-[100%] "
                                defaultValue={dayjs(checkOutTime, 'HH:mm:ss')}
                                // readOnly={true}
                                disabled={true}
                            />
                        </Form.Item>
                    </div>

                    <div className="flex items-center">
                        <Form.Item name="totalNight" label="Nights" className="mb-0">
                            <div className="w-[61px] h-[32px] bg-gray-400 rounded-md flex flex-col justify-center items-center">

                                <p className="text-xs leading-none">{totalNights}</p>
                                <p className="text-xs leading-none">Nights</p>

                            </div>
                        </Form.Item>
                    </div>

                </div>

                <div className="flex w-full gap-2 my-5">
                    <div className="flex-1">
                        {/* <p className="mb-2">Booked Via</p> */}
                        <Form.Item name="bookedVia" label="Booked Via">
                            <Select
                                // defaultValue="1"
                                options={bookedViaOptions}
                                className="w-[100%] "
                                placeholder="Select Booked Via"
                            >
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="flex-1">
                        {/* <p className="mb-2">Source Type</p> */}
                        <Form.Item name="sourceType" label="Source Type">
                            <Select
                                // defaultValue="direct"
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

                                <Form.Item name="source" label="Booking Source">
                                    <Select
                                        options={selectedSourceType === "Agency" ? agenciesOptions : companyOptions}
                                        className="w-[100%] "
                                        placeholder="Select Booking Source"

                                    ></Select>
                                </Form.Item>

                            )
                        }
                    </div>


                </div>

                {
                    afterRoomConfirm ?
                        null
                        :
                        <div className="flex justify-end">
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Search
                                </Button>
                            </Form.Item>
                        </div>
                }
            </Form>

        </Card>
    )
}

export default ReservationForm;