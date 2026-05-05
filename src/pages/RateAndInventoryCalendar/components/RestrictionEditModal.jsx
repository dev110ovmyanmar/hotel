import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Switch, Button, Divider, message } from 'antd';
import { CloseOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Toast from '../../../component/Toast/Toast';

/**
 * RestrictionEditModal
 * Modal for editing a rate plan's room restriction.
 * Props:
 *   open        – boolean
 *   onClose     – () => void
 *   onOk        – () => void  (triggers form.submit() from parent)
 *   form        – Ant Design Form instance
 *   isPending   – boolean (mutation loading state)
 *   onFinish    – (values) => void
 *   isViewMode  – boolean (whether the modal is in view-only mode)
 *   isPast      – boolean (whether the selected date is in the past)
 *   dateStr     – string (the date string for the selected cell)
 *   modalData   – object (the current modal state data)
 *   loadingStates - object (global loading states for calendar actions)
 *   handleRoomRestrictionStopSell - (uuid) => void
 */
const RestrictionEditModal = ({ open, onClose, onOk, form, isPending, onFinish, isViewMode, isPast, dateStr, modalData, loadingStates, handleRoomRestrictionStopSell }) => {
    const [viewMode, setViewMode] = useState(isViewMode);

    useEffect(() => {
        if (open) {
            setViewMode(isViewMode);
        }
    }, [open, isViewMode]);

    return (
        <Modal
            title={modalData?.uuid ?
                <div>
                    <span className="text-[15px] font-bold">
                        Room Restriction</span>
                    <Divider className='m-0 p-0 border-b-[1px] border-gray-300' /></div> :
                <div><span className="text-[15px] font-bold">Room Restriction</span>
                    <Divider className='m-0 p-0 border-b-[1px] border-gray-300' />
                </div>}
            open={open}
            onCancel={onClose}
            closeIcon={<CloseOutlined />}
            width={480}
            centered
            footer={viewMode ? (
                <div>
                    <Divider className='m-0 p-0 border-b-[1px] border-gray-300' />
                    <div className="flex justify-between items-center text-left pt-2 px-1">
                        {modalData?.uuid ?
                            <span className="text-[12px] text-gray-500 font-medium leading-tight max-w-[85%]">
                                Update Availability And Setting Minimum/Maximum Lengths Of Stay In Real-Time
                            </span> :
                            <span className="text-[12px] text-gray-500 font-medium leading-tight max-w-[85%]">
                                Create New Room Restriction
                            </span>
                        }

                        {
                            modalData?.uuid ? (
                                !isPast ? (
                                    <EditOutlined
                                        className="text-blue-500 text-[18px] cursor-pointer hover:scale-110 transition-transform"
                                        onClick={() => setViewMode(false)}
                                    />
                                ) : null
                            ) : !isPast ? (
                                <PlusOutlined
                                    className="text-blue-500 text-[18px] cursor-pointer hover:scale-110 transition-transform"
                                    onClick={() => setViewMode(false)}
                                />
                            ) : null
                        }
                    </div>
                </div>

            ) : [
                <Button key="cancel" onClick={onClose}>Cancel</Button>,
                <Button key="save" type="primary" loading={isPending} onClick={onOk}>Save</Button>
            ]}
        >
            {viewMode ? (
                <div className="grid grid-cols-[140px_1fr] gap-y-4 py-4 px-2 items-center text-[13px] text-[#333]">
                    <span className="font-semibold text-gray-600">Date:</span>
                    <span className="font-medium">{dateStr ? dayjs(dateStr).format('D.M.YYYY') : ''}</span>

                    <span className="font-semibold text-gray-600">Stop Sell:</span>
                    <Switch
                        className="!w-[40px]"
                        checked={modalData?.stopSell}
                        disabled={isPast}
                        loading={loadingStates?.stopSell?.[modalData?.uuid]}
                        onChange={() => {
                            if (!modalData?.uuid) {
                                Toast.error("Can't update: No room restriction found for this date");
                                return;
                            }
                            handleRoomRestrictionStopSell(modalData.uuid);
                        }}
                        style={{
                            backgroundColor: modalData?.stopSell ? '#ff4d4f' : '#52c41a',
                            opacity: isPast ? 0.5 : 1,
                            border: 'none'
                        }}
                    />

                    <span className="font-semibold text-gray-600">Min-Stay:</span>
                    <span className="font-medium">{modalData?.minStay ?? 0} days</span>

                    <span className="font-semibold text-gray-600">Max-Stay:</span>
                    <span className="font-medium">{modalData?.maxStay ?? 0} days</span>

                    <span className="font-semibold text-gray-600">Close to Arrival:</span>
                    <span className={modalData?.closedToArrival ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                        {modalData?.closedToArrival ? 'True' : 'False'}
                    </span>

                    <span className="font-semibold text-gray-600">Close to Departure:</span>
                    <span className={modalData?.closedToDeparture ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                        {modalData?.closedToDeparture ? 'True' : 'False'}
                    </span>
                </div>
            ) : (
                <Form form={form} layout="vertical" onFinish={onFinish} className="pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Min Stay" name="minStay" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Max Stay" name="maxStay" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Close to Arrival"
                            name="closedToArrival"
                            valuePropName="checked"
                            normalize={(v) => (v ? 1 : 0)}
                        >
                            <Switch checkedChildren="True" unCheckedChildren="False" />
                        </Form.Item>
                        <Form.Item
                            label="Close to Departure"
                            name="closedToDeparture"
                            valuePropName="checked"
                            normalize={(v) => (v ? 1 : 0)}
                        >
                            <Switch checkedChildren="True" unCheckedChildren="False" />
                        </Form.Item>
                    </div>

                    {/* <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Stop Sell"
                            name="stopSell"
                            valuePropName="checked"
                            normalize={(v) => (v ? 1 : 0)}>
                            <Switch checkedChildren="True" unCheckedChildren="False" />
                        </Form.Item>
                    </div> */}
                </Form>
            )}
        </Modal>
    );
};

export default RestrictionEditModal;
