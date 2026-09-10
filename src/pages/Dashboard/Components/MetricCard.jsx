// import React from "react";
// import { Card } from "antd";

// export default function MetricCard({ title, value }) {
//   return (
//     <Card className="shadow-sm rounded-lg border border-gray-200">
//       <div className="text-sm font-medium mb-1">
//         {title}
//       </div>

//       <div className="text-xl font-bold mb-3">
//         {value}
//       </div>

//       <span className="text-xs text-gray-400 ml-2">
//         From last week
//       </span>
//     </Card>
//   );
// }
import {
  AccountBookOutlined,
  CalendarOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

export const METRIC_CONFIGS = [
  {
    key: "totalRevenue",
    bgColor: "!bg-[#F0FDF4]",
    outerBg: "bg-[#BBF7D0]",
    innerBg: "bg-[#F0FDF4]",
    textColor: "!text-[#166534]",
    titleColor: "text-[#14532D]",
    currencyColor: "text-[#15803D]",
    title: "Total Revenue",
    icon: <AccountBookOutlined className="!text-[#166534] !text-lg" />,
  },
  {
    key: "totalReservations",
    bgColor: "!bg-[#EFF6FF]",
    outerBg: "bg-[#BFDBFE]",
    innerBg: "bg-[#EFF6FF]",
    textColor: "!text-[#1D4ED8]",
    titleColor: "text-[#1E3A8A]",
    title: "Total Reservation",
    icon: <CalendarOutlined className="!text-[#1D4ED8] !text-lg" />,
  },
  {
    key: "totalCheckin",
    bgColor: "!bg-[#FFFBE6]",
    outerBg: "bg-[#FFE58F]",
    innerBg: "bg-[#FFFBE6]",
    textColor: "!text-[#D48806]",
    titleColor: "text-[#874D00]",
    title: "Check-In",
    icon: <LoginOutlined className="!text-[#D48806] !text-lg" />,
  },
  {
    key: "totalCheckout",
    bgColor: "!bg-[#FFF1F0]",
    outerBg: "bg-[#FFDBDB]",
    innerBg: "bg-[#FFF1F0]",
    textColor: "!text-[#CF1322]",
    titleColor: "text-[#8C2F39]",
    title: "Check-Out",
    icon: <LogoutOutlined className="!text-[#CF1322] !text-lg" />,
  },
];

export const MetricCard = ({ config, value = 0, currency }) => {
  const cardDesign = "!w-full !h-full !shadow-md !m-0 !p-0";

  return (
    <Card
      className={`${config.bgColor} !border-none !rounded-lg ${cardDesign}`}
      styles={{
        body: {
          padding: "10px 6px",
          height: "100%",
        },
      }}
    >
      <div className="flex items-center px-1 py-3 h-full min-w-0">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${config.outerBg} shrink-0`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${config.innerBg}`}
          >
            {config.icon}
          </div>
        </div>

        <div className="ml-3 flex-1 min-w-0">
          <div
            className={`text-xs font-medium ${config.titleColor} mb-1 leading-tight`}
          >
            {config.title}
          </div>

          <div
            className={`text-[16px] font-bold ${config.textColor} whitespace-nowrap`}
          >
            <div className="flex gap-1 items-center">
              <span>{Number(value).toLocaleString()}</span>

              {currency && (
                <span
                  className={`font-bold text-[12px] mt-1 ${config.currencyColor}`}
                >
                  {currency}
                </span>
              )}
            </div>
          </div>

          {/* <span className="text-[10px] text-gray-400">
            From last week
          </span> */}
        </div>
      </div>
    </Card>
  );
};
