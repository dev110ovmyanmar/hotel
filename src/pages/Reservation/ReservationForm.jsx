import { Button, Card, DatePicker, Select, TimePicker } from "antd";


const ReservationForm = ({
    onSearch
}) => {

    return (
        <Card >
            <h1 className="text-lg font-bold my-2">Create New Reservation</h1>
            <div className="flex w-full gap-2 my-5">
                <div className="flex-1">
                    <p className="mb-2">Check-in Date</p>
                    <DatePicker className="w-[100%] " />
                </div>

                <div className="flex-1">
                    <p className="mb-2">Check-in Time</p>
                    <TimePicker className="w-[100%] " />
                </div>

                <div className="mt-[30px] flex items-center">
                    <div className="w-[61px] h-[32px] bg-gray-400 rounded-md flex flex-col justify-center items-center">
                        <p className="text-xs leading-none">6</p>
                        <p className="text-xs leading-none">Nights</p>
                    </div>
                </div>

                <div className="flex-1">
                    <p className="mb-2">Check-out Date</p>
                    <DatePicker className="w-[100%] " />
                </div>

                <div className="flex-1">
                    <p className="mb-2">Check-out Time</p>
                    <TimePicker className="w-[100%] " />
                </div>

            </div>

            <div className="flex w-full gap-2 my-5">
                <div className="flex-1">
                    <p className="mb-2">Adult</p>
                    <Select
                        defaultValue="1"
                        options={[
                            { value: "1", label: "1" },
                            { value: "2", label: "2" },
                        ]}
                        className="w-[100%] "
                    >

                    </Select>
                </div>

                <div className="flex-1">
                    <p className="mb-2">Child</p>
                    <Select
                        defaultValue="1"
                        options={[
                            { value: "1", label: "1" },
                            { value: "2", label: "2" },
                        ]}
                        className="w-[100%] "
                    ></Select>
                </div>

                <div className="flex-1">
                    <p className="mb-2">Source Type</p>
                    <Select
                        defaultValue="direct"
                        options={[
                            { value: "direct", label: "Direct" },
                            { value: "indirect", label: "Indirect" },
                        ]}
                        className="w-[100%] "
                    ></Select>
                </div>

                <div className="flex-1">
                    <p className="mb-2">Booking Source</p>
                    <Select
                        defaultValue="officalWebsite"
                        options={[
                            { value: "officalWebsite", label: "Offical Website" },
                            { value: "agency", label: "Agency" },
                        ]}
                        className="w-[100%] "
                    ></Select>
                </div>

            </div>

            <div className="flex justify-end">
                <Button type="primary" onClick={onSearch}>Search</Button>
            </div>

        </Card>
    )
}

export default ReservationForm;