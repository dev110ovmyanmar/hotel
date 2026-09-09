import {
  AccountBookOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import PriceTag from "../PriceTag/PriceTag";

export const CARD_CONFIGS = [
  {
    key: "totalExpectedCharges",
    bgColor: "!bg-[#F0FDF4]",
    outerBg: "bg-[#BBF7D0]",
    innerBg: "bg-[#F0FDF4]",
    textColor: "!text-[#166534]",
    titleColor: "text-[#14532D]",
    currencyColor: "text-[#15803D]",
    title: "Total Expected Charges",
    icon: <ScheduleOutlined className="!text-[#166534] !text-lg" />,
  },
  {
    key: "totalPostedCharges",
    bgColor: "!bg-[#EFF6FF]",
    outerBg: "bg-[#BFDBFE]",
    innerBg: "bg-[#EFF6FF]",
    textColor: "!text-[#1D4ED8]",
    titleColor: "text-[#1E3A8A]",
    currencyColor: "text-[#2563EB]",
    title: "Total Posted Charges",
    icon: <FileDoneOutlined className="!text-[#1D4ED8] !text-lg" />,
  },
  {
    key: "totalUnpostedCharges",
    bgColor: "!bg-[#F9F0FF]",
    outerBg: "bg-[#EFDBFF]",
    innerBg: "bg-[#F9F0FF]",
    textColor: "!text-[#722ED1]",
    titleColor: "text-[#531DAB]",
    currencyColor: "text-[#9254DE]",
    title: "Total Unposted Charges",
    icon: <ClockCircleOutlined className="!text-[#722ED1] !text-lg" />,
  },
  {
    key: "totalActualPayments",
    bgColor: "!bg-[#FFFBE6]",
    outerBg: "bg-[#FFE58F]",
    innerBg: "bg-[#FFFBE6]",
    textColor: "!text-[#D48806]",
    titleColor: "text-[#874D00]",
    currencyColor: "text-[#FAAD14]",
    title: "Total Actual Payment",
    icon: <WalletOutlined className="!text-[#D48806] !text-lg" />,
  },
  {
    key: "totalDepositAmount",
    bgColor: "!bg-[#FFF1F0]",
    outerBg: "bg-[#FFDBDB]",
    innerBg: "bg-[#FFF1F0]",
    textColor: "!text-[#CF1322]",
    titleColor: "text-[#8C2F39]",
    currencyColor: "text-[#DE505C]",
    title: "Total Folio Balance",
    icon: <AccountBookOutlined className="!text-[#CF1322] !text-lg" />,
  },
];

export const StatusCard = ({ config, value = "100,000.00", currency = "MMK" }) => {
  const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0`;

  return (
    <Card
      className={`${config.bgColor} !border-none !rounded-lg ${cardDesign}`}
      styles={{ body: { paddingTop: "10px", paddingLeft: "6px" } }}
    >
      <div className="flex items-center p-3">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full ${config.outerBg} shrink-0`}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${config.innerBg}`}
          >
            {config.icon}
          </div>
        </div>

        <div className="ml-3 flex-1">
          <div className={`text-xs font-medium ${config.titleColor} mb-1`}>
            {config.title}
          </div>

          <div className={`text-base font-bold ${config.textColor}`}>
            <div className="flex gap-1">
              <PriceTag value={value} />
              <span className={`font-bold text-xs mt-1 ${config.currencyColor}`}>
                {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};