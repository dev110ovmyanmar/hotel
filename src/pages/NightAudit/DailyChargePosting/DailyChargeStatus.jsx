import { CloseCircleOutlined, ReloadOutlined, SafetyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { Calendar, CircleCheck } from "lucide-react";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { reloadDailyPostCharges } from "../../../api/nightAuditApi";
import { getNightAuditData } from "../../../variables/constants";
import RunPostingModal from "./RunPostingModal";
import { useState } from "react";

const DailyChargeStatus = ({
    dailyChargePostingData,
    preNightAudit
}) => {
    const [runPostingModalOpen,setRunPostingModalOpen] = useState(false);

    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 !border-l-0 !border-r-0`;
    const warning = dailyChargePostingData?.overallStatus === "WARNING";
    const passed = dailyChargePostingData?.overallStatus === "PASSED";

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
            onSuccess: () =>{
                setRunPostingModalOpen(false)
            }
        })
    };

    return (
        <div>
            <div>
                <div className="items-center grid lg:grid-cols-4 md:grid-cols-2 gap-x-5 !my-3 md:gap-y-3">
                    <Card className={`!bg-[#EFF6FF] !text-[#314B99] !border-[#A1CFFF] ${cardDesign} !p-2`}>
                        <div className="text-center">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-x-2">
                                    <Calendar />
                                    <div className="text-base">Posting Date : </div>
                                </div>
                                <div className="text-base">{dailyChargePostingData?.businessDate}</div>
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#F6FFED] !text-[#389E0D] !border-[#B7EB8F] ${cardDesign}`}>
                        <div className="text-center">
                            <div className="flex justify-between">
                                <div>Total</div>
                                <div>{dailyChargePostingData?.summary?.total}</div>
                            </div>
                            <div className="flex justify-between gap-x-7">
                                <div>Total Amount</div>
                                <div>{dailyChargePostingData?.summary?.totalAmount}</div>
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF4F1] !text-[#FF7800] !border-[#FFBD9F] ${cardDesign}`}>
                        <div className="text-center">
                            <div className="flex justify-between">
                                <div>Posted</div>
                                <div>{dailyChargePostingData?.summary?.posted}</div>
                            </div>
                            <div className="flex justify-between gap-x-7">
                                <div>Posted Amount</div>
                                <div>{dailyChargePostingData?.summary?.postedAmount}</div>
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF1F0] !text-[#CF1322] !border-[#FFA39E] ${cardDesign}`}>
                        <div className="text-center">
                            <div className="flex justify-between">
                                <div>Unposted</div>
                                <div>{dailyChargePostingData?.summary?.unposted}</div>
                            </div>
                            <div className="flex justify-between gap-x-7">
                                <div>Unposted Amount</div>
                                <div>{dailyChargePostingData?.summary?.unpostedAmount}</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end my-4">
                <Button
                    type="primary"
                    // onClick={retryPostCharge}
                    onClick={()=>setRunPostingModalOpen(true)}
                >
                    <ReloadOutlined /> Run Posting
                </Button>
            </div>

            <RunPostingModal 
                onCancel={()=>setRunPostingModalOpen(false)}
                onOk={retryPostCharge}
                open={runPostingModalOpen}
                confirmLoading={reloadPostCharge?.isPending}
            />
        </div>
    )
}

export default DailyChargeStatus;