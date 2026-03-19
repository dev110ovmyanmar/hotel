import React from "react";
import { Table } from "antd";
import useCategoryColumns from "./useCategoryColumns";

const CategoryTable = ({
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
  const columns = useCategoryColumns(onEdit, onView);

  return (
    <div className="mx-5">
      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
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
        // size="middle"
      />
    </div>
  );
};

export default CategoryTable;