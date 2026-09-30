import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import PreAuditCheckStatus from "./PreAuditCheckStatus";
import PreAuditTable from "./PreAuditTable";
import CheckBookingHeader from "../CheckBookingHeader";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import { useEffect } from "react";
import Loader from "../../../component/Loader/Loader";

const PreAuditCheckPage = ({ stepValue }) => {

    const navigate = useNavigate();
    const nightAuditData = getNightAuditData();
    const businessDate = nightAuditData?.businessDate;
    const nightAudit = localStorage.getItem("nightAudit");

    useEffect(() => {
        if (!nightAudit) {
            navigate("/night-audit", { replace: true });
        }
    }, [navigate]);
    
    const { data: preAuditChecksData, isFetching } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: { businessDate: businessDate },
        options: {
            enabled: !!nightAudit && !!businessDate ,
        },
    });

    if (isFetching || !preAuditChecksData) {
        return (
            <div className={spinLoadingCenter}>
                <Loader />
            </div>
        )
    }

    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />
            <PreAuditCheckStatus
                preAuditChecksData={preAuditChecksData}
                preNightAudit={true} />

            <PreAuditTable
                colorCheckBooking={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: { stepValue: Number(stepValue) },
                        })
                    );
                    navigate("/night-audit/daily-charge-posting")
                }}
                preAuditChecksData={preAuditChecksData}
            />
        </div>
    )
}

export default PreAuditCheckPage;