import React from "react";

const FINANCIAL_STATUS_STYLES = {
  unpaid:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",
  "partially paid":
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  partially_paid:
    "bg-amber-50 text-amber-400 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
  fully_paid:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
};

const DEFAULT_STATUS_STYLE =
  "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

const FinancialStatusTag = ({ status, className = "" }) => {
  const matchedStyle =
    FINANCIAL_STATUS_STYLES[status?.toLowerCase()] || DEFAULT_STATUS_STYLE;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${matchedStyle} ${className}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default FinancialStatusTag;