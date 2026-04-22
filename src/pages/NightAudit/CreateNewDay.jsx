import { Button, Card, DatePicker, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from "react-icons/io";



const CreateNewDay = ({
    createNewDayClick
}) => {

    const disabledDate = (current) => {
        return current && current <= dayjs().startOf("day")
    };

    const [form] = Form.useForm();

    const selectedDate = Form.useWatch("nextWorkingDate", form);

    return (
        <div className="flex justify-center">
            <Card
                title="Create New Day"
                className="w-[50%]"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Next Working Date"
                        name="nextWorkingDate"
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            disabledDate={disabledDate}
                            showToday={false}
                        />
                    </Form.Item>

                    {
                        selectedDate &&
                        <div className="w-full h-full bg-[#F0FDF4] p-3 rounded-sm my-3">
                            <div className="flex">
                                <IoIosCheckmarkCircle fontSize={20} className="font-bold !text-[#389E0D]" />
                                {/* <IoIosCheckmarkCircleOutline fontSize={20}  className="!text-green-400"/> */}
                                <p className="font-bold text-[#166534] mx-2">Have A nice day!</p>
                            </div>
                        </div>
                    }

                    <div className="flex justify-end">
                        <Button className="!bg-[#999999]">
                            Close
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}

export default CreateNewDay;