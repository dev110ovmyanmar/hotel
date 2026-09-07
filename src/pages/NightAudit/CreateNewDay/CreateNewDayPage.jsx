import { useNavigate, useSearchParams } from "react-router-dom";
import useApiQuery from "../../../hooks/useApiQuery";
import { preAuditCheck } from "../../../api/nightAuditApi";
import { Spin } from "antd";
import CreateNewDay from "../CreateNewDay";
import CheckBookingHeader from "../CheckBookingHeader";
import { useState } from "react";


const CreateNewDayPage = () => {
    const navigate = useNavigate();
    const [hideSteps,setHideSteps] = useState(false);
    const { data: preAuditChecksData, isLoading, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate: '2026-09-02'
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
            {
                !hideSteps &&
                <CheckBookingHeader />
            }
            <CreateNewDay createNewDayClick={() => {
                setHideSteps(true);
                navigate("/night-audit/unlock")
                
            }} />

        </div>
    )
}

export default CreateNewDayPage