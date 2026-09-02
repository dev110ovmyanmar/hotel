import { Card } from "antd";
import dayjs from "dayjs";
import { Calendar1, Clock1 } from "lucide-react";

const NightAuditTopBar = ({
    preAuditChecksData,
    nightAuditStep,
    nightAuditSteps
}) => {
    const cardDesign = `flex items-center justify-around gap-x-2 border border-gray-300 p-3 rounded shadow-md`;
    const textStyleFromCard = `!text-gray-400`;
    return (
        <div className="flex justify-between items-center my-2">
            {/* <div> */}
            <div className="flex items-center gap-4 px-6 py-4">
                <h1 className="text-2xl font-bold">
                    Night Audit
                </h1>

                <span className="text-gray-400">/</span>

                <span className="text-xl font-semibold text-blue-600">
                    {nightAuditStep + 1}.{" "}
                    {nightAuditSteps[nightAuditStep]}
                </span>
            </div>

            <div className="flex justify-around gap-x-5">
                <div className={cardDesign}>
                    <Calendar1 className="text-blue-500" />
                    <div>
                        <div className={textStyleFromCard}>
                            Current Date
                        </div>
                        <div>
                            {dayjs(preAuditChecksData?.businessDate).format("DD MMMM YYYY")}
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

    )
}

export default NightAuditTopBar;
