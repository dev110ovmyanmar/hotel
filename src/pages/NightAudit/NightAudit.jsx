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

const NightAudit = () => {
    const [forceLogout, setForceLogout] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [colorChange, setColorChange] = useState("");
    const [step, setStep] = useState("startNightAudit");
    const [currentValue, setCurrentValue] = useState(0);

    return (
        <div className="w-full px-6 py-2">
            {
                step === "startNightAudit" &&
                <div>
                    <div className="flex justify-end mb-3">
                        <DatePicker />
                    </div>

                    <div>
                        <Card
                            title={
                                <div className="text-center w-full">
                                    Perform Night Audit for 21/12/2025
                                </div>
                            }

                        >
                            {
                                forceLogout ?
                                    <div>
                                        <p className="text-center">The Count-down begins. This alerts the active admin to log out automatically.</p>

                                        <div className="flex justify-center items-center w-full h-full bg-[#FFF1F0] my-5 rounded-sm py-2">
                                            <MdWarningAmber className="!font-bold !text-[#CF1322] text-xl" />
                                            <p className="!font-bold !text-[#CF1322] ms-3">All admins are being informed that the Night Audit is going to start. They will be logged out forcefully in 3 minutes.</p>
                                        </div>

                                        <div className="text-center">
                                            <span className="w-full h-full bg-gray-500 p-3 rounded-sm">01 Min : 00 Sec</span>
                                        </div>

                                        <div className="flex justify-center my-6">
                                            <Button type="primary" onClick={() => {
                                                setCurrentValue(0);
                                                setStep("checkBooking");
                                            }}>Start Night Audit</Button>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <p className="mb-3">The Night Audit will close the current day's accounting, transactions & operations. You can start the next day's accounting and operations after Night Audit is complete.</p>

                                        <ActiveAdmins />

                                        <div className="flex justify-center items-center w-full h-full bg-[#FFF1F0] my-5 rounded-sm py-2">
                                            <MdWarningAmber className="!font-bold !text-[#CF1322] text-xl" />
                                            <p className="!font-bold !text-[#CF1322] ms-3">All admins are being informed that the Night Audit is going to start. They will be logged out forcefully in 3 minutes.</p>
                                        </div>

                                        <div className="flex justify-center">
                                            <Button className="!bg-[#CF1322] !text-[#FFFFFF]" onClick={() => setConfirmModal(true)}>Forcefully Logout Admins</Button>
                                        </div>
                                    </div>
                            }

                        </Card>
                    </div>
                </div>
            }


            {
                step === "checkBooking" ?
                    <>
                        <CheckBookingHeader colorClick={currentValue} />
                        <CheckBookingTable colorCheckBooking={() => {
                            setCurrentValue(1);
                            setStep("roomChargeTable")
                        }} />
                    </>
                    :
                    step === "roomChargeTable" ?
                        <>
                            <CheckBookingHeader colorClick={currentValue} />
                            <RoomChargeTable roomChargeClick={() => {
                                setCurrentValue(2);
                                setStep("unsettledFolios")
                            }} />
                        </>
                        :
                        step === "unsettledFolios" ?
                            <>
                                <CheckBookingHeader colorClick={currentValue} />
                                <UnsettledFolios unsettledFolioClick={() => {
                                    setCurrentValue(3);
                                    setStep("nightAuditPosting")
                                }} />
                            </>
                            : step === "nightAuditPosting" ?
                                <>
                                    <CheckBookingHeader colorClick={currentValue} />
                                    <NightAuditPosting nightAuditPostingClick={() => {
                                        setCurrentValue(4);
                                        setStep("createNewDay")
                                    }} />
                                </>
                                :
                                step === "createNewDay" ?
                                    <>
                                        <CheckBookingHeader colorClick={currentValue} />
                                        <CreateNewDay createNewDayClick={() => {
                                            setCurrentValue(5)

                                        }} />
                                    </>
                                    :
                                    null
            }



            <ConfirmModal
                open={confirmModal}
                onCancel={() => setConfirmModal(false)}
                onOk={() => { setForceLogout(true); setConfirmModal(false) }}
            />

        </div>
    )
}

export default NightAudit;