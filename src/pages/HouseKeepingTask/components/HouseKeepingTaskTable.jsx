import React from "react";
import { Table } from "antd";
import useHouseKeepingTaskColumns from "./useHoueKeepingTaskColumns";

const HouseKeepingTaskTable = ({
    dataSource,
    loading,
    onEdit,
    onView,
    onViewTaskAssign,
    page,
    perPage,
    changePage,
    changePerPage,
    total,
}) => {
    const columns = useHouseKeepingTaskColumns(onEdit, onView, onViewTaskAssign);


    return (
        <div id="scrollId" className="w-full">
            <Table
                scroll={{ x: 1000 }}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                rowKey="uuid"
                className="mx-5"
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

export default HouseKeepingTaskTable;