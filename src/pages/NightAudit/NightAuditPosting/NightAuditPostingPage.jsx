import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import CheckBookingHeader from "../CheckBookingHeader";
import IssueAndWarningCard from "../IssueAndWarningCard";
import NightAuditPosting from "../NightAuditPosting";
import { Spin } from "antd";

const NightAuditPostingPage = ({
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
                <Spin/>
            </div>
        )
    }
    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader preAuditChecksData={preAuditChecksData} />
            <NightAuditPosting nightAuditPostingClick={() => {
               
                window.dispatchEvent(
                    new CustomEvent("breadcrumb_updated", {
                        detail: {
                            stepValue: Number(stepValue),
                        },
                    })
                );
                navigate("/night-audit/create-new-day")
            }} />
        </div>
    )
}

export default NightAuditPostingPage;