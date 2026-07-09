import React from 'react';
import { Modal, Switch, Divider } from 'antd';
import { CloseOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { darkModeStyle } from '../../../utils';

/**
 * RateInventoryModal
 * Shows availability details and rate plan info for a selected cell.
 * Props:
 *   open                    – boolean
 *   onClose                 – () => void
 *   selectedCell            – { roomTypeName, date, dateStr, rtId, rtUuid, availability, ratePlans[] }
 *   loadingStates           – { stopSell: {}, availability: {} }
 *   handleStopSellToggle    – (rtId, dateStr, stopSellValue, availUuid) => void
 *   handleRestrictionEditOpen – (restriction, rp, rt, dateStr) => void
 */


const RateInventoryModal = ({
    open,
    onClose,
    selectedCell,
    loadingStates,
    handleStopSellToggle,
    handleRestrictionEditOpen,
}) => (
    <Modal
        title={
            <div className="border-b border-gray-200 pb-2 mb-0">
                <span className="text-[16px] font-bold">Rate &amp; Inventory Details</span>
            </div>
        }
        open={open}
        onCancel={onClose}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={480}
        centered
    >
        {selectedCell && (
            <div className="flex flex-col gap-3 text-[13px] mt-2">
                <div className="flex justify-between">
                    <span className="text-gray-500">Room Type:</span>
                    <span className="font-bold">{selectedCell.roomTypeName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-bold">{selectedCell.date}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Stop Sell:</span>
                    <Switch
                        size="small"
                        checked={selectedCell.availability?.stopSell}
                        style={{
                            backgroundColor: selectedCell.availability?.stopSell ? '#ff4d4f' : '#52c41a',
                        }}
                        loading={loadingStates.stopSell[selectedCell.availability?.uuid]}
                        // disabled={selectedCell.isPast || loadingStates.stopSell[selectedCell.availability?.uuid]}
                        disabled={true}
                        onChange={() => {
                            handleStopSellToggle(
                                selectedCell.rtId,
                                selectedCell.dateStr,
                                selectedCell.availability?.stopSell,
                                selectedCell.availability?.uuid
                            );
                            onClose();
                        }}
                    />
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Available:</span>
                    <span className="font-bold text-green-600">{selectedCell.availability?.available}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Sold:</span>
                    <span className="font-bold text-red-500">{selectedCell.availability?.sold}</span>
                </div>

                <Divider className="my-1" />

                <div className="font-bold text-[12px] text-gray-500 uppercase">Rate Plans</div>
                {selectedCell.ratePlans?.map((rp) => {
                    const hasExtraBed = rp.extraBed?.adult != null || rp.extraBed?.child != null;
                    const r = rp.restriction;
                    const restrictionTags = r
                        ? [
                            r.stopSell && 'Stop Sell',
                            r.minStay > 0 && `Min Stay: ${r.minStay}`,
                            r.maxStay > 0 && `Max Stay: ${r.maxStay}`,
                            r.cta && 'CTA',
                            r.ctd && 'CTD',
                        ].filter(Boolean)
                        : [];
                    return (
                        <div key={rp.id} className={`bg-gray-50 rounded p-2 flex flex-col gap-1 ${darkModeStyle}`}>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-[12px]">{rp.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-blue-600">
                                        {rp.price != null ? `${rp.price.toLocaleString()} MMK` : '—'}
                                    </span>
                                    {/* {selectedCell.isPast ? (
                                        <EyeOutlined
                                            className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                                            onClick={() => {
                                                handleRestrictionEditOpen(
                                                    rp.restriction,
                                                    { uuid: rp.ratePlanUuid },
                                                    { uuid: selectedCell.rtUuid },
                                                    selectedCell.dateStr,
                                                    !!rp.restriction || selectedCell.isPast,
                                                    selectedCell.isPast
                                                );
                                                onClose();
                                            }}
                                        />
                                    ) : (
                                        <EditOutlined
                                            className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                                            onClick={() => {
                                                handleRestrictionEditOpen(
                                                    rp.restriction,
                                                    { uuid: rp.ratePlanUuid },
                                                    { uuid: selectedCell.rtUuid },
                                                    selectedCell.dateStr,
                                                    !!rp.restriction || selectedCell.isPast,
                                                    selectedCell.isPast
                                                );
                                                onClose();
                                            }}
                                        />
                                    )} */}
                                </div>
                            </div>
                            {hasExtraBed && (
                                <div className="flex gap-3 text-[11px] text-orange-600">
                                    {rp.extraBed.adult != null && (
                                        <span>Extra Adult: {rp.extraBed.adult.toLocaleString()} MMK</span>
                                    )}
                                    {rp.extraBed.child != null && (
                                        <span>Extra Child: {rp.extraBed.child.toLocaleString()} MMK</span>
                                    )}
                                </div>
                            )}
                            {restrictionTags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {restrictionTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] bg-red-100 text-red-600 rounded px-1.5 py-0.5"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

            </div>
        )}
    </Modal>
);

export default RateInventoryModal;
