import { CloseCircleOutlined, ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { CircleCheck } from "lucide-react";

const FolioAndPaymentReviewStatus = ({
    data,
}) => {

    const folioCounts = (data?.folios || []).reduce(
        (acc, folio) => {
            const status = folio?.financialStatus?.trim()?.toLowerCase();

            if (status === "fully paid") {
                acc.fullyPaid += 1;
            } else if (status === "partially paid") {
                acc.partiallyPaid += 1;
            } else if (status === "unpaid") {
                acc.unpaid += 1;
            }
            return acc;
        },
        { fullyPaid: 0, partiallyPaid: 0, unpaid: 0 }
    );

    const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 `;
    const total = data?.totalFolios || data?.folios?.length || 0;

    return (
        <div>
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center !my-3">

                    {/* Total Card */}
                    <Card className={`!bg-blue-50/100 !text-blue-900 !border-blue-300/80 hover:border-blue-300 shadow-sm hover:shadow transition-all duration-200 rounded-xl ${cardDesign}`}>
                        <div className="p-2.5">
                            <div className="text-xs font-medium">Total</div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-base font-bold">{total}</div>
                                <CircleCheck className="w-4 h-4" />
                            </div>
                        </div>
                    </Card>

                    {/* Fully Paid Card */}
                    <Card className={`!bg-[#F6FFED] !text-[#389E0D] !border-[#B7EB8F] ${cardDesign}`}>
                        <div className="p-2.5">
                            <div className="text-xs font-medium">Fully Paid</div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-base font-bold">
                                    {folioCounts.fullyPaid}
                                </div>
                                <CircleCheck className="w-4 h-4" />
                            </div>
                        </div>
                    </Card>

                    {/* Partially Paid Card */}
                    <Card className={`!bg-[#FFF4F1] !text-[#FF7800] !border-[#FFBD9F] ${cardDesign}`}>
                        <div className="p-2.5">
                            <div className="text-xs font-medium">Partially Paid</div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-base font-bold">
                                    {folioCounts.partiallyPaid}
                                </div>
                                <WarningOutlined className="text-sm" />
                            </div>
                        </div>
                    </Card>

                    {/* Unpaid Card */}
                    <Card className={`!bg-[#FFF1F0] !text-[#CF1322] !border-[#FFA39E] ${cardDesign}`}>
                        <div className="p-2.5">
                            <div className="text-xs font-medium">Unpaid</div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-base font-bold">
                                    {folioCounts.unpaid}
                                </div>
                                <CloseCircleOutlined className="text-sm" />
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default FolioAndPaymentReviewStatus;