import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import CheckBookingHeader from "../CheckBookingHeader";
import IssueAndWarningCard from "../IssueAndWarningCard";
import UnsettledFolios from "../UnsettledFolios";
import { Spin } from "antd";

const UnsettledFoliosPage = ({
    stepValue
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
            <CheckBookingHeader preAuditChecksData={preAuditChecksData} />
            <UnsettledFolios unsettledFolioClick={() => {
                window.dispatchEvent(
                    new CustomEvent("breadcrumb_updated", {
                        detail: {
                            stepValue: Number(stepValue),
                        },
                    })
                );
                navigate("/night-audit/night-audit-posting")
            }} />
        </div>
    )
}

export default UnsettledFoliosPage