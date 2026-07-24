import React from "react";
import { Table } from "antd";
import useHouseKeepingStatusColumns from "./useHouseKeepingStatusColumns";

const HouseKeepingStatusTable = ({
    dataSource,
    loading,
    onEdit,
    onView,
    page,
    perPage,
    changePage,
    changePerPage,
    total,
}) => {
    const columns = useHouseKeepingStatusColumns(onEdit, onView);

    return (
        <div id="scrollId" className="w-full h-[63vh]">
            <Table
                // scroll={{ x: 1000 }}
                scroll={{ x: "max-content" }}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                rowKey="uuid"
                // className="mx-5"
                pagination={{
                    current: page,
                    pageSize: perPage,
                    total: total,
                    onChange: (page, perPage) => {
                        changePage(page);
                        changePerPage(perPage);
                    },
                    showSizeChanger: true,
                }}
            />
        </div>
    );
};

export default HouseKeepingStatusTable;