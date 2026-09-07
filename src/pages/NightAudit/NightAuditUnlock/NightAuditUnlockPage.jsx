import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import NightAuditUnlockStatus from "./NightAuditUnlockStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import NightAuditUnlockTable from "./NightAuditUnlockTable";

const NightAuditUnlockPage = ({
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
            <NightAuditUnlockStatus preAuditChecksData={preAuditChecksData} />
            <NightAuditUnlockTable
                colorCheckBooking={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/folio-&-payment-review")
                }}
                preAuditChecksData={preAuditChecksData?.checks}
            />
        </div>
    )
}

export default NightAuditUnlockPage;