import React from "react";
import { Table } from "antd";
import useRoleColumns from "./useRoleColumns";
import { filter } from "lodash";

const RolesTable = (
    {
        dataSource,
        loading,
        onAdd,
        onView,
        onEdit
    }
) => {
      const columns = useRoleColumns(onEdit, onView, onAdd);
  return (
    <>
    <Table
    columns={columns}
    dataSource={dataSource}
    rowKey="id"
    className="mx-5"
    loading={loading}
    pagination={{showSizeChanger: true}}
    />
    </>  
  )
}

export default RolesTable