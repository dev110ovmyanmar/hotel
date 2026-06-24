import React, { useState } from 'react';
import { Modal, Form, Input, Descriptions, Badge, Button, Divider, Space, Row, Col, Card } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined, SwapLeftOutlined, SwapRightOutlined } from '@ant-design/icons';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import useApiQuery from '../../../../../../hooks/useApiQuery';
import { reservationRoomSearch } from '../../../../../../api/reservationSectionApi';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import ColorStatusTag from '../../../../../../component/ColorStatusTag/ColorStatusTag';
import { MdOutlineBedroomParent } from "react-icons/md";

export default function RoomMoveModal({
    isOpen,
    onClose,
    record,
    roomMoveUuid,
}) {

    const { data: reservationRoomSearchDetails } = useApiQuery({
        fetchQueryName: "reservation-room-search",
        fetchQueryFunction: reservationRoomSearch,
        params: {
            filter: {
                checkinDate: dayjs(record?.checkinDate).format('YYYY-MM-DD'),
                checkoutDate: dayjs(record?.checkoutDate).format('YYYY-MM-DD')
            },
            roomType: {
                uuid: record?.roomType?.uuid
            },
            enabled: !!record?.checkinDate && !!record?.checkoutDate && !!record?.roomType?.uuid
        },

    });


    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [
            ["reservation-room"],
            ["reservation-room-search"]
        ],
    });

    const [selectRoomToMove, setSelectRoomToMove] = useState(false);
    const [backtoSelectRoom, setBackToSelectRoom] = useState(false);
    const [selectRoomUuid, setSelectRoomUuid] = useState();

    const handleOk = () => {

        const payload = {
            amendmentType: {
                uuid: roomMoveUuid
            },
            reservationRoom: {
                uuid: record?.uuid
            },
            room: {
                uuid: selectRoomUuid
            }
        };

        createRoomAmendmentMutation.mutate(payload, {
            onSuccess: (response) => {
                Toast.success(response);
                onClose(false);
                setSelectRoomToMove(false);
                setSelectRoomUuid()
            }
        })
    };

    return (
        <>
            {
                (reservationRoomSearchDetails?.rooms?.length === 0)
                    ?
                    <Modal
                        open={isOpen}
                        onCancel={() => onClose(false)}
                        onOk={() => onClose(false)}
                        cancelButtonProps={{ style: { display: 'none' } }}
                    >
                        <div className='text-lg font-bold text-center my-3'>
                            There are no rooms available to switch to.
                        </div>
                    </Modal>
                    :
                    <Modal
                        title={
                            <div>
                                <p className='text-[20px] font-bold'>
                                    {selectRoomToMove ? "Review Room Move Summary" : "Change Room"}
                                </p>
                            </div>
                        }
                        closable={{ 'aria-label': 'Custom Close Button' }}
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
                        cancelText={
                            <div onClick={() => {
                                setBackToSelectRoom(true);
                            }}>
                                {selectRoomToMove ? "Back " : null}
                            </div>
                        }
                        okText={
                            <div>
                                {selectRoomToMove ? "OK" : null}
                            </div>
                        }
                        footer={!selectRoomToMove ?
                            <Button
                                onClick={() => {
                                    setSelectRoomToMove(true);
                                }}
                                type={selectRoomUuid ? "primary" : "default"}
                                disabled={!selectRoomUuid ? true : false}
                            >
                                Review
                            </Button>
                            : undefined}
                        styles={{
                            body: {
                                maxHeight: '350px',
                                overflowY: 'auto',
                                paddingRight: '8px'
                            }
                        }}

                    >
                        <div>
                            {
                                <>
                                    {
                                        !selectRoomToMove && (
                                            <>
                                                <h4 className='!my-[10px]'>Available Rooms:</h4>
                                                <Row gutter={[16, 16]}>
                                                    {
                                                        reservationRoomSearchDetails?.rooms?.map((room, index) => (

                                                            <Col span={12}>
                                                                <Card
                                                                    onClick={() => setSelectRoomUuid(room.uuid)}
                                                                    className={`
                                                                    !h[200px] 
                                                                    !overflow-hidden 
                                                                    !border
                                                                    !p-3
                                                                    shadow-md 
                                                                    cursor-pointer
                                                                    hover:!border-sky-300
                                                                    hover:!shadow-lg
                                                                    hover:-translate-y-1
                                                                    ${selectRoomUuid === room.uuid
                                                                            ? '!border-sky-600 !bg-sky-300'
                                                                            : '!border-sky-200'
                                                                        }
                                                                    
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
                                                                            <MdOutlineBedroomParent fontSize={20} className='text-purple-400' />
                                                                            <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                                                                                {room?.roomNo || "---"}
                                                                            </h3>
                                                                        </div>
                                                                        <div className="flex flex-col items-end gap-1.5">
                                                                            <ColorStatusTag status={room?.status} />
                                                                        </div>
                                                                    </div>
                                                                </Card>
                                                            </Col>

                                                        ))
                                                    }
                                                </Row>
                                            </>
                                        )
                                    }


                                    {
                                        selectRoomToMove && (
                                            <>
                                                <Row gutter={16}>

                                                    <Col span={10}>
                                                        <div className='flex justify-between border border-sky-300 p-3 rounded-md'>
                                                            <div>{record?.room?.roomNo}</div>
                                                            <ColorStatusTag status={record?.room?.status} />
                                                        </div>
                                                    </Col>

                                                    <Col span={4}>
                                                        <div className='flex justify-center p-3 rounded-md'>
                                                            <SwapRightOutlined className='!text-xl !font-bold' />
                                                        </div>
                                                    </Col>
                                                    {
                                                        reservationRoomSearchDetails?.rooms?.filter(searchroom => searchroom?.uuid === selectRoomUuid)
                                                            ?.map(searchroom => (

                                                                <Col span={10}>
                                                                    <div className='flex justify-between border-2 border-[#4C16FF] bg-[#F0EBFF] p-3 rounded-md'>
                                                                        <div>{searchroom?.roomNo}</div>
                                                                        <ColorStatusTag status={searchroom?.status} />
                                                                    </div>
                                                                </Col>
                                                            ))
                                                    }

                                                </Row>
                                            </>
                                        )
                                    }
                                </>
                            }
                        </div>

                    </Modal>
            }
        </>
    );
}