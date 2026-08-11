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
      width={400}
      title={
        <div>
          <h2 className="font-bold text-base text-slate-800 dark:text-white m-0">
            Daily Breakdown - {dayjs(data.date).format("DD-MM-YYYY")}
          </h2>
        </div>
      }
    >
      <div className="space-y-1">
        {/* Date Header */}
        {/* <div className="text-center pb-3 border-b border-slate-200 dark:border-gray-600">
          {data.postedToFolio && (
            <div className="mt-2">
              <Tag color="green" className="rounded-full text-xs">Posted to Folio</Tag>
            </div>
          )}
        </div> */}

        {/* Room Charge */}
        <SectionTitle>Room Charge</SectionTitle>
        <InfoRow label="Room Rate" value={dc.roomRate || 0} />

        {/* Meal Charge */}
        {mealPlan && 
        // (dc.adultMealTotal > 0 || dc.childMealTotal > 0) 
        // &&
         (
          <>
            <SectionTitle>Meal Charge</SectionTitle>
            <InfoRow label={mealPlan.name} value={dc.mealChargeTotal || 0} />
            {/* {dc.adultMealCount > 0 && ( */}
              <InfoRow
                sub={`Adult ${data.adults || 0} × ${(dc.adultMealPrice || 0).toLocaleString()}`}
                value={dc.adultMealTotal || 0}
              />
            {/* )} */}
            {/* {dc.childMealCount > 0 && ( */}
              <InfoRow
                sub={`Child ${data.childrenCount || 0} × ${(dc.childMealPrice || 0).toLocaleString()}`}
                value={dc.childMealTotal || 0}
              />
            {/* )} */}
          </>
        )}

        {/* Extras */}
        {(dc.extraBedTotal > 0 ||
          dc.babyCotTotal > 0 ||
          dc.extraPersonTotal > 0 ||
          dc.childChargeTotal > 0) && (
          <>
            <SectionTitle>Extras</SectionTitle>
            {/* {dc.extraBedTotal > 0 && ( */}
              <>
                <InfoRow label="Extra Bed" value={0} />
                <InfoRow
                  sub={`${data.extraBedCount || 0} × ${(dc.extraBedPrice || 0).toLocaleString()}`}
                  value={dc.extraBedTotal}
                />
              </>
            {/* )} */}
            {/* {dc.babyCotTotal > 0 && ( */}
              <>
                <InfoRow label="Baby Cot" value={0} />
                <InfoRow
                  sub={`${data.babyCotCount || 0} × ${(dc.babyCotPrice || 0).toLocaleString()}`}
                  value={dc.babyCotTotal}
                />
              </>
            {/* )} */}
            {/* {dc.extraPersonTotal > 0 && ( */}
              <>
                <InfoRow label="Extra Person" value={0} />
                <InfoRow
                  sub={`${data.extraPersonCount || 0} × ${(dc.extraPersonPrice || 0).toLocaleString()}`}
                  value={dc.extraPersonTotal}
                />
              </>
            {/* )} */}
            {/* {dc.childChargeTotal > 0 && ( */}
              <>
                <InfoRow label="Child" value={0} />
                <InfoRow
                  sub={`${data.childrenCount || 0} × ${(dc.childPrice || 0).toLocaleString()}`}
                  value={dc.childChargeTotal}
                />
              </>
            {/* )} */}
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
        {/* {(dc.incentiveTotal || 0) > 0 && ( */}
          <>
            <SectionTitle>Incentive</SectionTitle>
            <InfoRow label="Incentive" value={dc.incentiveTotal} />
          </>
        {/* )} */}

        {/* Discount */}
        {/* {(dc.discountTotal || 0) > 0 && ( */}
          <>
            <SectionTitle>Discount</SectionTitle>
            <InfoRow label="Discount" value={dc.discountTotal} />
          </>
        {/* )} */}

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
