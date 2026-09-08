import { useNavigate } from "react-router-dom";
import { preAuditCheck, systemUnlock } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import NightAuditUnlockStatus from "./NightAuditUnlockStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import NightAuditUnlockTable from "./NightAuditUnlockTable";
import { useApiMutation } from "../../../hooks/useApiMutation";

const NightAuditUnlockPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();
    const systemUnlockMutation = useApiMutation({
        mutationFn: systemUnlock,
        options: {
            onSuccess: (data) => {
                Toast.success("System Unlocked successfully");
                // setHaveNiceDay(true);
                // createNewDayClick()
                navigate("/dashboard")
            },
            onError: (error) => {
                console.error("System lock error:", error);
                Toast.error(error?.response?.data?.error?.text || "Failed to unlock system");
            },
        },
    });

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
                    // systemUnlockMutation.mutate();
                    localStorage.removeItem("nightAudit");
                    navigate("/dashboard")
                    
                    
                }}
                preAuditChecksData={preAuditChecksData?.checks}
            />
        </div>
    )
}

export default NightAuditUnlockPage;