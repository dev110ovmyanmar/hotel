import { CloseCircleOutlined, ReloadOutlined, SafetyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { CircleCheck } from "lucide-react";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { reloadDailyPostCharges } from "../../../api/nightAuditApi";
import { businessDate } from "../../../variables/constants";

const DailyChargeStatus = ({
    dailyChargePostingData,
    preNightAudit
}) => {
    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 !border-l-0 !border-r-0`;
    const warning = dailyChargePostingData?.overallStatus === "WARNING";
    const passed = dailyChargePostingData?.overallStatus === "PASSED";

    const reloadPostCharge = useApiMutation({
        mutationFn: reloadDailyPostCharges ,
        invalidateKeys: [["daily-charge-postings"]],
    });

    const retryPostCharge = () => {
        reloadPostCharge.mutate({
            businessDate
        })
    };

    return (
        <div>
            <div className="flex flex-wrap justify-end">
                <div className="items-end grid lg:grid-cols-3 md:grid-cols-2 gap-x-5 !my-3 md:gap-y-3">
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
                    onClick={retryPostCharge}
                >
                    <ReloadOutlined /> Run Posting
                </Button>
            </div>
        </div>
    )
}

export default DailyChargeStatus;