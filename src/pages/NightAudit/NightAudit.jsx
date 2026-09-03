import { Button, Card, DatePicker } from "antd";
import ActiveAdmins from "./ActiveAdmins";
import { MdWarningAmber } from "react-icons/md";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ReactTimer from "../../component/ReactTimer/ReactTimer";
import dayjs from "dayjs";


const NightAudit = () => {
    const [forceLogout, setForceLogout] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [step, setStep] = useState("startNightAudit");
    const [finishCountDown, setFinishCountDown] = useState(false);
    const todayDate = dayjs().format("DD MMM YYYY");

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

            <ConfirmModal
                open={confirmModal}
                onCancel={() => setConfirmModal(false)}
            />

        </div>
    )
}

export default NightAudit;