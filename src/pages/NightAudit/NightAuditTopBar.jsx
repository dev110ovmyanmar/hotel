import dayjs from "dayjs";
import { Calendar1, Clock1 } from "lucide-react";
import { FaMoon } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import useApiQuery from "../../hooks/useApiQuery";
import { preAuditCheck } from "../../api/nightAuditApi";
import { getNightAuditData } from "../../variables/constants";

const NightAuditTopBar = () => {
    const location = useLocation();

    const nightAuditData = getNightAuditData();
    
    const businessDate = nightAuditData?.businessDate;
    
    const { data: preAuditChecksData, isFetching, error } = useApiQuery({
        fetchQueryName: "pre-audit-checks",
        fetchQueryFunction: preAuditCheck,
        params: {
            businessDate: businessDate
        },
        options: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },
    });


    const routeStepMap = {
        "/night-audit/pre-audit-check": 0,
        "/night-audit/daily-charge-posting": 1,
        "/night-audit/folio-&-payment-review": 2,
        "/night-audit/reconciliation": 3,
        "/night-audit/close-business-date": 4,
        "/night-audit/create-new-day": 5,


        // "/night-audit/daily-charge-posting": 1,
        // "/night-audit/room-charge-table": 2,
        // "/night-audit/unsettled-folios": 3,
        // "/night-audit/night-audit-posting": 4,
        // "/night-audit/create-new-day": 5,
        // "/night-audit/check-booking": 6,
    };

    const nightAuditSteps = [
        "Pre Audit Check",
        "Daily Charge Posting",
        "Folio & Payment Review",
        "Reconciliation",
        "Close Business Date",
        "Create New Day",
        "Unlock"

        // "Check Booking",
        // "Room Charge",
        // "Unsettled Folios",
        // "Night Audit Posting",
        // "Create New Day",
    ];
    const nightAuditStep = routeStepMap[location.pathname] ?? 0;

    const cardDesign =
        "flex items-center justify-around gap-x-3 border border-gray-300 p-3 rounded shadow-md";

    const textStyleFromCard = "!text-gray-400";

    return (
        <div className="flex justify-between items-center my-2">
            <div className="flex items-center gap-4 px-6 py-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100">
                    <FaMoon className="text-blue-600 text-xl" />
                </div>

                <h1 className="text-md font-bold">
                    Night Audit
                </h1>

                <span className="text-gray-400">/</span>

                <span className="text-md font-semibold text-blue-600">
                    {nightAuditStep + 1}.{" "}
                    {nightAuditSteps[nightAuditStep]}
                </span>
            </div>

            <div className="flex justify-around gap-x-5 lg:mr-5">
                <div className={cardDesign}>
                    <Calendar1 className="text-blue-500" />

                    <div>
                        <div className={textStyleFromCard}>
                            Business Date
                        </div>

                        <div>
                            {preAuditChecksData?.businessDate
                                ? dayjs(
                                    preAuditChecksData.businessDate
                                ).format("DD MMM YYYY")
                                : "-"}
                        </div>
                    </div>
                </div>

                <div className={cardDesign}>
                    <Clock1 className="text-green-500" />

                    <div>
                        <div className={textStyleFromCard}>
                            Audit Time
                        </div>

                        <div>
                            {dayjs().format("hh:mm A")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NightAuditTopBar;
