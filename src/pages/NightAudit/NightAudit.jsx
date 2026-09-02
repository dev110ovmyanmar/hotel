import { Button, Card, DatePicker } from "antd";
import ActiveAdmins from "./ActiveAdmins";
import { MdWarningAmber } from "react-icons/md";
import { useState } from "react";
import CheckBookingHeader from "./CheckBookingHeader";
import CheckBookingTable from "./CheckBookingTable";
import RoomChargeTable from "./RoomChargeTable";
import UnsettledFolios from "./UnsettledFolios";
import NightAuditPosting from "./NightAuditPosting";
import CreateNewDay from "./CreateNewDay";
import ConfirmModal from "./ConfirmModal";
import ReactTimer from "../../component/ReactTimer/ReactTimer";
import dayjs from "dayjs";
import { useApiMutation } from "../../hooks/useApiMutation";
import { preAuditCheck, systemLock, systemUnlock } from "../../api/nightAuditApi";
import Toast from "../../component/Toast/Toast";
import { SYSTEM_LOCK_KEY } from "../../variables/constants";
import IssueAndWarningCard from "./IssueAndWarningCard";
import useApiQuery from "../../hooks/useApiQuery";
import PreAuditTable from "./PreAuditTable";

const NightAudit = () => {
    const [forceLogout, setForceLogout] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [colorChange, setColorChange] = useState("");
    const [step, setStep] = useState("startNightAudit");
    const [currentValue, setCurrentValue] = useState(0);
    const [finishCountDown, setFinishCountDown] = useState(false);
    const todayDate = dayjs().format("DD MMM YYYY");
    const [hideSteps, setHideSteps] = useState(false);
    // System Lock Mutation
    const systemLockMutation = useApiMutation({
        // mutationFn: systemLock,
        mutationFn: systemUnlock,
        shouldInvalidate: false,
        options: {
            onSuccess: (data) => {
                Toast.success("System locked successfully");
                setConfirmModal(false);
                setCurrentValue(0);
                setStep("preAuditCheck");
                console.log("Step set to checkBooking");
                window.dispatchEvent(
                    new CustomEvent("breadcrumb_updated", {
                        detail: {
                            stepValue: 0,
                            nightAuditStarted: true,
                        },
                    })
                );
            },
            onError: (error) => {
                Toast.error(error?.response?.data?.error?.text || "Failed to lock system");
            },
        },
    });

    const handleForceLogout = () => {
        systemLockMutation.mutate({
            systemLockKey: SYSTEM_LOCK_KEY.nightAudit
        });
    };

    const { data: preAuditChecksData, isLoading, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate: '2026-09-02'
        },
    });
    console.log(preAuditChecksData, "preAuditChecksData")

    return (
        <div className="w-full px-6 py-2">
            {
                step === "startNightAudit" &&
                <div>
                    <div className="flex justify-end mb-3">
                        <DatePicker defaultValue={dayjs()} />
                    </div>

                    <div>
                        <Card
                            title={
                                <div className="text-center w-full">
                                    Night Audit — Closing Business Date:
                                    <span className="ms-1">{todayDate}</span>
                                </div>
                            }

                        >
                            {
                                forceLogout ?
                                    <div>
                                        <p className="text-center">The Count-down begins. This alerts the active admin to log out automatically.</p>

                                        <div className="flex justify-center items-center w-full h-full bg-[#FFF1F0] my-5 rounded-sm py-2 sm:p-3">
                                            <MdWarningAmber className="!font-bold !text-[#CF1322] text-xl " />
                                            <p className="!font-bold !text-[#CF1322] ms-3">The system will be locked for all admins during the audit. Admins will remain logged in but will not be able to perform any operations until the audit is complete.</p>
                                        </div>

                                        {
                                            !finishCountDown &&
                                            <ReactTimer onFinish={() => setFinishCountDown(true)} />
                                        }

                                        {
                                            finishCountDown &&
                                            <div className="flex justify-center my-6 ">
                                                <Button type="primary" onClick={() => {
                                                    setCurrentValue(0);
                                                    setStep("checkBooking");
                                                }}>Start Night Audit</Button>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div>
                                        <p className="mb-3">
                                            The Night Audit will close the current business date, including its accounting, transactions, and operations. The system will be temporarily locked during the audit. Once the Night Audit is complete, the system will be unlocked and ready for the next business date.
                                        </p>

                                        <ActiveAdmins />

                                        <div className="flex justify-center items-center w-full h-full bg-[#FFF1F0] my-5 rounded-sm py-2 sm:p-3">
                                            <MdWarningAmber className="!font-bold !text-[#CF1322] text-xl" />
                                            <p className="!font-bold !text-[#CF1322] ms-3 ">The system will be locked for all admins during the audit. Admins will remain logged in but will not be able to perform any operations until the audit is complete.</p>
                                        </div>

                                        <div className="flex justify-center">
                                            <Button
                                                className="!bg-[#CF1322] !text-[#FFFFFF]"
                                                onClick={() => setConfirmModal(true)}

                                            >
                                                Lock System & Start Night Audit
                                            </Button>
                                        </div>
                                    </div>
                            }

                        </Card>
                    </div>
                </div>
            }


            {
                step === "preAuditCheck" ?
                    <>
                        <CheckBookingHeader
                            colorClick={currentValue}
                            preAuditChecksData={preAuditChecksData}
                            preNightAudit={true}
                        />
                        <PreAuditTable colorCheckBooking={() => {
                            setCurrentValue(1);
                            setStep("checkBooking");
                            window.dispatchEvent(
                                new CustomEvent("breadcrumb_updated", {
                                    detail: {
                                        stepValue: 1,
                                    },
                                })
                            );
                        }}
                            preAuditChecksData={preAuditChecksData?.checks}
                        />
                        <IssueAndWarningCard preAuditChecksData={preAuditChecksData} />
                    </>
                    :
                    step === "checkBooking" ?
                        <>
                            <CheckBookingHeader colorClick={currentValue} preAuditChecksData={preAuditChecksData} />
                            <CheckBookingTable colorCheckBooking={() => {
                                setCurrentValue(2);
                                setStep("roomChargeTable");
                                window.dispatchEvent(
                                    new CustomEvent("breadcrumb_updated", {
                                        detail: {
                                            stepValue: 2,
                                        },
                                    })
                                );
                            }} />
                            <IssueAndWarningCard preAuditChecksData={preAuditChecksData}/>
                        </>
                        :
                        step === "roomChargeTable" ?
                            <>
                                <CheckBookingHeader colorClick={currentValue} preAuditChecksData={preAuditChecksData} />
                                <RoomChargeTable roomChargeClick={() => {
                                    setCurrentValue(3);
                                    setStep("unsettledFolios");
                                    window.dispatchEvent(
                                        new CustomEvent("breadcrumb_updated", {
                                            detail: {
                                                stepValue: 3,
                                            },
                                        })
                                    );
                                }} />
                                <IssueAndWarningCard preAuditChecksData={preAuditChecksData}/>
                            </>
                            :
                            step === "unsettledFolios" ?
                                <>
                                    <CheckBookingHeader colorClick={currentValue} preAuditChecksData={preAuditChecksData}/>
                                    <UnsettledFolios unsettledFolioClick={() => {
                                        setCurrentValue(4);
                                        setStep("nightAuditPosting");
                                        window.dispatchEvent(
                                            new CustomEvent("breadcrumb_updated", {
                                                detail: {
                                                    stepValue: 4,
                                                },
                                            })
                                        );
                                    }} />
                                </>
                                : step === "nightAuditPosting" ?
                                    <>
                                        <CheckBookingHeader colorClick={currentValue} preAuditChecksData={preAuditChecksData}/>
                                        <NightAuditPosting nightAuditPostingClick={() => {
                                            setCurrentValue(5);
                                            setStep("createNewDay");
                                            window.dispatchEvent(
                                                new CustomEvent("breadcrumb_updated", {
                                                    detail: {
                                                        stepValue: 5,
                                                    },
                                                })
                                            );
                                        }} />
                                    </>
                                    :
                                    step === "createNewDay" ?
                                        <>
                                            {
                                                !hideSteps &&
                                                <CheckBookingHeader colorClick={currentValue} preAuditChecksData={preAuditChecksData}/>
                                            }
                                            <CreateNewDay createNewDayClick={() => {
                                                setCurrentValue(5);
                                                setHideSteps(true)

                                            }} />
                                        </>
                                        :
                                        null
            }

            <ConfirmModal
                open={confirmModal}
                onCancel={() => setConfirmModal(false)}
                onOk={handleForceLogout}
                confirmLoading={systemLockMutation.isPending}

            />

        </div>
    )
}

export default NightAudit;