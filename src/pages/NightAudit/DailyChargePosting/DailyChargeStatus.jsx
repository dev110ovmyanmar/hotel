import { CloseCircleOutlined, ReloadOutlined, SafetyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { Calendar, CircleCheck } from "lucide-react";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { reloadDailyPostCharges } from "../../../api/nightAuditApi";
import { getNightAuditData, textSizeDependOnScreen } from "../../../variables/constants";
import RunPostingModal from "./RunPostingModal";
import { useState } from "react";

const DailyChargeStatus = ({
    dailyChargePostingData,
    preNightAudit
}) => {
    const [runPostingModalOpen, setRunPostingModalOpen] = useState(false);

    const dailyChargeDisabled = dailyChargePostingData?.charges.length <= 0;
    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 !border-l-0 !border-r-0`;

    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;

    const reloadPostCharge = useApiMutation({
        mutationFn: reloadDailyPostCharges,
        invalidateKeys: [["daily-charge-postings"]],
    });

    const retryPostCharge = () => {
        reloadPostCharge.mutate({
            businessDate
        },
            {
                onSuccess: () => {
                    setRunPostingModalOpen(false)
                }
            })
    };

    return (
        <div>
            <div>
                <div className="items-center grid lg:grid-cols-4 md:grid-cols-2 gap-x-5 !my-3 md:gap-y-3">
                    <Card
                        className={`!bg-[#EFF6FF] !text-[#314B99] !border-[#A1CFFF] ${cardDesign} !p-2`}
                    >
                        <div className="w-full">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div className="flex items-center gap-x-1">
                                    <Calendar className="shrink-0" />
                                    <span className={textSizeDependOnScreen}>
                                        Posting Date:
                                    </span>
                                </div>

                                <span className={`${textSizeDependOnScreen} text-center sm:text-right`}>
                                    {dailyChargePostingData?.businessDate}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className={`!border-gray-300 ${cardDesign}`}>
                        <div className="w-full max-w-md mx-auto text-center">
                            <div className="flex justify-between items-center gap-4">
                                <span className="shrink-0">Total</span>
                                <span className="text-right break-all">
                                    {dailyChargePostingData?.summary?.total}
                                </span>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <span className="shrink-0">Total Amount</span>
                                <span className="text-right break-all">
                                    {dailyChargePostingData?.summary?.totalAmount}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF4F1] !text-[#FF7800] !border-[#FFBD9F] ${cardDesign}`}>
                        <div className="w-full max-w-md mx-auto text-center">
                            <div className="flex justify-between items-center gap-4">
                                <span className="shrink-0">Posted</span>
                                <span className="text-right break-all">
                                    {dailyChargePostingData?.summary?.posted}
                                </span>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <span className="shrink-0">Posted Amount</span>
                                <span className="text-right break-all">
                                    {dailyChargePostingData?.summary?.postedAmount}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF1F0] !text-[#CF1322] !border-[#FFA39E] ${cardDesign}`}>
                        <div className="w-full max-w-md mx-auto text-center">
                            <div className="flex justify-between items-center gap-4">
                                <span className="shrink-0">Unposted </span>
                                <span className="text-right break-all">
                                    {dailyChargePostingData?.summary?.unposted}
                                </span>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <span className="shrink-0">Unposted Amount</span>
                                <span className="text-right break-all">
                                    {dailyChargePostingData?.summary?.unpostedAmount}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end my-4">
                <Button
                    type="primary"
                    onClick={() => setRunPostingModalOpen(true)}
                    disabled={dailyChargeDisabled}
                >
                    <ReloadOutlined /> Run Posting
                </Button>
            </div>

            <RunPostingModal
                onCancel={() => setRunPostingModalOpen(false)}
                onOk={retryPostCharge}
                open={runPostingModalOpen}
                confirmLoading={reloadPostCharge?.isPending}
            />
        </div>
    )
}

export default DailyChargeStatus;