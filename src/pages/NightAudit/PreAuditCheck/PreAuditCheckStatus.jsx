// import {
//     CloseCircleOutlined,
//     FileTextOutlined,
//     ReloadOutlined,
//     SafetyOutlined,
//     WarningOutlined,
// } from "@ant-design/icons";
// import { Button, Card } from "antd";
// import { CircleCheck } from "lucide-react";
// import { recheckPreAudit } from "../../../api/nightAuditApi";
// import { useApiMutation } from "../../../hooks/useApiMutation";
// import { getNightAuditData } from "../../../variables/constants";

// const PreAuditCheckStatus = ({
//     preAuditChecksData,
//     preNightAudit,
// }) => {
//     const cardDesign = "!w-full !max-w-[500px] !shadow-md !m-0 !p-0";

//     const overallStatus = preAuditChecksData?.overallStatus;

//     const passed = overallStatus === "PASSED";
//     const warning = overallStatus === "WARNING";

//     const nightAuditData = getNightAuditData();
//     const businessDate = nightAuditData?.businessDate;

//     const recheckPreAudits = useApiMutation({
//         mutationFn: recheckPreAudit,
//         invalidateKeys: [["pre-audit-checks"]],
//     });

//     const recheckAllPreAudits = () => {
//         recheckPreAudits.mutate({
//             businessDate,
//         });
//     };

//     const statusColor = passed
//         ? "!text-green-700"
//         : warning
//             ? "!text-orange-700"
//             : "!text-red-700";

//     return (
//         <div>
//             <div className="my-5 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-x-10">
//                 {/* Pre-Audit Status */}
//                 <Card className="!shadow-md">
//                     <div className="flex items-center gap-x-4 sm:gap-x-6">
//                         <SafetyOutlined
//                             className={`shrink-0 !text-3xl sm:!text-4xl ${statusColor}`}
//                         />

//                         <div className="min-w-0">
//                             <div className="text-sm sm:text-base">
//                                 Pre-Audit Check Status
//                             </div>

//                             <div
//                                 className={`!text-lg sm:!text-xl font-medium break-words ${statusColor}`}
//                             >
//                                 {overallStatus}
//                             </div>
//                         </div>
//                     </div>
//                 </Card>

//                 {/* Summary Cards */}
//                 <div
//                     className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-3 lg:py-2 dark:lg:border-gray-700"
//                 >
//                     {/* Passed */}
//                     <Card
//                         className={`${cardDesign} !bg-[#F6FFED] !text-[#389E0D]`}
//                         styles={{ body: { padding: "12px 14px" } }}
//                     >
//                         <div className="flex items-center gap-3">
//                             {/* Nested Double-Circle Icon Container  */}
//                             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D9F7BE] shrink-0">
//                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6FFED]">
//                                     <CircleCheck className="h-5 w-5 text-[#389E0D]" />
//                                 </div>
//                             </div>

//                             {/* Content Section */}
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-xs font-medium text-[#389E0D]/80 sm:text-sm">
//                                     Passed
//                                 </div>
//                                 <div className="text-lg font-bold text-[#389E0D] sm:text-xl">
//                                     {preAuditChecksData?.summary?.passed ?? 0}
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Warning */}
//                     <Card
//                         className={`${cardDesign} !bg-[#FFF4F1] !text-[#FF7800]`}
//                         styles={{ body: { padding: "12px 14px" } }}
//                     >
//                         <div className="flex items-center gap-3">
//                             {/* Nested Double-Circle Icon Container */}
//                             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD8BF] shrink-0">
//                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF4F1]">
//                                     <WarningOutlined className="!text-[#FF7800] !text-base" />
//                                 </div>
//                             </div>

//                             {/* Content Section */}
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-xs font-medium text-[#FF7800]/80 sm:text-sm">
//                                     Warning
//                                 </div>
//                                 <div className="text-lg font-bold text-[#FF7800] sm:text-xl">
//                                     {preAuditChecksData?.summary?.warnings ?? 0}
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Blocked */}
//                     <Card
//                         className={`${cardDesign} !bg-[#FFF1F0] !text-[#CF1322]`}
//                         styles={{ body: { padding: "12px 14px" } }}
//                     >
//                         <div className="flex items-center gap-3">
//                             {/* Nested Double-Circle Icon Container */}
//                             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD8D6] shrink-0">
//                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF1F0]">
//                                     <CloseCircleOutlined className="!text-[#CF1322] !text-base" />
//                                 </div>
//                             </div>

//                             {/* Content Section */}
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-xs font-medium text-[#CF1322]/80 sm:text-sm">
//                                     Blocked
//                                 </div>
//                                 <div className="text-lg font-bold text-[#CF1322] sm:text-xl">
//                                     {preAuditChecksData?.summary?.blockingIssues ?? 0}
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Total */}
//                     <Card
//                         className={`${cardDesign} !bg-[#F0F5FF] !text-[#1D39C4]`}
//                         styles={{ body: { padding: "12px 14px" } }}
//                     >
//                         <div className="flex items-center gap-3">
//                             {/* Nested Double-Circle Icon Container */}
//                             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D6E4FF] shrink-0">
//                                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0F5FF]">
//                                     <FileTextOutlined className="!text-[#1D39C4] !text-base" />
//                                 </div>
//                             </div>

//                             {/* Content Section */}
//                             <div className="flex-1 min-w-0">
//                                 <div className="text-xs font-medium text-[#2F54EB] sm:text-sm">
//                                     Total
//                                 </div>
//                                 <div className="text-lg font-bold text-[#1D39C4] sm:text-xl">
//                                     {preAuditChecksData?.summary?.totalChecks ?? 0}
//                                 </div>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>
//             </div>

//             {preNightAudit && (
//                 <div className="my-4 flex justify-end">
//                     <Button
//                         type="primary"
//                         icon={<ReloadOutlined />}
//                         onClick={recheckAllPreAudits}
//                         loading={recheckPreAudits.isPending}
//                     >
//                         Recheck All
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PreAuditCheckStatus;
import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";

import { recheckPreAudit } from "../../../api/nightAuditApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getNightAuditData } from "../../../variables/constants";
import PreAuditCheckStatusCard from "../../../component/NightAuditCard/PreAuditCheckStatusCard";

const PreAuditCheckStatus = ({
    preAuditChecksData,
    preNightAudit,
}) => {
    const nightAuditData = getNightAuditData();
    const businessDate = nightAuditData?.businessDate;

    const recheckPreAudits = useApiMutation({
        mutationFn: recheckPreAudit,
        invalidateKeys: [["pre-audit-checks"]],
    });

    const recheckAllPreAudits = () => {
        recheckPreAudits.mutate({
            businessDate,
        });
    };

    return (
        <div>
            <PreAuditCheckStatusCard
                preAuditChecksData={preAuditChecksData}
            />

            {preNightAudit && (
                <div className="my-4 flex justify-end">
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={recheckAllPreAudits}
                        loading={recheckPreAudits.isPending}
                    >
                        Recheck All
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PreAuditCheckStatus;
