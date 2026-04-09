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
          className="nested-table"
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
    <div id="scrollId" className="w-full h-[63vh]">
      <Table
        scroll={{ x: 1000 }}
        loading={loading}
        columns={columns}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.serviceInventoryMappings.length > 0
        }}
        dataSource={dataSource}
        rowKey="uuid"
        className="mx-5"
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

export default ServiceInventoryTable;