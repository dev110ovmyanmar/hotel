import React from 'react';
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Baby, PersonStanding } from 'lucide-react';
import { Tooltip } from 'antd';
import { darkModeStyle } from '../../../utils';

const todayDarkModeStyle = 'dark:!bg-[#1e3a5f] dark:!border-r-[#3B82F6] dark:!border-l-[#3B82F6] dark:!text-gray-200';

/**
 * RatePlanRows
 * Renders all rows for a single rate plan when a room type is expanded:
 *   - Rate plan name header
 *   - Price row
 *   - Extra Bed row
 *   - Restriction row
 *
 * Props:
 *   rp                    – { id, name, uuid } rate plan object
 *   rt                    – { id, uuid } room type object (only id + uuid needed)
 *   daysMeta              – [{ dateStr, cellClass, isPast }]
 *   getRateData           – (rtId, ratePlanId, dateStr) => rateData | null
 *   handleRestrictionEditOpen – (restriction, rp, rt, dateStr) => void
 */



const RatePlanRows = ({ rp, rt, daysMeta, getRateData, handleRestrictionEditOpen }) => (
    <React.Fragment key={rp.id}>
        {/* Rate Plan Name Header */}
        <tr className="bg-[#f0f5ff]">
            <td className={`sticky left-0 z-30 bg-[#f0f5ff] border-b border-r border-[#dee2e6] px-4 py-1 ${darkModeStyle}`} colSpan={1}>
                <div className="text-[12px] font-semibold text-[#072F60] pl-2 border-l-2 border-[#072F60] dark:text-blue-400">
                    {rp.name}
                </div>
            </td>
            {daysMeta.map(({ cellClass, isToday }, dayIdx) => (
                <td key={dayIdx} className={`border-b border-[#dee2e6] ${cellClass} ${isToday ? todayDarkModeStyle : darkModeStyle}`} />
            ))}
        </tr>

        {/* Price Row */}
        <tr className="h-8 hover:bg-gray-50">
            <td className={`sticky left-0 z-30 bg-[#f9f9f9] border-b border-r border-[#dee2e6] px-4 py-1 ${darkModeStyle}`}>
                <div className="text-[12px] text-gray-500 pl-4">Price</div>
            </td>
            {daysMeta.map(({ dateStr, cellClass, isPast, isToday }, dayIdx) => {
                const rateData = getRateData(rt.id, rp.id, dateStr);
                const price = rateData?.price ?? null;
                const r = rateData?.restriction;
                const hasRestriction = r && (r.stopSell || r.cta || r.ctd || r.minStay > 0 || r.maxStay > 0);
                const hasStopSellRatePlan = r?.stopSell === true;
                return (
                    <td
                        key={dayIdx}
                        className={`border-b border-[#dee2e6] text-center p-1 ${cellClass} cursor-pointer ${!isToday && (hasStopSellRatePlan && !isPast ? 'bg-red-100' : 'bg-green-100')
                            }
                           ${isToday ? todayDarkModeStyle : darkModeStyle}
                            `}
                        onClick={() =>
                            handleRestrictionEditOpen(
                                rateData?.restriction ?? null,
                                { uuid: rp.uuid, name: rp.name },
                                { uuid: rt.uuid, name: rt.name },
                                dateStr,
                                !!rateData?.restriction || isPast, // open in view mode if restriction exists or it's a past date
                                isPast
                            )
                        }
                    >
                        <div className="flex items-center justify-center gap-0.5">
                            {hasRestriction && <ExclamationCircleOutlined className="text-red-400 text-[10px]" />}
                            <span
                                className={`text-[12px] font-semibold ${price != null
                                    ? isPast
                                        ? 'text-gray-400'
                                        : 'text-blue-700 hover:underline'
                                    : 'text-gray-300'
                                    }`}
                            >
                                {price != null ? price.toLocaleString() : '—'}
                            </span>
                        </div>
                    </td>
                );
            })}
        </tr>

        {/* Extra Bed Row */}
        <tr className="h-8 hover:bg-gray-50">
            <td className={`sticky left-0 z-30 bg-[#f9f9f9] border-b border-r border-[#dee2e6] px-4 py-1 ${darkModeStyle}`}>
                <div className="text-[12px] text-gray-500 pl-4">Extra Bed</div>
            </td>
            {daysMeta.map(({ dateStr, cellClass }, dayIdx) => {
                const extraBed = getRateData(rt.id, rp.id, dateStr)?.extraBed;
                const hasAdult = extraBed?.adult != null;
                const hasChild = extraBed?.child != null;
                return (
                    <td key={dayIdx} className={`border-b border-[#dee2e6] text-center p-1 ${cellClass} ${isToday ? todayDarkModeStyle : darkModeStyle}`}>
                        {hasAdult || hasChild ? (
                            <div className="flex flex-col items-center gap-0.5">
                                {hasAdult && (
                                    <span className="text-[12px] text-orange-500 font-medium flex items-center gap-1">
                                        <UserOutlined style={{ fontSize: '15px' }} />
                                        <span>: {extraBed.adult.toLocaleString()}</span>
                                    </span>
                                )}
                                {hasChild && (
                                    <span className="text-[12px] text-orange-500 font-medium flex items-center gap-1">
                                        <Baby size={15} strokeWidth={2.5} />
                                        <span>: {extraBed.child.toLocaleString()}</span>
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[11px] text-gray-300">—</span>
                        )}
                    </td>
                );
            })}
        </tr>

        {/* Restriction Row */}
        <tr className="h-8 hover:bg-gray-50">
            <td className={`sticky left-0 z-30 bg-[#f9f9f9] border-b border-r border-[#dee2e6] px-4 py-1 ${darkModeStyle}`}>
                <div className="text-[12px] text-gray-500 pl-4">Room Restriction</div>
            </td>
            {daysMeta.map(({ dateStr, cellClass, isToday }, dayIdx) => {
                const r = getRateData(rt.id, rp.id, dateStr)?.restriction;
                const stopSellTag = r?.stopSell ? 'Stop' : null;
                const stayTag = (() => {
                    const hasMin = r?.minStay > 0;
                    const hasMax = r?.maxStay > 0;
                    if (hasMin && hasMax) return `${r.minStay}<->${r.maxStay}`;
                    if (hasMin) return `Min: ${r.minStay}`;
                    if (hasMax) return `Max: ${r.maxStay}`;
                    return null;
                })();
                const closureTags = [r?.cta && 'CTA', r?.ctd && 'CTD'].filter(Boolean);
                const hasAnyTag = stopSellTag || stayTag || closureTags.length > 0;
                return (
                    <td key={dayIdx} className={`border-b border-[#dee2e6] text-center p-1 ${cellClass} ${isToday ? todayDarkModeStyle : darkModeStyle}`}>
                        {hasAnyTag ? (
                            <div className="flex flex-col gap-0.5 items-center">
                                {stopSellTag && (
                                    <span className="text-[10px] bg-red-100 text-red-600 rounded px-1 leading-tight">
                                        {stopSellTag}
                                    </span>
                                )}
                                {stayTag && (
                                    <span className="text-[12px] bg-red-100 text-red-600 rounded px-1 leading-tight">
                                        {stayTag}
                                    </span>
                                )}
                                {closureTags.length > 0 && (
                                    <div className="flex gap-1">
                                        {closureTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[11px] bg-red-100 text-red-600 rounded px-1 leading-tight"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span className="text-[11px] text-gray-300">—</span>
                        )}
                    </td>
                );
            })}
        </tr>
    </React.Fragment>
);

export default RatePlanRows;
