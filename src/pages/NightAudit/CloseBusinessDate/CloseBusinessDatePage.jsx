import { useNavigate } from "react-router-dom";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import CheckBookingHeader from "../CheckBookingHeader";
import CloseBusinessDateTable from "./CloseBusinessDateTable";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import { useEffect } from "react";
import Loader from "../../../component/Loader/Loader";

const CloseBusinessDatePage = ({stepValue}) => {
  
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
        params: { businessDate },
        options: { enabled: !!nightAudit },
    });

    if (isFetching) {
        return (
            <div className={spinLoadingCenter}>
                <Loader />
            </div>
        )
    }

    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />
            <CloseBusinessDateTable
                backStep={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue) - 1,
                            },
                        })
                    );
                    navigate("/night-audit/reconciliation");
                }}
                nextStep={() => {
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