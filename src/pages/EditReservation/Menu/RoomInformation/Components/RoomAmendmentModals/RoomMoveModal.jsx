import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Descriptions, Badge, Button, Divider, Space, Row, Col, Card, Typography, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined, SwapLeftOutlined, SwapRightOutlined } from '@ant-design/icons';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import useApiQuery from '../../../../../../hooks/useApiQuery';
import { reservationRoomSearch } from '../../../../../../api/reservationSectionApi';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import ColorStatusTag from '../../../../../../component/ColorStatusTag/ColorStatusTag';
import { GiBed } from "react-icons/gi";
import { queryClient } from '../../../../../../app/queryClient';
import { darkModeStyle, selectedDarkMode, upgradeAndDownRoomDarkMode } from '../../../../../../utils';

const { Text } = Typography;

export default function RoomMoveModal({
    isOpen,
    onClose,
    record,
    roomMoveUuid,
}) {

    useEffect(() => {
        if (!isOpen) {
            queryClient.removeQueries({
                queryKey: 'reservation-room-search'
            });
        }
    }, [isOpen]);

    const checkinDate = record?.checkinDate;
    const checkoutDate = record?.checkoutDate;

    const roomTypeUuid =
        record?.roomType?.uuid ||
        record?.roomType?.uuid;

    const isEnabled =
        isOpen &&
        !!checkinDate &&
        !!checkoutDate &&
        !!roomTypeUuid;

    const { data: reservationRoomSearchDetails, isPending: isQueryLoading , isFetching : isQueryFetching } = useApiQuery({
        fetchQueryName: ["reservation-room-search", roomTypeUuid, checkinDate, checkoutDate],
        fetchQueryFunction: reservationRoomSearch,
        params: {
            filter: {
                checkinDate: dayjs(checkinDate).format('YYYY-MM-DD'),
                checkoutDate: dayjs(checkoutDate).format('YYYY-MM-DD')
            },
            roomType: {
                uuid: roomTypeUuid
            },
        },
        options: {
            enabled: isEnabled,
            
        }
    });

    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"], ["reservation-room-search"]],
    });

    const [selectRoomToMove, setSelectRoomToMove] = useState(false);
    const [selectRoomUuid, setSelectRoomUuid] = useState();

    const handleOk = () => {
        const payload = {
            amendmentType: { uuid: roomMoveUuid },
            reservationRoom: { uuid: record?.uuid },
            room: { uuid: selectRoomUuid }
        };

        createRoomAmendmentMutation.mutate(payload, {
            onSuccess: (response) => {
                Toast.success(response);
                onClose(false);
                setSelectRoomToMove(false);
                setSelectRoomUuid();
            }
        });
    };

    // Clean structural conditions
    const hasNoRooms = !isQueryFetching && reservationRoomSearchDetails?.rooms?.length === 0;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#1677ff', borderRadius: '2px' }} />
                    <span style={{ fontWeight: 600 }}>Room Amendment — Change Room</span>
                </div>
            }
            open={isOpen}
            onOk={handleOk}
            confirmLoading={createRoomAmendmentMutation?.isPending}
            onCancel={() => {
                if (selectRoomToMove) {
                    setSelectRoomToMove(false);
                } else {
                    onClose();
                }
            }}
            cancelText={selectRoomToMove ? "Back" : "Cancel"}
            okText={selectRoomToMove ? "Confirm" : null}
            footer={
                isQueryLoading || isQueryFetching || hasNoRooms ? null : (!selectRoomToMove ? (
                    <Button
                        onClick={() => setSelectRoomToMove(true)}
                        type={selectRoomUuid ? "primary" : "default"}
                        disabled={!selectRoomUuid}
                        className={
                            !selectRoomUuid ? "text-default" : ""
                        }
                    >
                        Review
                    </Button>
                ) : undefined)
            }
            styles={{
                body: {
                    maxHeight: '350px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                }
            }}
        >
            {/* Conditional Subviews */}
            {hasNoRooms ? (
                <div className="text-center py-8">
                    <Text type="secondary">There are no rooms available to move.</Text>
                </div>
            ) : (
                <div>
                    {!selectRoomToMove && (
                        <>
                            <div
                                className={`
                                    flex 
                                    justify-between 
                                    bg-[#f8fafc]
                                    p-3
                                    rounded
                                    border
                                    border-[#e2e8f0]
                                    text-sm
                                    ${darkModeStyle}
                                `}
                            >
                                <h1>{record?.roomType?.name}</h1>
                                {
                                    record?.room?.roomNo ?
                                        <Tag color="green" className='!border !border-green-300 !rounded-sm'>{record?.room?.roomNo}</Tag>
                                        : null
                                }
                            </div>

                            <h4 className='!my-[10px]'>Available Rooms:</h4>
                            {
                                isQueryFetching
                                    ?
                                    <Spin></Spin>
                                    :
                                    <Row gutter={[16, 16]}>
                                        {reservationRoomSearchDetails?.rooms?.map((room) => (
                                            <Col span={12} key={room.uuid}>
                                                <Card
                                                    onClick={() => setSelectRoomUuid(room.uuid)}
                                                    className={`
                                                !overflow-hidden !border !p-3 shadow-md cursor-pointer
                                                hover:!border-sky-300 hover:!shadow-lg hover:-translate-y-1 
                                                ${selectRoomUuid === room.uuid ? `!border-sky-600 !bg-sky-100 ${selectedDarkMode}` : '!border-sky-200'}
                                                
                                            `}
                                                    styles={{
                                                        body: {
                                                            padding: 0,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            height: '100%',
                                                        },
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex gap-1">
                                                            <GiBed fontSize={30} className='text-green-500 dark:text-green-400 ' />
                                                            <h3 className="text-base font-black text-green-500   dark:text-green-400leading-tight">
                                                                {room?.roomNo || "---"}
                                                            </h3>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1.5">
                                                            <ColorStatusTag status={room?.status} />
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                            }
                        </>
                    )}

                    {selectRoomToMove && (
                        <Row gutter={16} className="pt-4">
                            <Col span={11}>
                                <div className='flex justify-between border border-gray-300 py-3 px-2 rounded-md'>
                                    <div className='flex gap-2'>
                                        <GiBed fontSize={25} className='text-gray-500' />
                                        <div className='text-md'>{record?.room?.roomNo}</div>
                                    </div>
                                    <ColorStatusTag status={record?.roomStatus} />
                                </div>
                            </Col>

                            <Col span={2}>
                                <div className='flex justify-center p-3 rounded-md'>
                                    <SwapRightOutlined className='!text-2xl !font-bold' />
                                </div>
                            </Col>

                            {reservationRoomSearchDetails?.rooms
                                ?.filter(searchroom => searchroom?.uuid === selectRoomUuid)
                                ?.map(searchroom => (
                                    <Col span={11} key={searchroom.uuid}>
                                        <div className={`flex justify-between border-2 border-[#4C16FF] bg-[#F0EBFF] py-3 px-2 rounded-md ${upgradeAndDownRoomDarkMode}`}>
                                            <div className='flex gap-2'>
                                                <GiBed fontSize={25} className='text-green-500' />
                                                <div className='text-md text-green-500'>{searchroom?.roomNo}</div>
                                            </div>
                                            <ColorStatusTag status={searchroom?.status} />
                                        </div>
                                    </Col>
                                ))}
                        </Row>
                    )}
                </div>
            )}
        </Modal>
    );
}