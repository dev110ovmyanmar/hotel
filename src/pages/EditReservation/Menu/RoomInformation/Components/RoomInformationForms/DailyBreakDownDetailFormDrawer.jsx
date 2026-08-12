import React from "react";
import { Drawer, Tag } from "antd";
import dayjs from "dayjs";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";

const SectionTitle = ({ children }) => (
  <h4 className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mt-4 mb-2">
    {children}
  </h4>
);

const InfoRow = ({ label, sub, value }) => (
  <div className="flex justify-between items-start py-1">
    <div>
      {label && (
        <span className="text-sm text-slate-700 dark:text-gray-200 font-medium">
          {label}
        </span>
      )}
      {sub && (
        <div className="text-xs text-slate-400 dark:text-gray-500">{sub}</div>
      )}
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-gray-200 flex items-center gap-1">
      <PriceTag value={value} />
      <span className="text-xs font-normal text-slate-400">MMK</span>
    </span>
  </div>
);

const DailyBreakDownDetailFormDrawer = ({ open, onClose, data }) => {
  if (!data) return null;

  const dc = data.dailyCharge || {};
  const mealPlan = data.mealPlan;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={600}
      title={
        <div>
          <h2 className="font-bold text-base text-slate-800 dark:text-white m-0">
            Daily Breakdown - {dayjs(data.date).format("DD-MM-YYYY")}
          </h2>
        </div>
      }
    >
      <div className="space-y-1">
        {/* Room Charge */}
        <SectionTitle>Room Charge</SectionTitle>
        <InfoRow label="Room Rate" value={dc.roomRate || 0} />

        {/* Meal Charge */}
        {mealPlan && 
         (
          <>
            <SectionTitle>Meal Charge</SectionTitle>
              <InfoRow
                sub={`Adult ${data.adults || 0} × ${(data.mealCharge / data.adults || 0).toLocaleString()}`}
                value={data.mealCharge || 0}
              />
              <InfoRow
                sub={`Child ${data.childrenCount || 0} × ${(dc?.childChargeTotal / data.childrenCount || 0).toLocaleString()} (Free for 5 years old and below)`}
                value={dc.childChargeTotal || 0}
              />
          </>
        )}

        {/* Extras */}
        {(dc.extraBedTotal > 0 ||
          dc.babyCotTotal > 0 ||
          dc.extraPersonTotal > 0 ||
          dc.childChargeTotal > 0) && (
          <>
            <SectionTitle>Extras</SectionTitle>
                <InfoRow
                  sub={`Extra Bed ${data.extraBedCount || 0} × ${(dc.extraBedTotal / data.extraBedCount).toLocaleString()}`}
                  value={dc.extraBedTotal}
                />
                <InfoRow
                  sub={`Baby Cot ${data.babyCotCount || 0} × ${(dc.babyCotTotal / data.babyCotCount).toLocaleString()}`}
                  value={dc.babyCotTotal}
                />
                <InfoRow
                  sub={`Extra Person ${data.extraPersonCount || 0} × ${(dc.extraPersonTotal / data.extraPersonCount || 0).toLocaleString()}`}
                  value={dc.extraPersonTotal}
                />
          </>
        )}

        {/* Sub Total */}
        <SectionTitle>Sub Total</SectionTitle>
        <InfoRow label="Sub Total" value={dc.subTotal || 0} />

        {/* Tax */}
        <SectionTitle>Tax</SectionTitle>
        <InfoRow label="Tax" value={dc.taxTotal || 0} />

        {/* Service Charge */}
        <SectionTitle>Service Charge</SectionTitle>
        <InfoRow label="Service Charge" value={dc.serviceChargeTotal || 0} />

        {/* Incentive */}
            <SectionTitle>Incentive</SectionTitle>
            <InfoRow label="Incentive" value={dc.incentiveTotal} />

        {/* Discount */}
            <SectionTitle>Discount</SectionTitle>
            <InfoRow label="Discount" value={dc.discountTotal} />

        {/* Divider */}
        <div className="border-t border-dashed border-slate-300 dark:border-gray-600 my-4" />

        {/* Daily Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-base text-slate-800 dark:text-gray-100">
            Daily Total
          </span>
          <span className="font-bold text-base text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <PriceTag value={dc.grandTotal || 0} />
            <span className="text-xs font-normal text-slate-400">MMK</span>
          </span>
        </div>
      </div>
    </Drawer>
  );
};

export default DailyBreakDownDetailFormDrawer;
