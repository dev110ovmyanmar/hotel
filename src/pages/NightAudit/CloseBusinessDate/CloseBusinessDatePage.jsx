import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import CloseBusinessDateStatus from "./CloseBusinessDateStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import CloseBusinessDateTable from "./CloseBusinessDateTable";
import { getNightAuditData } from "../../../variables/constants";

const CloseBusinessDatePage = ({
    stepValue,
}) => {
    const navigate = useNavigate();

    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;

    const { data: preAuditChecksData, isLoading, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate

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
            {/* <CloseBusinessDateStatus preAuditChecksData={preAuditChecksData} /> */}
            <CloseBusinessDateTable
                colorCheckBooking={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/create-new-day")
                }}
                preAuditChecksData={preAuditChecksData}
            />
        </div>
    )
}

export default CloseBusinessDatePage;