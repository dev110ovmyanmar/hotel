import React from "react";
import { Drawer } from "antd";
import dayjs from "dayjs";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";

const EXTRA_TYPE_LABELS = {
  extra_bed: "Extra Bed",
  extra_person: "Extra Person",
  baby_cot: "Baby Cot",
};

const SectionCard = ({ title, children }) => (
  <div className="bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
    <h4 className="text-[11px] font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">
      {title}
    </h4>
    <div className="divide-y divide-slate-200/70 dark:divide-gray-700/70">
      {children}
    </div>
  </div>
);

const Amount = ({ value, muted }) => (
  <div
    className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${muted
        ? "text-slate-400 dark:text-gray-500"
        : "text-slate-700 dark:text-gray-100"
      }`}
  >
    <PriceTag value={value} />
    <span className="text-xs font-normal text-slate-400 dark:text-gray-500">
      MMK
    </span>
  </div>
);

const InfoRow = ({ label, isComplimentary, complimentaryType, value }) => (
  <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
    {isComplimentary ? (
      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400">
        <span>{label}</span>
        {complimentaryType && (
          <span className="text-xs text-slate-400 dark:text-gray-500">
            [
            <span aria-hidden className="p-1">🎁</span>
            <span className="p-1">{complimentaryType}</span>
            ]
          </span>
        )}
      </div>
    ) : (
      <span className="text-sm text-slate-700 dark:text-gray-200">
        {label}
      </span>
    )}
    <Amount value={value} muted={isComplimentary} />
  </div>
);

const DailyBreakDownDetailFormDrawer = ({ open, onClose, data }) => {
  if (!data) return null;

  const dc = data.dailyCharge || {};
  const adults = data.adults || 1; // guard against divide-by-zero
  const mealPerAdult = ((data.mealCharge || 0) / adults).toLocaleString();

  const feeRows = [
    ["Sub Total", dc.subTotal],
    ["Tax", dc.taxTotal],
    ["Service Charge", dc.serviceChargeTotal],
    ["Incentive", dc.incentiveTotal],
    ["Discount", dc.discountTotal],
  ].filter(([, value]) => value > 0);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={480}
      title={
        <div>
          <h2 className="font-bold text-base text-slate-800 dark:text-white m-0">
            Daily Breakdown
          </h2>
          <p className="text-sm text-blue-700 dark:text-blue-400 font-medium m-0">
            {dayjs(data.stayDate).format("DD MMM YYYY")}
          </p>
        </div>
      }
    >
      <div className="space-y-4">
        <SectionCard title="Room Charge">
          <InfoRow label="Room Rate" 
          isComplimentary={(dc.roomComplimentaryTotal || 0) > 0}
          complimentaryType={data.roomComplimentaryType}
          value={dc.roomRate || 0} 
          />
          {
            data?.mealPricingMode == "included" ? 
            <InfoRow
            label={`Meal Charge (${data.mealPricingMode})`}
            isComplimentary={data.isMealComplimentary}
            value={data.mealCharge || 0}
          /> : null 
          }
        </SectionCard>

        {
          data?.mealPricingMode == "separate" ? 
<SectionCard title="Meal Charge">

          <InfoRow
            label={`Meal Charge (${data.mealPricingMode})`}
            isComplimentary={data.isMealComplimentary}
            value={data.mealCharge || 0}
          />
</SectionCard> : null
        }



        {(data.children || []).length > 0 && (
          <SectionCard title="Children Charge">
            {data.children.map((child) => (
              <InfoRow
                key={child.id}
                isComplimentary={child.isComplimentary}
                complimentaryType={child.complimentaryType}
                label={
                  child.isComplimentary
                    ? `#${child.childSequence} Child  ${child.age}-years aged`
                    : `#${child.childSequence} Child ${child.age}-years aged`
                }
                value={child.isChargeable ? child.grossChargeAmount : 0}
              />
            ))}
          </SectionCard>
        )}

        {(data.extras || []).length > 0 && (
          <SectionCard title="Extras Charge">
            {data.extras.map((extra) => (
              <InfoRow
                key={extra.id}
                isComplimentary={extra.isComplimentary}
                complimentaryType={extra.complimentaryType}
                label={`${EXTRA_TYPE_LABELS[extra.extraType] || extra.extraType} × ${extra.quantity}`}
                value={extra.grandTotal || 0}
              />
            ))}
          </SectionCard>
        )}

        {feeRows.length > 0 && (
          <SectionCard title="Fees & Adjustments">
            {feeRows.map(([label, value]) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </SectionCard>
        )}

        <div className="flex justify-between items-center rounded-xl px-4 py-3.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
          <span className="font-bold text-base text-slate-800 dark:text-gray-100">
            Grand Total
          </span>
          <span className="flex items-center gap-1 font-bold text-lg text-indigo-600 dark:text-indigo-400 tabular-nums">
            <PriceTag value={dc.grandTotal || 0} />
            <span className="text-xs font-normal text-slate-400">MMK</span>
          </span>
        </div>
      </div>
    </Drawer>
  );
};

export default DailyBreakDownDetailFormDrawer;