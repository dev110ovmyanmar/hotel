import React from "react";
import { Table } from "antd";
import useCategoryColumns from "./useCategoryColumns";

const CategoryTable = ({
  dataSource,
  loading,
  onEdit,
  onView
}) => {
  const columns = useCategoryColumns(onEdit, onView);

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

export default CategoryTable;