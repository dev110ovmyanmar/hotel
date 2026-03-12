import React from "react";
import { Table } from "antd";
import useUnitColumns from "./useUnitColumns";

const UnitTable = ({
  dataSource,
  loading,
  onEdit,
  onView
}) => {

  const columns = useUnitColumns(onEdit, onView);

  return (
    <div className="mx-5">
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{ 
          showSizeChanger: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50']
        }}
        size="middle"
      />
    </div>
  );
};

export default UnitTable;