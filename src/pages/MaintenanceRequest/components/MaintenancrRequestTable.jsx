import React from "react";
import { Table } from "antd";
import useMaintenanceRequestColumns from "./useMaintenanceRequestColumns";

const MaintenanceRequestTable = ({
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
    const columns = useMaintenanceRequestColumns(onEdit, onView);


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

export default MaintenanceRequestTable;