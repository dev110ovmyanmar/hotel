import { useNavigate } from "react-router-dom";
import { folioReview } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import FolioAndPaymentReviewStatus from "./FolioAndPaymentReviewStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import FolioAndPaymentReviewTable from "./FolioAndPaymentReviewTable";
import { getNightAuditData } from "../../../variables/constants";

const FolioAndPaymentReviewPage = () => {
    const navigate = useNavigate();
    
    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;

    const {
        data: folioData,
        isLoading: folioLoading,
    } = useApiQuery({
        fetchQueryName: "folio-review",
        fetchQueryFunction: folioReview,
        params: {
            businessDate
        },
    });

    if (folioLoading) {
        return (
            <div className="flex items-center justify-center">
                <Spin />
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
                colorCheckBooking={() => {
                    navigate("/night-audit/reconciliation");
                }}
            />
        </div>
    );
};

export default FolioAndPaymentReviewPage;
