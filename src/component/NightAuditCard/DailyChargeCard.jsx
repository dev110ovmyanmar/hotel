import {
    AccountBookOutlined,
    FileDoneOutlined,
    ScheduleOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import PriceTag from "../PriceTag/PriceTag";

export const CONSOLIDATED_CARD_CONFIGS = [
    {
        key: "total",
        title: "Total Overview",
        bgColor: "!bg-[#F0F5FF]",
        outerBg: "bg-[#D6E4FF]",
        innerBg: "bg-[#F0F5FF]",
        textColor: "!text-[#1D39C4]",
        titleColor: "text-[#10239E]",
        currencyColor: "text-[#2F54EB]",
        icon: <FileDoneOutlined className="!text-[#1D39C4] !text-lg" />,
        countLabel: "Total Count",
        amountLabel: "Total Amount",
    },
    {
        key: "posted",
        title: "Posted Summary",
        bgColor: "!bg-[#F0FDF4]",
        outerBg: "bg-[#BBF7D0]",
        innerBg: "bg-[#F0FDF4]",
        textColor: "!text-[#166534]",
        titleColor: "text-[#14532D]",
        currencyColor: "text-[#15803D]",
        icon: <ScheduleOutlined className="!text-[#166534] !text-lg" />,
        countLabel: "Total Posted",
        amountLabel: "Posted Amount",
    },
    {
        key: "unposted",
        title: "Unposted Summary",
        bgColor: "!bg-[#FFF1F0]",
        outerBg: "bg-[#FFDBDB]",
        innerBg: "bg-[#FFF1F0]",
        textColor: "!text-[#CF1322]",
        titleColor: "text-[#8C2F39]",
        currencyColor: "text-[#DE505C]",
        icon: <AccountBookOutlined className="!text-[#CF1322] !text-lg" />,
        countLabel: "Total Unposted",
        amountLabel: "Unposted Amount",
    },
];

export const DailyStatusCard = ({
    config,
    count = 0,
    amount = "0.00",
    currency,
}) => {
    return (
        <Card
            className={`${config.bgColor} !border-none !rounded-lg !w-full !min-h-[100px] !shadow-md !m-0 !p-0`}
            styles={{ body: { padding: "18px 16px", height: "100%" } }}
        >
            <div className="flex items-center gap-3.5 h-full">
                {/* Icon Circle */}
                <div
                    className={`flex items-center justify-center w-11 h-11 rounded-full ${config.outerBg} shrink-0`}
                >
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${config.innerBg}`}
                    >
                        {config.icon}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                        {/* Row 1: Count */}
                        <div className="flex items-center justify-between text-xs">
                            <span className={`${config.titleColor} opacity-80 text-[12px]`}>
                                {config.countLabel}:
                            </span>
                            <span className={`font-bold text-xl ${config.textColor}`}>
                                {count}
                            </span>
                        </div>

                        {/* Row 2: Amount */}
                        <div className="flex items-center justify-between text-xs">
                            <span className={`${config.titleColor} opacity-80`}>
                                {config.amountLabel}:
                            </span>
                            <div className={`flex items-center gap-1 font-bold text-[16px] ${config.textColor}`}>
                                <PriceTag value={amount} />
                                <span className={`text-[16px] ${config.currencyColor}`}>
                                    {currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};