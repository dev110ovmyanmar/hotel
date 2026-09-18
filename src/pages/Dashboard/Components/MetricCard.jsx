import {
  AccountBookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import { MdOutlineKingBed } from "react-icons/md";

export const METRIC_CONFIGS = [
  {
    key: "totalRevenue",
    bgColor: "!bg-[#FFFBEB]",
    outerBg: "bg-[#FDE68A]",
    innerBg: "bg-[#FFFBEB]",
    textColor: "!text-[#D97706]",
    titleColor: "text-[#92400E]",
    currencyColor: "text-[#D97706]",
    title: "Total Revenue",
    icon: <AccountBookOutlined className="!text-[#D97706] !text-lg" />,
  },
  {
    key: "totalReservation",
    bgColor: "!bg-[#F0F9FF]",
    outerBg: "bg-[#BAE6FD]",
    innerBg: "bg-[#F0F9FF]",
    textColor: "!text-[#0284C7]",
    titleColor: "text-[#0369A1]",
    title: "Total Reservation",
    icon: <CalendarOutlined className="!text-[#0284C7] !text-lg" />,
  },
  {
    key: "totalReservationRoom",
    bgColor: "!bg-[#ECFEFF]",
    outerBg: "bg-[#A5F3FC]",
    innerBg: "bg-[#ECFEFF]",
    textColor: "!text-[#0891B2]",
    titleColor: "text-[#155E75]",
    title: "Total Reservation Room",
    icon: <MdOutlineKingBed className="!text-[#0891B2] !text-lg" />,
  },
  {
    key: "booked",
    bgColor: "!bg-[#E6F4FF]",
    outerBg: "bg-[#91CAFF]",
    innerBg: "bg-[#E6F4FF]",
    textColor: "!text-[#0958D9]",
    titleColor: "text-[#0958D9]",
    title: "Booked",
    icon: <CalendarOutlined className="!text-[#0958D9] !text-lg" />,
  },
  {
    key: "confirmed",
    bgColor: "!bg-[#eaf9db]",
    outerBg: "bg-[#c5f1c8]",
    innerBg: "bg-[#eaf9db]",
    textColor: "!text-[#62ab29]",
    titleColor: "text-[#62ab29]",
    title: "Confirmed",
    icon: <CheckCircleOutlined className="!text-[#62ab29] !text-lg" />,
  },
  {
    key: "checkedIn",
    bgColor: "!bg-[#eefcf9]",
    outerBg: "bg-[#a7eee7]",
    innerBg: "bg-[#eefcf9]",
    textColor: "!text-[#189094]",
    titleColor: "text-[#189094]",
    title: "Check-In",
    icon: <LoginOutlined className="!text-[#189094] !text-lg" />,
  },
  {
    key: "checkedOut",
    bgColor: "!bg-[#FFF4F1]",
    outerBg: "bg-[#FFBD9F]",
    innerBg: "bg-[#FFF4F1]",
    textColor: "!text-[#FF8D28]",
    titleColor: "text-[#FF8D28]",
    title: "Check-Out",
    icon: <LogoutOutlined className="!text-[#FF8D28] !text-lg" />,
  },
  {
    key: "cancelled",
    bgColor: "!bg-[#FFF1F0]",
    outerBg: "bg-[#FFA39E]",
    innerBg: "bg-[#FFF1F0]",
    textColor: "!text-[#CF1322]",
    titleColor: "text-[#CF1322]",
    title: "Cancelled",
    icon: <CloseCircleOutlined className="!text-[#CF1322] !text-lg" />,
  },
  {
    key: "noShow",
    bgColor: "!bg-[#F5F5F5]",
    outerBg: "bg-[#D9D9D9]",
    innerBg: "bg-[#F5F5F5]",
    textColor: "!text-[#262626]",
    titleColor: "text-[#434343]",
    title: "No Show",
    icon: <UserDeleteOutlined className="!text-[#262626] !text-lg" />,
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
          className={`animate-pulse flex items-center justify-center w-10 h-10 rounded-full ${config.outerBg} shrink-0`}
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
        </div>
      </div>
    </Card>
  );
};
