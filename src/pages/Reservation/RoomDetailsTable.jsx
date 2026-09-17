import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Table } from "antd";

const RoomDetailsTable = ({
    columns,
    dataSource,
    selectedData,
    getRemainingRooms,
    viewRoomBookedMutate,
    rateQuotes,
}) => {
    return (
        <Card className="!my-3 !p-0">
            <h1 className="mb-2 text-lg font-bold">
                Room Details
            </h1>

            <div className="w-full overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    className="
                        [&_.ant-table-cell]:!border
                        [&_.ant-table-cell]:!border-gray-200
                        [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]
                        dark:[&_.ant-table-thead>tr>th]:!bg-[#141414]
                    "
                    rowClassName={(record) => {
                        const isBooked = selectedData?.some(
                            (item) => item.key === record.key
                        );

                        const remainingRooms =
                            getRemainingRooms(record);

                        return !isBooked && remainingRooms <= 0
                            ? "bg-gray-40 !text-gray-300 opacity-70"
                            : "";
                    }}
                />
            </div>

            <div className="px-5 py-4">
                <span className="text-red-500">*** </span>
                <span>
                    Children under 5 years stay free in existing bedding;
                    children aged 10+ must use extra bed.
                </span>
            </div>

            <div
                className="sticky bottom-0 z-20 flex w-full justify-end border-t border-gray-200 
                           bg-white/95 px-5 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-[#141414]/95"
            >
                <Button
                    type="primary"
                    onClick={viewRoomBookedMutate}
                    loading={rateQuotes?.isPending}
                    className="h-10 rounded-md px-5 font-medium"
                >
                    View Room Booked
                    <ArrowRightOutlined />
                </Button>
            </div>
        </Card>
    );
};

export default RoomDetailsTable;