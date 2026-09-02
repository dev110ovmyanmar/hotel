import { CloseCircleOutlined, ReloadOutlined, SafetyOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { CircleCheck } from "lucide-react";

const PreAuditCheckStatus = ({
    preAuditChecksData,
    preNightAudit
}) => {
    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 `;
    return (
        <div>
            <div className="items-center grid grid-cols-2 gap-x-10 !my-5">
                <Card className="!shadow-md" >
                    <div className="flex items-center gap-x-2 ">
                        <SafetyOutlined className="!text-5xl !text-green-500" />
                        <div>
                            <div>Pre-Audit Check Status</div>
                            <div className="!text-xl !text-green-700">No blocking issues found</div>
                            {/* <div>All critical checks are good. You can proceed to next step.</div> */}
                        </div>
                    </div>
                </Card>
                <div className="border border-l-0 border-r-0  border-gray-300 flex items-center gap-x-5 py-3">
                    <Card className={`!bg-[#F6FFED] !text-[#389E0D] !border-[#B7EB8F] ${cardDesign}`}>
                        <div>
                            <div>Passed</div>
                            <div className="flex justify-between items-center">
                                <div>{preAuditChecksData?.summary?.passed}</div>
                                <CircleCheck />
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF4F1] !text-[#FF7800] !border-[#FFBD9F] ${cardDesign}`}>
                        <div>
                            <div>Warning</div>
                            <div className="flex justify-between items-center">
                                <div>{preAuditChecksData?.summary?.warnings}</div>
                                <WarningOutlined />
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#FFF1F0] !text-[#CF1322] !border-[#FFA39E] ${cardDesign}`}>
                        <div>
                            <div>Blocked</div>
                            <div className="flex justify-between items-center">
                                <div>{preAuditChecksData?.summary?.blockingIssues}</div>
                                <CloseCircleOutlined />
                            </div>
                        </div>
                    </Card>

                    <Card className={`!bg-[#eeeeee] !border-gray-300 ${cardDesign} dark:!text-gray-700`}>
                        <div>
                            <div>Total Checks</div>
                            <div className="text-center">
                                {preAuditChecksData?.summary?.totalChecks}

                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {
                preNightAudit ?
                    <div className="flex justify-end">
                        
                        <Button type="primary"><ReloadOutlined/> Recheck</Button>
                    </div>
                    : null
            }
        </div>
    )
}

export default PreAuditCheckStatus;