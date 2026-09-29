import { Button, Card } from "antd";
import ActiveAdmins from "./ActiveAdmins";
import { MdWarningAmber } from "react-icons/md";
import { useEffect, useState } from "react";
import ConfirmModal from "./ConfirmModal";
import ReactTimer from "../../component/ReactTimer/ReactTimer";
import { activeAdmins } from "../../api/nightAuditApi";
import useInfiniteApiQuery from "../../hooks/useInfiniteApiQuery";
import { useLocation, useNavigate } from "react-router-dom";
import { spinLoadingCenter } from "../../variables/constants";
import Loader from "../../component/Loader/Loader";

const NightAudit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [forceLogout, setForceLogout] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [step, setStep] = useState("startNightAudit");
    const [finishCountDown, setFinishCountDown] = useState(false);

    const {
        data: activeAdminDatas,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteApiQuery({
        fetchQueryName: "activeAdmins",
        fetchQueryFunction: activeAdmins,
        params: {perPage: 15},
    });

    const isLocked = activeAdminDatas?.pages[0]?.systemLock?.isLocked;
    const checkStatus = activeAdminDatas?.pages[0]?.nightAudit?.auditStatus;
    const businessDate = activeAdminDatas?.pages[0]?.nightAudit?.businessDate;
    const targetBusinessDate = activeAdminDatas?.pages[0]?.nightAudit?.targetBusinessDate;
    const nextStep = activeAdminDatas?.pages[0]?.nightAudit?.nextStep;

    const expectedBusinessDate =
        checkStatus === "not_started"
            ? targetBusinessDate
            : checkStatus === "in_progress"
                ? businessDate
                : checkStatus === "completed" && nextStep === "create_new_day"
                    ? businessDate
                    : checkStatus === "completed" && nextStep === "start"
                        ? targetBusinessDate
                        : null;

    useEffect(() => {
        if (isLocked && expectedBusinessDate) {
            localStorage.setItem(
                "nightAudit",
                JSON.stringify({
                    isLocked: isLocked,
                    businessDate: expectedBusinessDate,
                    auditStatus: checkStatus,
                    isConfirm: false,
                })
            );
            navigate("/night-audit/pre-audit-check");
        }
    }, [isLocked, navigate, businessDate]);

    if (!activeAdminDatas || isFetching || isLocked) {
        return (
            <div className={spinLoadingCenter}>
                <Loader />
            </div>
        );
    }

    return (
        <>
            <div className="sticky w-full px-6 py-2">
                {
                    step === "startNightAudit" &&
                    <div>
                        <div>
                            <Card
                                title={
                                    <div className="text-center w-full">
                                        Night Audit
                                    </div>
                                }
                            >
                                {
                                    forceLogout ?
                                        <div>
                                            <p className="text-center">The Count-down begins. This alerts the active admin to log out automatically.</p>

                                            <div className="flex justify-center items-center w-full h-full bg-[#FFF1F0] my-5 rounded-sm py-2 sm:p-3">
                                                <MdWarningAmber className="!font-bold !text-[#CF1322] text-xl " />
                                                <p className="!font-bold !text-[#CF1322] ms-3">
                                                    The system will be locked for all admins during the audit.
                                                    Admins will remain logged in but will not be able to perform any operations until the audit is complete.</p>
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
                                                The Night Audit will close the current business date, including its accounting, transactions, and operations.
                                                The system will be temporarily locked during the audit. Once the Night Audit is complete, the system will be unlocked and ready for the next business date.
                                            </p>

                                            <ActiveAdmins
                                                activeAdminDatas={activeAdminDatas}
                                                isFetching={isFetching}
                                                isFetchingNextPage={isFetchingNextPage}
                                                fetchNextPage={fetchNextPage}
                                                hasNextPage={hasNextPage}
                                            />
                                            <div className="sticky bottom-1 flex justify-end bg-gray-50 dark:bg-[#121111] py-1 px-6 z-10 flex flex-col">
                                                <div className="flex justify-center items-center w-full h-full bg-[#FFF1F0] my-5 rounded-sm py-2 sm:p-3">
                                                    <MdWarningAmber className="!font-bold !text-[#CF1322] text-xl" />
                                                    <p className="!font-bold !text-[#CF1322] ms-3 ">
                                                        The system will be locked for all admins during the audit.
                                                        Admins will remain logged in but will not be able to perform any operations until the audit is complete.</p>
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
                                        </div>
                                }
                            </Card>
                        </div>
                    </div>
                }

                <ConfirmModal
                    open={confirmModal}
                    onCancel={() => setConfirmModal(false)}
                    activeAdminDatas={activeAdminDatas}
                />

            </div>
        </>

    )
}

export default NightAudit;