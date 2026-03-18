import React, { useState } from "react";
import { Table } from "antd";
import useRoleColumns from "./useRoleColumns";
import { filter } from "lodash";
import RoleForm from "./RoleForm";

const RolesTable = ({
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

    const columns = useRoleColumns(onEdit, onView);
    return (
            <div id="scrollId" className="w-full h-[63vh]">
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
                    total : total,
                    onChange: (page, perPage) => {
                        changePage(page);
                        changePerPage(perPage);
                    },
                    showSizeChanger: true,
                 }}
            />
            </div>
            )
}

export default RolesTable