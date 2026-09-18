import React from 'react';
import { Descriptions, Table } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import { darkModeStyle, upgradeAndDownRoomDarkMode } from '../../../../../../utils';


const RoomUpgradeReview = ({
    record,
    selectedRoomTypeName,
    reviewData,
    isAddNewRoom
}) => {
    console.log(reviewData,"REviewData")
    const dataSource = [
        {
            key: "1",
            field: <div className='font-bold'>Room Type</div>,
            current:record?.roomType?.name,
            arrow: <SwapRightOutlined/>,
            upgrade: selectedRoomTypeName?.name,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
        {
            key: "2",
            field: <div className='font-bold'>Rank</div>,
            current:record?.roomType?.rank,
            arrow: <SwapRightOutlined/>,
            upgrade: reviewData?.rank,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
        {
            key: "3",
            field: <div className='font-bold'>Room No</div>,
            current:record?.room?.roomNo ? record?.room?.roomNo : "-" ,
            arrow: <SwapRightOutlined/>,
            upgrade: reviewData?.roomNo,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
        {
            key: "4",
            field: <div className='font-bold'>Rate</div>,
            current:record?.ratePlan?.name,
            arrow: <SwapRightOutlined/>,
            upgrade: reviewData?.ratePlan?.label,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
    ];

    const columns = [
        {
            title: "",
            dataIndex: "field",
            key: "field",
            width: "100px"
        },
        {
            title: "Current Room",
            dataIndex: "current",
            key: "current",
            align:"center",
        },
        {
            title: "",
            dataIndex: "arrow",
            key: "arrow",
            align:"center",
        },
        {
            title: isAddNewRoom? "New Room" : "Upgrade Room",
            dataIndex: "upgrade",
            key: "upgrade",
            align:"center",
            render: (text, record) => (
                <div className={`${record.color} px-2 py-1 rounded ${upgradeAndDownRoomDarkMode}`}>
                    {text ? text : "-"}
                </div>
            ),
        },
    ];
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="small"
            // bordered
        />
    )
}

export default RoomUpgradeReview


{/* <Row gutter={16}>
                                <Col span={12} >
                                    <Card className='!shadow-md'>
                                        <div className='!font-bold !mb-3 '>Current Room</div>
                                        <div>{record?.roomType.name}</div>
                                        <div>Rank - {record?.roomType?.rank}</div>
                                        {record?.room?.roomNo &&
                                            <div>Room No - {record?.room?.roomNo}</div>
                                        }
                                        <div>{record?.ratePlan?.name}</div>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card className='!shadow-md !bg-purple-400 !text-gray-100'>
                                        <div className='!font-bold !mb-3'>Upgrade Room</div>
                                        <div>{selectedRoomTypeName?.name}</div>
                                        <div> Rank - {reviewData?.rank}</div>
                                        <div>Room No - {reviewData?.roomUuid?.label}</div>
                                        <div>{reviewData?.ratePlan?.label}</div>
                                    </Card>
                                </Col>

                            </Row> */}
