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

    const checkinDateInRecord = dayjs(record?.checkinDate);
    const today = dayjs().startOf("day");

    const checkinDate = checkinDateInRecord.isBefore(today)
        ? today
        : checkinDateInRecord;

    const checkoutDate = record?.checkoutDate;

    const roomTypeUuid =
        record?.roomType?.uuid ||
        record?.roomType?.uuid;

    const isEnabled =
        isOpen &&
        !!checkinDate &&
        !!checkoutDate &&
        !!roomTypeUuid;

    const { data: reservationRoomSearchDetails, isPending: isQueryLoading, isFetching: isQueryFetching } = useApiQuery({
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
    console.log(record, "reservationRoomSearchDetailsRecord")
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
                                    <div className='flex justify-center items-center'>
                                        <Spin></Spin>
                                    </div>
                                    :
                                    <Row gutter={[16, 16]}>
                                        {reservationRoomSearchDetails?.rooms?.map((room) => {
                                            const isRoomDisabled =
                                                room?.status?.code === "out_of_order" ||
                                                room?.status?.code === "out_of_service";

                                            const isRoomCheckedIn = record?.roomStatus?.code === "checked_in";
                                            const isCleanRoom = room?.cleanStatus?.code === "clean";
                                            const isRoomCheckedInAndNotClean = isRoomCheckedIn && !isCleanRoom;

                                            const isOccupied = room?.status?.code === "occupied";
                                            const isRoomCheckedInAndOccupied = isRoomCheckedIn && isOccupied;

                                            return (
                                                <Col span={12} key={room.uuid}>
                                                    <Card
                                                        onClick={() => {
                                                            if (isRoomDisabled || isRoomCheckedInAndNotClean || isRoomCheckedInAndOccupied) return;

                                                            setSelectRoomUuid(room.uuid);
                                                        }}
                                                        className={`
                                                            !overflow-hidden !border !p-3 shadow-md !items-center
                                                            ${isRoomDisabled || isRoomCheckedInAndNotClean || isRoomCheckedInAndOccupied
                                                                ? "cursor-not-allowed opacity-50 !border-gray-300"
                                                                : "cursor-pointer hover:!border-green-300 hover:!shadow-lg hover:-translate-y-1"
                                                            }
                                                            
                                                            ${selectRoomUuid === room.uuid
                                                                ? `!border-green-400 !bg-green-200/60 backdrop-blur-md shadow-[0_4px_20px_rgba(56,189,248,0.20)] ${selectedDarkMode}`
                                                                : "!border-green-200"
                                                            } 
                                                        `}
                                                        styles={{
                                                            body: {
                                                                padding: 0,
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                height: "100%",
                                                            },
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex gap-1">
                                                                <GiBed
                                                                    fontSize={30}
                                                                    className={
                                                                        isRoomDisabled || isRoomCheckedInAndNotClean || isRoomCheckedInAndOccupied
                                                                            ? "text-gray-400"
                                                                            : "text-green-500 dark:text-green-400"
                                                                    }
                                                                />

                                                                <h3
                                                                    className={`text-base font-black leading-tight ${isRoomDisabled || isRoomCheckedInAndNotClean || isRoomCheckedInAndOccupied
                                                                        ? "text-gray-400"
                                                                        : "text-green-500 dark:text-green-400"
                                                                        }`}
                                                                >
                                                                    {room?.roomNo || "---"}
                                                                </h3>
                                                            </div>

                                                            <div className="flex flex-col items-end gap-1.5">
                                                                <ColorStatusTag status={room?.status} iconType="bed" />
                                                                <ColorStatusTag status={room?.cleanStatus} iconType="broom" />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
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
                                        <div className={`flex justify-between items-center border-2 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md py-3 px-2 rounded-md ${upgradeAndDownRoomDarkMode}`}>
                                            <div className='flex gap-2'>
                                                <GiBed fontSize={25} className='text-purple-500' />
                                                <div className='text-md text-purple-500'>{searchroom?.roomNo}</div>
                                            </div>
                                            <div className='flex flex-col gap-1.5'>
                                                <ColorStatusTag status={searchroom?.status} iconType="bed" />
                                                <ColorStatusTag status={searchroom?.cleanStatus} iconType="broom" />
                                            </div>
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