import { useNavigate } from "react-router-dom";
import { activeAdmins, preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import PreAuditCheckStatus from "./PreAuditCheckStatus";
import PreAuditTable from "./PreAuditTable";
import IssueAndWarningCard from "./IssueAndWarningCard";
import CheckBookingHeader from "../CheckBookingHeader";
import useInfiniteApiQuery from "../../../hooks/useInfiniteApiQuery";
import { businessDate } from "../../../variables/constants";

const PreAuditCheckPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();

    const { data: preAuditChecksData, isLoading, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate: businessDate
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
            <PreAuditCheckStatus preAuditChecksData={preAuditChecksData} preNightAudit={true} />
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
                preAuditChecksData={preAuditChecksData}
            />
            <IssueAndWarningCard preAuditChecksData={preAuditChecksData} />
        </div>
    )
}

export default PreAuditCheckPage;