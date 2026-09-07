import { CloseCircleOutlined, ReloadOutlined, SafetyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { CircleCheck } from "lucide-react";

const NightAuditUnlockStatus = ({
    preAuditChecksData,
    preNightAudit
}) => {
    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 `;
    const warning = preAuditChecksData?.overallStatus === "WARNING";
    const passed = preAuditChecksData?.overallStatus === "PASSED";
    return (
        <div>
            <div>
                <div className="items-center grid lg:grid-cols-3 md:grid-cols-2 gap-x-10 !my-3">

                    <Card className={`!bg-[#F6FFED] !text-[#389E0D] !border-[#B7EB8F] ${cardDesign}`}>
                        <div>
                            <div>Total</div>
                            <div className="flex justify-between items-center">
                                <div>{preAuditChecksData?.summary?.total}</div>
                                <div>{preAuditChecksData?.summary?.totalAmount}</div>
                                <CircleCheck />
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF4F1] !text-[#FF7800] !border-[#FFBD9F] ${cardDesign}`}>
                        <div>
                            <div>Posted</div>
                            <div className="flex justify-between items-center">
                                <div>{preAuditChecksData?.summary?.posted}</div>
                                <div>{preAuditChecksData?.summary?.postedAmount}</div>
                                <WarningOutlined />
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF1F0] !text-[#CF1322] !border-[#FFA39E] ${cardDesign}`}>
                        <div>
                            <div>Unposted</div>
                            <div className="flex justify-between items-center">
                                <div>{preAuditChecksData?.summary?.unposted}</div>
                                <div>{preAuditChecksData?.summary?.unpostedAmount}</div>
                                <CloseCircleOutlined />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="primary"><ReloadOutlined /> Post Charge</Button>
            </div>
        </div>
    )
}

export default NightAuditUnlockStatus;