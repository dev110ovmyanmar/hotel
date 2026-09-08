import { useNavigate } from "react-router-dom";
import { dailyChargePosing, preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import DailyChargeStatus from "./DailyChargeStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import DailyChargePostingTable from "./DailyChargePostingTable";
import { businessDate } from "../../../variables/constants";

const DailyChargePostingPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();

    const { data: dailyChargePostingData, dailyChargeDataLoading, dailyChargeDataError } = useApiQuery({
        fetchQueryName: "daily-charge-postings",
        fetchQueryFunction: dailyChargePosing,
        params: {
            businessDate: businessDate
        },
    });
    console.log(dailyChargePostingData,"dailyChargePostingData")

    if (!dailyChargePostingData) {
        return (
            <div className="!flex !items-center !justify-center">
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