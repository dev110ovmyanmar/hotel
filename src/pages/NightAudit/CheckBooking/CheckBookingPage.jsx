import { Spin } from "antd";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import CheckBookingHeader from "../CheckBookingHeader";
import CheckBookingTable from "../CheckBookingTable";
import IssueAndWarningCard from "../IssueAndWarningCard";
import { useNavigate } from "react-router-dom";

const CheckBookingPage = ({
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
            <CheckBookingHeader  preAuditChecksData={preAuditChecksData} />
            <CheckBookingTable
                colorCheckBooking={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/room-charge-table")
                }} />
        </div>
    )
}

export default CheckBookingPage;