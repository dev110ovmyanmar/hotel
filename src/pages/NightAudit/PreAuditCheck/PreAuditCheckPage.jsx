import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import PreAuditCheckStatus from "./PreAuditCheckStatus";
import PreAuditTable from "./PreAuditTable";
import IssueAndWarningCard from "./IssueAndWarningCard";
import CheckBookingHeader from "../CheckBookingHeader";

const PreAuditCheckPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();
    const { data: preAuditChecksData, isLoading, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate: '2026-09-02'
        },
    });

    if (!preAuditChecksData) {
        return (
            <div className="!flex !items-center !justify-center">
                <Spin />
            </div>
        )
    }

    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />
            <PreAuditCheckStatus preAuditChecksData={preAuditChecksData} preNightAudit={true}/>
            <PreAuditTable
                colorCheckBooking={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/daily-charge-posting")
                }}
                preAuditChecksData={preAuditChecksData?.checks}
            />
            <IssueAndWarningCard preAuditChecksData={preAuditChecksData} />
        </div>
    )
}

export default PreAuditCheckPage;