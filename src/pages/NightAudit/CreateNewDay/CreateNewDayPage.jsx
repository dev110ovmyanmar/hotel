import { useNavigate, useSearchParams } from "react-router-dom";
import useApiQuery from "../../../hooks/useApiQuery";
import { preAuditCheck } from "../../../api/nightAuditApi";
import { Spin } from "antd";
import CreateNewDay from "../CreateNewDay";
import CheckBookingHeader from "../CheckBookingHeader";
import { useEffect, useState } from "react";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import Loader from "../../../component/Loader/Loader";

const CreateNewDayPage = () => {
    const navigate = useNavigate();
    const [hideSteps, setHideSteps] = useState(false);
    const nightAuditData = getNightAuditData();

    const businessDate = nightAuditData?.businessDate;

    useEffect(() => {
        const nightAudit = localStorage.getItem("nightAudit");

        if (!nightAudit) {
            navigate("/night-audit", { replace: true });
        }
    }, [navigate]);

    const { data: preAuditChecksData, isFetching, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate
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
            {
                !hideSteps &&
                <CheckBookingHeader />
            }
            <CreateNewDay
                createNewDayClick={() => {
                    setHideSteps(true)
                }}
                preAuditChecksData={preAuditChecksData} 
            />

        </div>
    )
}

export default CreateNewDayPage