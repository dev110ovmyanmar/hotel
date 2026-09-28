import { Button, Card, Col, Row } from "antd";
import { useState } from "react";
import { useApiMutation } from "../../hooks/useApiMutation";
import { clickCreateNewDay } from "../../api/nightAuditApi";
import Toast from "../../component/Toast/Toast";
import { CalendarRange, CheckCircle2, MoveRightIcon, Play } from "lucide-react";
import { addDays } from "../../variables/constants";
import { InfoCircleOutlined, LockFilled, SwapRightOutlined } from "@ant-design/icons";
import ConfirmCreateNewDayModal from "./CreateNewDay/ConfirmCreateNewDayModal";
import { useNavigate } from "react-router-dom";

const CreateNewDay = ({
    preAuditChecksData
}) => {
    const navigate = useNavigate();
    const currentBusinessDate = preAuditChecksData?.businessDate;
    const nextBusinessDate = addDays(preAuditChecksData?.businessDate, 1);

    const [openCreateNewDayModal, setOpenCreateNewDayModal] = useState(false);
    const [newDayCreated, setNewDayCreated] = useState(false);

    const createNewDayMutate = useApiMutation({
        mutationFn: clickCreateNewDay,
        // invalidateKeys: [["admins"]],
    });

    // System Unlock Mutation
    // const systemUnlockMutation = useApiMutation({
    //     mutationFn: systemUnlock,
    //     options: {
    //         onSuccess: (data) => {
    //             Toast.success("System Unlocked successfully");
    //             setHaveNiceDay(true);
    //             createNewDayClick()
    //         },
    //         onError: (error) => {
    //             console.error("System lock error:", error);
    //             Toast.error(error?.response?.data?.error?.text || "Failed to unlock system");
    //         },
    //     },
    // });

    const handleNext = () => {
        createNewDayMutate.mutate({
            businessDate: currentBusinessDate
        },
            {
                onSuccess: () => {
                    setNewDayCreated(true)
                    localStorage.removeItem("nightAudit");
                    localStorage.removeItem("isConfirmed");  
                    Toast.success("New business day created successfully!");
                    navigate("/night-audit", { replace: true });
                }
            }
        )
    };

    const cardDesign = `flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-x-6 !bg-blue-50 !text-gray-500 p-3 rounded`;

    return (
        <>
            <ConfirmCreateNewDayModal
                cardDesign={cardDesign}
                currentBusinessDay={currentBusinessDate}
                nextBusinessDay={nextBusinessDate}
                open={openCreateNewDayModal}
                onCancel={() => setOpenCreateNewDayModal(false)}
                onOk={handleNext}
                confirmLoading={createNewDayMutate.isPending}
            />


            <div className="flex justify-center px-4 sm:px-6 lg:px-8">
                {newDayCreated ? (
                    <Card className="w-full sm:w-[90%] md:w-[75%] lg:w-[60%] xl:w-[50%]">
                        <div className="flex flex-col justify-center items-center text-center">
                            <CheckCircle2
                                className="!text-green-600"
                                size={22}
                            />

                            <div className="text-sm sm:text-base font-bold">
                                New Day Created Successfully!
                            </div>

                            <div className="text-[11px] sm:text-xs md:text-sm">
                                The business date has been updated to
                                <span className="font-bold mx-1">
                                    {nextBusinessDate}
                                </span>
                                and the system is now unlocked.
                            </div>
                        </div>

                        <div className="!bg-blue-50 !text-gray-500 p-3 rounded my-3">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={12}>
                                    <div className="flex items-center gap-x-3">
                                        <CalendarRange
                                            className="h-5 w-5 shrink-0 !text-blue-500"
                                        />

                                        <div>
                                            <div className="text-[11px] sm:text-xs font-medium">
                                                Current Business Date
                                            </div>

                                            <div className="text-sm sm:text-base font-bold leading-5 text-gray-500">
                                                {currentBusinessDate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} md={12}>
                                    <div className="flex items-center gap-x-3">
                                        <LockFilled
                                            className="h-5 w-5 shrink-0 !text-blue-500"
                                        />

                                        <div>
                                            <div className="text-[11px] sm:text-xs font-medium">
                                                System Status
                                            </div>

                                            <div className="text-sm sm:text-base font-bold leading-5 text-green-600">
                                                Unlocked
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                type="primary"
                                className="
                        w-full sm:w-auto
                        !bg-[#4F63A8]
                        hover:!bg-[#3F5295]
                        !border-[#4F63A8]
                        hover:!border-[#3F5295]
                    "
                            >
                                <span className="text-xs sm:text-sm">
                                    Go to Dashboard
                                </span>
                                <MoveRightIcon size={16} />
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card
                        title={
                            <div className="!flex !flex-row !gap-x-3 !py-5">
                                <div className="!flex !justify-center sm:!justify-start">
                                    <CalendarRange
                                        className="!h-6 !w-6 sm:!h-7 sm:!w-7 !shrink-0 !text-blue-500"
                                    />
                                </div>

                                <div className="-mt-1 !min-w-0 !text-center sm:!text-left">
                                    <div className="text-sm sm:text-base font-bold">
                                        Create New Day
                                    </div>

                                    <div className="text-[11px] sm:text-xs !leading-5 !text-gray-500">
                                        Create a new business day and unlock the system
                                        for the next day.
                                    </div>
                                </div>
                            </div>
                        }
                        className="
                w-full
                sm:w-[90%]
                md:w-[75%]
                lg:w-[60%]
                xl:w-[50%]
                !border-blue-200
            "
                    >
                        <div className={cardDesign}>
                            <div className="flex justify-center sm:justify-start">
                                <InfoCircleOutlined
                                    className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 !text-blue-500"
                                />
                            </div>

                            <div className="min-w-0 text-center sm:text-left">
                                <div className="text-xs sm:text-sm font-medium">
                                    This action will:
                                </div>

                                <ul className="list-disc pl-5 text-[11px] sm:text-xs md:text-sm leading-5">
                                    <li>Create a new business date (next day)</li>
                                    <li>Unlock the system for normal operation</li>
                                    <li>Reset Night Audit status</li>
                                </ul>
                            </div>
                        </div>

                        <div className="!bg-blue-50 !text-gray-500 p-3 rounded my-3">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={10}>
                                    <div className="flex items-center gap-x-3">
                                        <CalendarRange
                                            className="h-5 w-5 shrink-0 !text-blue-500"
                                        />

                                        <div>
                                            <div className="text-[11px] sm:text-xs font-medium">
                                                Current Business Date
                                            </div>

                                            <div className="text-sm sm:text-base font-bold leading-5 text-gray-500">
                                                {currentBusinessDate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col
                                    xs={24}
                                    md={2}
                                    className="!text-center md:!text-left !text-sm sm:!text-base !font-bold"
                                >
                                    <SwapRightOutlined />
                                </Col>

                                <Col xs={24} md={10}>
                                    <div className="flex items-center gap-x-3">
                                        <CalendarRange
                                            className="h-5 w-5 shrink-0 !text-blue-500"
                                        />

                                        <div>
                                            <div className="text-[11px] sm:text-xs font-medium">
                                                Next Business Date
                                            </div>

                                            <div className="text-sm sm:text-base font-bold leading-5 text-gray-500">
                                                {nextBusinessDate}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                onClick={() => setOpenCreateNewDayModal(true)}
                                className="
                                        w-full sm:w-auto
                                        !bg-[#4F63A8]
                                        hover:!bg-[#3F5295]
                                        !border-[#4F63A8]
                                        hover:!border-[#3F5295]
                                      "
                            >
                                <Play size={15} />
                                <span className="text-xs sm:text-sm">
                                    Create New Day
                                </span>
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </>
    )
}

export default CreateNewDay;

