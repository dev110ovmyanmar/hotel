import React from 'react';
import { Descriptions, Table } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import { upgradeAndDownRoomDarkMode } from '../../../../../../utils';


const RoomDowngradeReview = ({
    record,
    selectedRoomTypeName,
    reviewData
}) => {
    console.log(reviewData,"ReviewDataInRoomDownGradeReview")
    const dataSource = [
        {
            key: "1",
            field: <div className='font-bold'>Room Type</div>,
            current: record?.roomType?.name,
            arrow: <SwapRightOutlined/>,
            downgrade: selectedRoomTypeName?.name,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
        {
            key: "2",
            field: <div className='font-bold'>Rank</div>,
            current: record?.roomType?.rank,
            arrow: <SwapRightOutlined/>,
            downgrade: reviewData?.rank,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
        {
            key: "3",
            field: <div className='font-bold'>Room No</div>,
            current: record?.room?.roomNo,
            arrow: <SwapRightOutlined/>,
            downgrade: reviewData?.roomNo,
            color: "border-2 text-purple-500 border-purple-400/60 !bg-purple-500/15 l !backdrop-blur-lg shadow-md",
        },
        {
            key: "4",
            field: <div className='font-bold'>Rate</div>,
            current: record?.ratePlan?.name,
            arrow: <SwapRightOutlined/>,
            downgrade: reviewData?.ratePlan?.label,
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
            title: "Downgrade Room",
            dataIndex: "downgrade",
            key: "downgrade",
            align:"center",
            render: (text, record) => (
                <div className={`${record.color} px-2 py-1 rounded ${upgradeAndDownRoomDarkMode}`}>
                    {text}
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
        />
    )
}

export default RoomDowngradeReview
