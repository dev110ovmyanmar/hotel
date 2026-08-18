import React from 'react'
import { Drawer } from 'antd'
import { queryClient } from '../../../../../../../app/queryClient';
import DailyFOCChildrenTable from './DailyFOCChildrenTable';
import DailyExtrasTable from './DailyExtrasTable';
import DailyMealPlanTable from './DailyMealPlanTable';
import dayjs from 'dayjs';

const DailyFOCDrawer = ({ open, 
    onClose, 
    children = [], 
    extras = [], 
    mealPlan={},
    mealPricingMode,
    occupancyUuid,
    selectedRow, 
    onSuccess
 }) => {
    const initData = queryClient.getQueryData(["initData", "authenticated"]);
    const complimentaryTypes = initData?.statuses?.complimentary_type;

    const isDatePast = (date) => {
            const today = dayjs();
            return dayjs(date).isBefore(today, "day");
        };

    
    const isDatePastCheck = isDatePast(selectedRow?.stayDate);

    return (
        <Drawer
            open={open}
            onClose={onClose}
            width={600}
            className="dark:bg-gray-900"
            headerStyle={{ borderBottom: "1px solid rgba(229, 231, 235, 0.5)" }}
            title={
                <h2 className="text-base font-bold text-slate-800 dark:text-white m-0">
                    Daily FOC
                </h2>
            }
        >
            <div className="space-y-6">
                <DailyFOCChildrenTable
                    data={children}
                    complimentaryTypes={complimentaryTypes}
                    onSuccess={onSuccess}
                    isDatePastCheck={isDatePastCheck}
                />
                <DailyExtrasTable
                    data={extras}
                    complimentaryTypes={complimentaryTypes}
                    onSuccess={onSuccess}
                    isDatePastCheck={isDatePastCheck}
                />

                <DailyMealPlanTable
                    mealPricingMode={mealPricingMode}
                    data={mealPlan}
                    complimentaryTypes={complimentaryTypes}
                    occupancyUuid={occupancyUuid}
                    selectedRow={selectedRow}
                    onSuccess={onSuccess}
                    isDatePastCheck={isDatePastCheck}
                />

            </div>
        </Drawer>
    )
}

export default DailyFOCDrawer
