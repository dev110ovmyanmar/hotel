import React from "react";
import { Table } from "antd";
import useRestaurantTableColumns from "./useRestaurantTableColumns";

const RestauranttableTable = ({
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
    const columns = useRestaurantTableColumns(onEdit, onView);

    return (
        <div id="scrollId" className="w-full h-[63vh]">
            <Table
                scroll={{ x: 1000 }}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                rowKey="uuid"
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

export default RestauranttableTable;