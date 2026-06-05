import { Button, Card, DatePicker, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from "react-icons/io";
import HaveANiceDay from "./HaveANiceDay";
import { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';



const CreateNewDay = ({
    createNewDayClick
}) => {

    const disabledDate = (current) => {
        return current && current <= dayjs().startOf("day")
    };

    const [form] = Form.useForm();

    const selectedDate = Form.useWatch("nextWorkingDate", form);

    const nextDay = dayjs().add(1, "add");

    const [haveNiceDay, setHaveNiceDay] = useState(false);

    useEffect(() => {
        if (haveNiceDay) {
            const timer = setTimeout(() => {
                // Optional: redirect or reload page to initialize the new day
                window.location.href = '/dashboard';
            }, 5000); // Shows the message for 3.5 seconds

            return () => clearTimeout(timer);
        }
    }, [haveNiceDay]);

   

    

    return (
        <>
            <div className="flex justify-center">
                <Card
                    title="Create New Day"
                    className="w-[50%]"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            nextWorkingDate: nextDay
                        }}
                    >
                        <Form.Item
                            label="Next Working Date"
                            name="nextWorkingDate"
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                disabledDate={disabledDate}
                                showToday={false}
                                format="DD-MM-YYYY"
                            />
                        </Form.Item>

                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                onClick={() => setHaveNiceDay(true)}
                            >
                                Next
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>

            {
                haveNiceDay ?
                    <HaveANiceDay /> :
                    null
            }
        </>
    )
}

export default CreateNewDay;

// {
//     selectedDate &&
//         <div className="w-full h-full bg-[#F0FDF4] p-3 rounded-sm my-3">
//             <div className="flex">
//                 <IoIosCheckmarkCircle fontSize={20} className="font-bold !text-[#389E0D]" />
//                 <p className="font-bold text-[#166534] mx-2">Have A nice day!</p>
//             </div>
//         </div>
// }