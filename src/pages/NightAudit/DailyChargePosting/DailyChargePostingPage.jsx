import { useNavigate } from "react-router-dom";
import { dailyChargePosing } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import DailyChargeStatus from "./DailyChargeStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import DailyChargePostingTable from "./DailyChargePostingTable";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import { useEffect } from "react";
import Loader from "../../../component/Loader/Loader";

const DailyChargePostingPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();

    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;
    const nightAudit = localStorage.getItem("nightAudit");

    useEffect(() => {

        if (!nightAudit) {
            navigate("/night-audit", { replace: true });
        }
    }, [navigate]);

    const { data: dailyChargePostingData } = useApiQuery({
        fetchQueryName: "daily-charge-postings",
        fetchQueryFunction: dailyChargePosing,
        params: { businessDate },
        options: { enabled: !!nightAudit },
    });

    if (!dailyChargePostingData) {
        return (
            <div className={spinLoadingCenter}>
                <Loader />
            </div>
        )
    }

    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />
            <DailyChargeStatus dailyChargePostingData={dailyChargePostingData} />
            <DailyChargePostingTable
                backStep={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue) - 1,
                            },
                        })
                    );
                    navigate("/night-audit/pre-audit-check");
                }}
                nextStep={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/folio-&-payment-review")
                }}
                dailyChargePostingData={dailyChargePostingData}
            />
        </div>
    )
}

export default DailyChargePostingPage;