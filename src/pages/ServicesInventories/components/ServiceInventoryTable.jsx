import React from "react";
import { Table } from "antd";
import useServiceInventoryColumns from "./useServiceInventoryColumns";

const ServiceInventoryTable = ({
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
  const columns = useServiceInventoryColumns(onEdit, onView);

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Service Name", dataIndex: ["service", "name"], key: "name" },
    { title: "Quantity", dataIndex: "quantityPerService", key: "quantityPerService" },
    { title: "Unit", dataIndex: ["unit", "name"], key: "unit" },
  ];

  const expandedRowRender = (record) => {
    return (
      <>
        <Table
          className="custom-table-style"
          columns={expandColumns}
          dataSource={record.serviceInventoryMappings || []}
          rowKey="uuid"
          pagination={false}
          size="small"
        />

      </>
    );
  };

  return (
    <Table
      tableLayout="fixed"
      scroll={{ x: 1000 }}
      loading={loading}
      columns={columns}
      expandable={{
        expandedRowRender,
        rowExpandable: (record) => record?.serviceInventoryMappings.length > 0
      }}
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
  );
};

export default ServiceInventoryTable;