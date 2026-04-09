import React from "react";
import { Table } from "antd";
import useGuestColumns from "./useNewGuestColumns";

const GuestTable = ({
  dataSource,
  loading,
  onEdit,
  onView,
  onViewNotes,
  page,
  perPage,
  changePage,
  changePerPage,
  total,
  onFileUpload,
}) => {
  const columns = useGuestColumns(onEdit, onView, onViewNotes, onFileUpload);

  return (
    <div id="scrollId">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        loading={loading}
        columns={columns}
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
    </div>
  );
};

export default GuestTable;
