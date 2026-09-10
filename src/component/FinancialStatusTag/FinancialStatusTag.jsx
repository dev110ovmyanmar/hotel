import React from "react";

const FINANCIAL_STATUS_STYLES = {
  unpaid:
    "bg-[#FDFFE0] text-[#D4A106] border-[#F4E34F]",
  "partially paid":
    "bg-[#FFF4F1] text-[#FF7800] border-[#FFBD9F]",
  paid:
    "bg-[#F6FFED] text-[#389E0D] border-[#B7EB8F]",
  overdue:
    "bg-[#FFF1F0] text-[#CF1322] border-[#FFA39E]",
  refunded:
    "bg-[#E6F4FF] text-[#0958D9] border-[#91CAFF]",
  "written off":
    "bg-[#F5F5F5] text-[#333333] border-[#D9D9D9]",
};

const DEFAULT_STATUS_STYLE =
  "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

const FinancialStatusTag = ({ status, className = "" }) => {
  const matchedStyle =
    FINANCIAL_STATUS_STYLES[status?.toLowerCase()] || DEFAULT_STATUS_STYLE;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs border ${matchedStyle} ${className}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default FinancialStatusTag;