// import {
//   AccountBookOutlined,
//   ClockCircleOutlined,
//   FileDoneOutlined,
//   ScheduleOutlined,
//   WalletOutlined,
// } from "@ant-design/icons";
// import { Card } from "antd";
// import PriceTag from "../PriceTag/PriceTag";

// export const DAILY_CARD_CONFIGS = [
//   {
//     key: "posted",
//     bgColor: "!bg-[#F0FDF4]",
//     outerBg: "bg-[#BBF7D0]",
//     innerBg: "bg-[#F0FDF4]",
//     textColor: "!text-[#166534]",
//     titleColor: "text-[#14532D]",
//     currencyColor: "text-[#15803D]",
//     title: "Total Posted",
//     icon: <ScheduleOutlined className="!text-[#166534] !text-lg" />,
//   },
//   {
//     key: "postedAmount",
//     bgColor: "!bg-[#EFF6FF]",
//     outerBg: "bg-[#BFDBFE]",
//     innerBg: "bg-[#EFF6FF]",
//     textColor: "!text-[#1D4ED8]",
//     titleColor: "text-[#1E3A8A]",
//     currencyColor: "text-[#2563EB]",
//     title: "Total Posted Amount",
//     icon: <FileDoneOutlined className="!text-[#1D4ED8] !text-lg" />,
//   },
//   {
//     key: "total",
//     bgColor: "!bg-[#F9F0FF]",
//     outerBg: "bg-[#EFDBFF]",
//     innerBg: "bg-[#F9F0FF]",
//     textColor: "!text-[#722ED1]",
//     titleColor: "text-[#531DAB]",
//     currencyColor: "text-[#9254DE]",
//     title: "Total",
//     icon: <ClockCircleOutlined className="!text-[#722ED1] !text-lg" />,
//   },
//   {
//     key: "totalAmount",
//     bgColor: "!bg-[#FFFBE6]",
//     outerBg: "bg-[#FFE58F]",
//     innerBg: "bg-[#FFFBE6]",
//     textColor: "!text-[#D48806]",
//     titleColor: "text-[#874D00]",
//     currencyColor: "text-[#FAAD14]",
//     title: "Total Amount",
//     icon: <WalletOutlined className="!text-[#D48806] !text-lg" />,
//   },
//   {
//     key: "unposted",
//     bgColor: "!bg-[#FFF1F0]",
//     outerBg: "bg-[#FFDBDB]",
//     innerBg: "bg-[#FFF1F0]",
//     textColor: "!text-[#CF1322]",
//     titleColor: "text-[#8C2F39]",
//     currencyColor: "text-[#DE505C]",
//     title: "Total Unposted",
//     icon: <AccountBookOutlined className="!text-[#CF1322] !text-lg" />,
//   },
//   {
//     key: "unpostedAmount",
//     bgColor: "!bg-[#FFF1F0]",
//     outerBg: "bg-[#FFDBDB]",
//     innerBg: "bg-[#FFF1F0]",
//     textColor: "!text-[#CF1322]",
//     titleColor: "text-[#8C2F39]",
//     currencyColor: "text-[#DE505C]",
//     title: "Total Unposted Amount",
//     icon: <AccountBookOutlined className="!text-[#CF1322] !text-lg" />,
//   },
// ];

// export const DailyStatusCard = ({ config, value = "0.00", currency }) => {
//   const cardDesign = `!w-full !h-full !shadow-md !m-0 !p-0`;

//   return (
//     <Card
//       className={`${config.bgColor} !border-none !rounded-lg ${cardDesign}`}
//       styles={{ body: { padding: "10px 6px", height: "100%", } }}
//     >
//       <div className="flex items-center px-1 py-3 h-full min-w-0">
//         <div
//           className={`flex items-center justify-center w-10 h-10 rounded-full ${config.outerBg} shrink-0`}
//         >
//           <div
//             className={`flex items-center justify-center w-8 h-8 rounded-full ${config.innerBg}`}
//           >
//             {config.icon}
//           </div>
//         </div>

//         <div className="ml-3 flex-1 min-w-0">
//           <div className={`text-xs font-medium ${config.titleColor} mb-1 leading-tight`}>
//             {config.title}
//           </div>

//           <div className={`text-[16px] font-bold ${config.textColor} whitespace-nowrap`}>
//             <div className="flex gap-1 items-center">
//               <PriceTag value={value} />
//               <span className={`font-bold text-[12px] mt-1 ${config.currencyColor} `}>
//                 {currency}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };
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
        bgColor: "!bg-[#F9F0FF]",
        outerBg: "bg-[#EFDBFF]",
        innerBg: "bg-[#F9F0FF]",
        textColor: "!text-[#722ED1]",
        titleColor: "text-[#531DAB]",
        currencyColor: "text-[#9254DE]",
        icon: <FileDoneOutlined className="!text-[#722ED1] !text-lg" />,
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
            className={`${config.bgColor} !border-none !rounded-lg !w-full !h-full !shadow-md !m-0 !p-0`}
            styles={{ body: { padding: "12px 14px", height: "100%" } }}
        >
            <div className="flex items-start gap-3 h-full">
                {/* Icon Circle */}
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${config.outerBg} shrink-0`}
                >
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${config.innerBg}`}
                    >
                        {config.icon}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  

                    <div className="space-y-1.5">
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