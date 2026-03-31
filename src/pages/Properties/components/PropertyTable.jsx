import React from "react";
import { Table } from "antd";
import usePropertiesColumns from "./usePropertiesColumns";

const PropertyTable = ({ 
   dataSource,
   isLoading,
   onEdit,
   onView,
   onUpload,
   page,
   perPage,
   changePage,
   changePerPage,
   total,
   }) => {

  const columns = usePropertiesColumns(onEdit, onView, onUpload);

  return (
            <div id="scrollId" className="w-full h-[63vh]">
             <Table
                scroll={{ x: 1000 }}
                loading={isLoading}
                columns={columns}
                dataSource={dataSource}
                rowKey="uuid"
                className="mx-5"
                pagination={{ 
                    current: page,
                    pageSize: perPage,
                    total : total,
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

export default PropertyTable;
