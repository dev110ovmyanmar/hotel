import React from "react";
import { Table } from "antd";
import usePermissionColumns from "./usePermissionColumns";

const PermissionTable = ({ 
  dataSource, 
  loading,
  onEdit,
  onView
}) => {
  const columns = usePermissionColumns(onEdit, onView);

  return (
    <>
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        className="mx-5"
        pagination={{ showSizeChanger: true }}
      />
    </>
  );
};

export default PermissionTable;