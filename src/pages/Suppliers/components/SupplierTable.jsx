import React from "react";
import { Table } from "antd";
import useSupplierColumns from "./useSupplierColumns";

const SupplierTable = ({
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
    const columns = useSupplierColumns(onEdit, onView);

    return (
        <Table
            tableLayout="fixed"
            scroll={{ x: 1000 }}
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
    );
};

export default SupplierTable;