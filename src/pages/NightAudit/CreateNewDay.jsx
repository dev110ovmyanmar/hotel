import { Button, Card, DatePicker, Form } from "antd";
import dayjs from "dayjs";
import HaveANiceDay from "./HaveANiceDay";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { appSelector } from "../../services/appSlice";
import { useApiMutation } from "../../hooks/useApiMutation";
import { clickCreateNewDay, systemUnlock } from "../../api/nightAuditApi";
import Toast from "../../component/Toast/Toast";
import { CalendarRange } from "lucide-react";
import { addDays } from "../../variables/constants";

const CreateNewDay = ({
    createNewDayClick,
    preAuditChecksData
}) => {
    const nextBusinessDate = addDays(preAuditChecksData?.businessDate, 1);

    const { collapsed, openDrawer } = useSelector(appSelector);
    const isCollapsed = collapsed && !openDrawer;

    const [haveNiceDay, setHaveNiceDay] = useState(false);

    const createNewDayMutate = useApiMutation({
        mutationFn: clickCreateNewDay,
        // invalidateKeys: [["admins"]],
    });

    // System Unlock Mutation
    const systemUnlockMutation = useApiMutation({
        mutationFn: systemUnlock,
        options: {
            onSuccess: (data) => {
                Toast.success("System Unlocked successfully");
                setHaveNiceDay(true);
                createNewDayClick()
            },
            onError: (error) => {
                console.error("System lock error:", error);
                Toast.error(error?.response?.data?.error?.text || "Failed to unlock system");
            },
        },
    });

    const handleNext = () => {
        createNewDayMutate.mutate({
            businessDate : nextBusinessDate
        })
        // systemUnlockMutation.mutate();
        // createNewDayClick()

    };

    // useEffect(() => {
    //     if (haveNiceDay) {
    //         const timer = setTimeout(() => {
    //             window.location.href = '/dashboard';
    //         }, 5000); 

    //         return () => clearTimeout(timer);
    //     }
    // }, [haveNiceDay]);

    return (
        <>
            <div className="flex justify-center px-4 sm:px-6 lg:px-8">
                <Card
                    title="Create New Day"
                    className="
                        w-full
                        sm:w-[90%]
                        md:w-[75%]
                        lg:w-[60%]
                        xl:w-[50%]
                        !border-blue-200
                        !bg-blue-50
                        !text-gray-500
                    "
                >
                    {/* Content */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-x-6">
                        <div className="flex justify-center sm:justify-start">
                            <CalendarRange
                                className="h-7 w-7 shrink-0 text-blue-500"
                            />
                        </div>

                        <div className="min-w-0 text-center sm:text-left">
                            <div className="font-medium">
                                New Business Day
                            </div>

                            <div className="mt-1 font-semibold text-gray-700 break-words">
                                {nextBusinessDate}
                            </div>

                            <div className="mt-2 text-sm leading-6 text-gray-500">
                                This system will automatically be ready
                                for the next day after closing.
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-6 flex justify-center sm:justify-end">
                        <Button
                            type="primary"
                            onClick={handleNext}
                            loading={createNewDayMutate.isPending}
                            className="
                                w-full sm:w-auto
                                !bg-[#4F63A8]
                                hover:!bg-[#3F5295]
                                !border-[#4F63A8]
                                hover:!border-[#3F5295]
                            "
                        >
                            Next
                        </Button>
                    </div>
                </Card> 
            </div>
        </>
    )
}

export default CreateNewDay;

// {haveNiceDay ? (
//                 <div
//                     className={`fixed top-16 right-0 bottom-0 ${isCollapsed ? "left-20" : "left-60"
//                         }`}
//                 >
//                     <div className="w-full h-full">
//                         <HaveANiceDay />
//                     </div>
//                 </div>
//             )
//                 :
//                 <div className="flex justify-center">
//                     <Card
//                         title="Create New Day"
//                         className="w-[50%]"

//                     >
//                         <Form
//                             form={form}
//                             layout="vertical"
//                             initialValues={{
//                                 nextWorkingDate: nextDay
//                             }}
//                         >
//                             <Form.Item
//                                 label="Next Working Date"
//                                 name="nextWorkingDate"
//                             >
//                                 <DatePicker
//                                     style={{ width: "100%" }}
//                                     disabledDate={disabledDate}
//                                     showToday={false}
//                                     format="DD-MM-YYYY"
//                                 />
//                             </Form.Item>

//                             <div className="flex justify-end">
//                                 <Button
//                                     type="primary"
//                                     onClick={handleNext}
//                                     loading={systemUnlockMutation.isPending}
//                                 >
//                                     Next
//                                 </Button>
//                             </div>
//                         </Form>

                        
//                     </Card>
//                 </div>
//             }
