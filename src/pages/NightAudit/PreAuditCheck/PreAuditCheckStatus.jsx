import { CloseCircleOutlined, ReloadOutlined, SafetyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { CircleCheck } from "lucide-react";
import { recheckPreAudit } from "../../../api/nightAuditApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getNightAuditData } from "../../../variables/constants";

const PreAuditCheckStatus = ({
    preAuditChecksData,
    preNightAudit
}) => {
    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 `;
    const warning = preAuditChecksData?.overallStatus === "WARNING";
    const passed = preAuditChecksData?.overallStatus === "PASSED";

    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;

    const recheckPreAudits = useApiMutation({
        mutationFn: recheckPreAudit,
        invalidateKeys: [["pre-audit-checks"]],
    });

    const recheckAllPreAudits = () => {
        recheckPreAudits.mutate({
            businessDate: businessDate
        })
    };

    return (
        <div>
            <div className="my-5 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-x-10">

                {/* Pre-Audit Status */}
                <Card className="!shadow-md">
                    <div className="flex items-center gap-x-4 sm:gap-x-6">
                        <SafetyOutlined
                            className={`
                                shrink-0
                                !text-3xl
                                sm:!text-4xl
                                ${passed
                                    ? "!text-green-700"
                                    : warning
                                        ? "!text-orange-700"
                                        : "!text-red-700"
                                }
                `}
                        />

                        <div className="min-w-0">
                            <div className="text-sm sm:text-base">
                                Pre-Audit Check Status
                            </div>

                            <div
                                className={`
                                    !text-lg
                                    sm:!text-xl
                                    font-medium
                                    break-words
                                    ${passed
                                        ? "!text-green-700"
                                        : warning
                                            ? "!text-orange-700"
                                            : "!text-red-700"
                                    }
                    `}
                            >
                                {preAuditChecksData?.overallStatus}
                            </div>
                        </div>
                    </div>
                </Card>


                {/* Summary Cards */}
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:gap-4
                        lg:grid-cols-4
                        lg:gap-3
                        lg:border
                        lg:border-gray-300
                        lg:border-y
                        lg:border-l-0
                        lg:border-r-0
                        lg:py-2
                        dark:lg:border-gray-700
                    "
                >

                    {/* Passed */}
                    <Card
                        className={`
                        ${cardDesign}
                        !bg-[#F6FFED]
                        !text-[#389E0D]
                        !border-[#B7EB8F]
                    `}          
                    >
                        <div>
                            <div className="text-sm sm:text-base">
                                Passed
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                                <div className="text-lg sm:text-xl font-semibold">
                                    {preAuditChecksData?.summary?.passed}
                                </div>

                                <CircleCheck className="shrink-0" />
                            </div>
                        </div>
                    </Card>


                    {/* Warning */}
                    <Card
                        className={`
                            ${cardDesign}
                            !bg-[#FFF4F1]
                            !text-[#FF7800]
                            !border-[#FFBD9F]
                        `}
                    >
                        <div>
                            <div className="text-sm sm:text-base">
                                Warning
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                                <div className="text-lg sm:text-xl font-semibold">
                                    {preAuditChecksData?.summary?.warnings}
                                </div>

                                <WarningOutlined className="shrink-0" />
                            </div>
                        </div>
                    </Card>


                    {/* Blocked */}
                    <Card
                        className={`
                            ${cardDesign}
                            !bg-[#FFF1F0]
                            !text-[#CF1322]
                            !border-[#FFA39E]
                        `}
                    >
                        <div>
                            <div className="text-sm sm:text-base">
                                Blocked
                            </div>

                            <div className="mt-1 flex items-center justify-between gap-2">
                                <div className="text-lg sm:text-xl font-semibold">
                                    {preAuditChecksData?.summary?.blockingIssues}
                                </div>

                                <CloseCircleOutlined className="shrink-0" />
                            </div>
                        </div>
                    </Card>


                    {/* Total */}
                    <Card
                        className={`
                        ${cardDesign}
                        !border
                        !border-gray-300
                        dark:!text-gray-200
                    `}
                    >
                        <div>
                            <div className="text-sm sm:text-base">
                                Total
                            </div>

                            <div className="mt-1 text-lg sm:text-xl font-semibold">
                                {preAuditChecksData?.summary?.totalChecks}
                            </div>
                        </div>
                    </Card>

                </div>
            </div>

            {
                preNightAudit ?
                    <div className="flex justify-end my-4">
                        <Button
                            type="primary"
                            onClick={recheckAllPreAudits}
                        >
                            <ReloadOutlined /> Recheck All
                        </Button>
                    </div>
                    : null
            }
        </div>
    )
}

export default PreAuditCheckStatus;