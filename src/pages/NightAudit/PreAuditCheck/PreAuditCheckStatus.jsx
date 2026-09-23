import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { recheckPreAudit } from "../../../api/nightAuditApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getNightAuditData } from "../../../variables/constants";
import PreAuditCheckStatusCard from "../../../component/NightAuditCard/PreAuditCheckStatusCard";

const PreAuditCheckStatus = ({ preAuditChecksData, preNightAudit, }) => {

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
