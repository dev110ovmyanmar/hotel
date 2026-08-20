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
    { title: "Service Name", dataIndex: ["service", "name"], key: "name"},
    { title: "Quantity", dataIndex: "quantityPerService", key: "quantityPerService", align: "center" },
    { title: "Unit", dataIndex: ["unit", "name"], key: "unit", align: "center" },
  ];

  const expandedRowRender = (record) => {
    
    return (
      <>
        <Table
          className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
          columns={expandColumns}
          dataSource={record.serviceInventoryMappings || []}
          rowKey="uuid"
          pagination={record.serviceInventoryMappings?.length > 10 ? true : false}
          size="small"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        />

      </>
    );
  };

  return (
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