import { useNavigate } from "react-router-dom";
import { folioReview } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import FolioAndPaymentReviewStatus from "./FolioAndPaymentReviewStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import FolioAndPaymentReviewTable from "./FolioAndPaymentReviewTable";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import { useEffect } from "react";
import Loader from "../../../component/Loader/Loader";

const FolioAndPaymentReviewPage = ({ stepValue }) => {
    
    const navigate = useNavigate();
    const nightAuditData = getNightAuditData();
    const businessDate = nightAuditData?.businessDate;
    const nightAudit = localStorage.getItem("nightAudit");

    useEffect(() => {

        if (!nightAudit) {
            navigate("/night-audit", { replace: true });
        }
    }, [navigate]);

    const { data: folioData, isFetching: folioLoading, } = useApiQuery({
        fetchQueryName: "folio-review",
        fetchQueryFunction: folioReview,
        params: { businessDate },
        options: { enabled: !!nightAudit },
    });

    if (folioLoading) {
        return (
            <div className={spinLoadingCenter}>
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />

            <FolioAndPaymentReviewStatus
                data={folioData}
            />

            <FolioAndPaymentReviewTable
                data={folioData}
                backStep={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue) - 1,
                            },
                        })
                    );

                    navigate("/night-audit/daily-charge-posting");
                }}
                nextStep={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/reconciliation")
                }}
            />
        </div>
    );
};

export default FolioAndPaymentReviewPage;
