import React, { useState } from 'react';
import { Modal, Form, Input, Descriptions, Badge, Button, Divider, Space, Row, Col, Card } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import useApiQuery from '../../../../../../hooks/useApiQuery';
import { reservationRoomSearch } from '../../../../../../api/reservationSectionApi';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';

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
                setSelectRoomToMove(false)
            }
        })
    }

    return (
        <>
            {
                (reservationRoomSearchDetails?.rooms?.length === 0)
                    ?
                    <Modal
                        open={isOpen}
                        onCancel={()=>onClose(false)}
                        onOk={()=>onClose(false)}
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
                            <div onClick={() => setBackToSelectRoom(true)}>
                                {selectRoomToMove ? "Back to Select Room " : null}
                            </div>
                        }
                        okText={
                            <div>
                                {selectRoomToMove ? "OK" : null}
                            </div>
                        }
                        footer={!selectRoomToMove ? null : undefined}
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
                                                <h4 className='!mb-[10px]'>Available Rooms:</h4>
                                                <Row gutter={[18, 16]}>
                                                    {
                                                        reservationRoomSearchDetails?.rooms?.map((room, index) => (

                                                            <Col span={12}>
                                                                <Card
                                                                    className='!h[200px] !overflow-hidden'
                                                                    styles={{
                                                                        body: {
                                                                            padding: 0,
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            height: '100%',
                                                                        }
                                                                    }}
                                                                >
                                                                    <div className='!p-[16px_16px_0_16px]' key={index}>
                                                                        <p className='text-md' >
                                                                            Room No :
                                                                            <span className='font-bold '> {room?.roomNo}</span>
                                                                        </p>
                                                                        <p className='text-md'>
                                                                            Room Type :
                                                                            <span className='font-bold '> {room?.roomType?.name}</span>
                                                                        </p>
                                                                        <p style={{ margin: '4px 0' }}>
                                                                            Status:
                                                                            <span className='font-bold '> {room?.status?.name}</span>
                                                                        </p>

                                                                    </div>

                                                                    <div className='!mt-auto !w-full'>
                                                                        <Button
                                                                            className='!w-full !h-[40px] !bg-[#4096ff] !rounded-none !text-gray-100'
                                                                            onClick={() => {
                                                                                setSelectRoomToMove(true);
                                                                                setSelectRoomUuid(room?.uuid)

                                                                            }}
                                                                        >
                                                                            Select Room To Move
                                                                        </Button>
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

                                                    <Col span={12}>
                                                        <Card>
                                                            <div className='text-lg font-bold mb-2'>Current Room</div>
                                                            <div>{record?.room?.roomNo}</div>
                                                            <div>{record?.roomType?.name}</div>
                                                            {/* <div>{record?.ratePlan?.name}</div> */}
                                                            <div>{record?.status?.name}</div>
                                                        </Card>
                                                    </Col>


                                                    {
                                                        reservationRoomSearchDetails?.rooms?.filter(searchroom => searchroom?.uuid === selectRoomUuid)
                                                            ?.map(searchroom => (

                                                                <Col span={12}>
                                                                    <Card className='!bg-[#b4d1f7] !text-gray-900'>
                                                                        <div className='text-lg font-bold mb-2'>Selected Room</div>
                                                                        <div >
                                                                            <p className='text-md' >
                                                                                {/* Room No : */}
                                                                                <span> {searchroom?.roomNo}</span>
                                                                            </p>
                                                                            <p className='text-md'>
                                                                                {/* Room Type : */}
                                                                                <span> {searchroom?.roomType?.name}</span>
                                                                            </p>
                                                                            {/* <p style={{ margin: '4px 0' }}>
                                                                Status:
                                                                <span className='font-bold '> {searchroom?.status?.name}</span>
                                                            </p> */}

                                                                        </div>
                                                                    </Card>
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