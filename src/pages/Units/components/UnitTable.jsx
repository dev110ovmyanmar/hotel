import React from "react";
import { Table } from "antd";
import useUnitColumns from "./useUnitColumns";

const UnitTable = ({
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

  const columns = useUnitColumns(onEdit, onView);

  return (
    <Table
      loading={loading}
      tableLayout="fixed"
      scroll={{ x: 1000 }}
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
  );
};

export default UnitTable;