import { useNavigate } from "react-router-dom";
import { dailyChargePosing, preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import DailyChargeStatus from "./DailyChargeStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import DailyChargePostingTable from "./DailyChargePostingTable";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import { useEffect } from "react";

const DailyChargePostingPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();

    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;

    useEffect(() => {
        const nightAudit = localStorage.getItem("nightAudit");

        if (!nightAudit) {
            navigate("/night-audit", { replace: true });
        }
    }, [navigate]);

    const { data: dailyChargePostingData, dailyChargeDataLoading, dailyChargeDataError } = useApiQuery({
        fetchQueryName: "daily-charge-postings",
        fetchQueryFunction: dailyChargePosing,
        params: {
            businessDate
        },
    });
    console.log(dailyChargePostingData, "dailyChargePostingData")

    if (!dailyChargePostingData) {
        return (
            <div className={spinLoadingCenter}>
                <Spin />
            </div>
        )
    }

    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />
            <DailyChargeStatus dailyChargePostingData={dailyChargePostingData} />
            <DailyChargePostingTable
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
                dailyChargePostingData={dailyChargePostingData}
            />
        </div>
    )
}

export default DailyChargePostingPage;