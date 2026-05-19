import { Button, Card, Table } from "antd";

const RoomDetailsTable = ({
    columns,
    dataSource,
    selectedData,
    getRemainingRooms,
    viewRoomBookedMutate,
    rateQuotes
}) => {

    return (
        <Card className="!my-3">
            <div className="overflow-x-auto">
                <h1 className="text-lg font-bold my-2">Room Details</h1>

                <Table
                    className="[&_.ant-table-cell]:!border 
                        [&_.ant-table-cell]:!border-gray-200 
                        [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]
                        dark:[&_.ant-table-thead>tr>th]:!bg-[#141414]
                    "
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowClassName={(record) => {
                        const isBooked = selectedData?.some(
                            (item) => item.key === record.key,
                        );
                        const remainingRooms = getRemainingRooms(record);
                        return !isBooked && remainingRooms <= 0
                            ? "bg-gray-40 !text-gray-300 opacity-0.7"
                            : "";
                    }}
                />

                <div className="my-5">
                    <span className="text-red-500">*** </span>
                    <span>
                        Children under 6 years stay free in existing bedding; children
                        aged 6+ must use extra bed.
                    </span>
                </div>

                <div className="flex justify-end">
                    <Button type="primary" onClick={viewRoomBookedMutate} loading={rateQuotes?.isPending}>
                        View Room Booked
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default RoomDetailsTable;

