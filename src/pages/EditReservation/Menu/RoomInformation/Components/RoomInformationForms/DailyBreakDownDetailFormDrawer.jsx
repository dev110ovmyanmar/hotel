import React from "react";
import { Divider, Drawer, Tooltip } from "antd";
import dayjs from "dayjs";
import { Gift } from "lucide-react";
import { capitalizeFirstLetter } from "../../../../../../utils";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";

const EXTRA_TYPE_LABELS = {
  extra_bed: "Extra Bed",
  extra_person: "Extra Person",
  baby_cot: "Baby Cot",
};

export const SectionCard = ({ title, children }) => (
  <div className="bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 rounded-xl p-4">
    <h4 className="font-semibold text-slate-900 dark:text-gray-500 tracking-wider mb-3">
      {title}
    </h4>
    <div className="divide-y divide-slate-200/70 dark:divide-gray-700/70">
      {children}
    </div>
  </div>
);

const Amount = ({ value, muted }) => (
  <div className={`flex justify-end gap-1 ${muted ? "text-slate-400 dark:text-gray-500" : ""}`}>
    <PriceTag value={value} />
    <span>MMK</span>
  </div>
);

export const InfoRow = ({ label, isComplimentary, complimentaryType, value, highlight, mealPricingMode }) => (
  <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
    <div className="flex items-center gap-1.5 text-slate-700 dark:text-gray-200">
      <span>{label}</span>
      {isComplimentary && complimentaryType && (
        <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 w-fit">
          <Gift size={12} />
          {capitalizeFirstLetter(complimentaryType)}
        </div>
      )}
      {mealPricingMode && (
        <Tooltip
          title={
            mealPricingMode === "included"
              ? "These items are included in the room rate and will not be charged separately."
              : "These items are not included in the room rate and will be charged separately."
          }
        >
          <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full w-fit cursor-help ${
            mealPricingMode === "included"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
          }`}>
            {capitalizeFirstLetter(mealPricingMode)}
          </div>
        </Tooltip>
      )}
    </div>
    <div
      className={`flex justify-end gap-1 ${highlight
          ? 'text-red-500 dark:text-red-400'
          : isComplimentary
            ? 'text-slate-700 dark:text-gray-200'
            : ''
        }`}
    >
      {highlight && <span>-</span>}
      <PriceTag value={value} />
      <span>MMK</span>
    </div>
  </div>
);

const DailyBreakDownDetailFormDrawer = ({ open, onClose, data }) => {
  if (!data) return null;

  const dc = data.dailyCharge || {};

  const feeRows = [
    ["Sub Total", dc.subTotal],
    ["Tax", dc.taxTotal],
    // ["Service Charge", dc.serviceChargeTotal],
    ["Incentive", dc.incentiveTotal],
    ["Discount", dc.discountTotal],
  ];

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
          <InfoRow
            label="Meal Charge"
            isComplimentary={data.isMealComplimentary}
            complimentaryType={data.mealComplimentaryType}
            value={data.mealCharge || 0}
            mealPricingMode={data.mealPricingMode}
          />
        </SectionCard>

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
          <SectionCard title="Summary">
            {feeRows.map(([label, value]) => (
              <InfoRow
                key={label}
                label={label}
                value={value}
                highlight={label === "Incentive" || label === "Discount"}
              />
            ))}

            <div className="my-2 border-t border-dashed border-slate-300 dark:border-gray-600" />

            <div className="flex justify-between items-center rounded-xl px-4 py-3.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
              <span className="font-bold text-slate-800 dark:text-gray-100">
                Grand Total
              </span>
              <div className="flex justify-end gap-1 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                <PriceTag value={dc.grandTotal || 0} />
                <span>MMK</span>
              </div>
            </div>
          </SectionCard>
        )}
      </div>
    </Drawer>
  );
};

export default DailyBreakDownDetailFormDrawer;