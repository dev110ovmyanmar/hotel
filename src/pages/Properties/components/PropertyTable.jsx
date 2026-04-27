import React from "react";
import { Table } from "antd";
import usePropertiesColumns from "./usePropertiesColumns";

const PropertyTable = ({
    dataSource,
    loading,
    onEdit,
    onView,
    onUpload,
    page,
    perPage,
    changePage,
    changePerPage,
    total,
}) => {

    const columns = usePropertiesColumns(onEdit, onView, onUpload);

    return (
        <div id="scrollId" className="w-full">
            <Table
                tableLayout="fixed"
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

export default PropertyTable;
