import { Spin } from "antd";
import { preAuditCheck } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import CheckBookingHeader from "../CheckBookingHeader";
import CheckBookingTable from "../CheckBookingTable";
import { useNavigate } from "react-router-dom";
import { spinLoadingCenter } from "../../../variables/constants";
import Loader from "../../../component/Loader/Loader";

const CheckBookingPage = ({
    stepValue,
}) => {
    const navigate = useNavigate();
    const { data: preAuditChecksData, isFetching, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate: '2026-09-02'
        },
    });

    if (!preAuditChecksData) {
        return (
            <div className={spinLoadingCenter}>
                <Loader />
            </div>
        )
    }
    return (
        <div className="w-full px-6 py-2">
            <CheckBookingHeader />
            <CheckBookingTable
                colorCheckBooking={() => {
                    window.dispatchEvent(
                        new CustomEvent("breadcrumb_updated", {
                            detail: {
                                stepValue: Number(stepValue),
                            },
                        })
                    );
                    navigate("/night-audit/room-charge-table")
                }} />
        </div>
    )
}

export default CheckBookingPage;