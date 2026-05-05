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
    { title: "ID", dataIndex: "id", key: "id" , align:"center"},
    { title: "Service Name", dataIndex: ["service", "name"], key: "name", align: "center" },
    { title: "Quantity", dataIndex: "quantityPerService", key: "quantityPerService", align: "center" },
    { title: "Unit", dataIndex: ["unit", "name"], key: "unit", align: "center" },
  ];

  const expandedRowRender = (record) => {
    
    return (
      <>
        <Table
          // className="custom-table-style"
          className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
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