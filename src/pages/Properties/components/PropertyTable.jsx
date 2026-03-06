import React from 'react'
import { Table } from 'antd';
import usePropertiesColumns from './usePropertiesColumns'

const PropertyTable = ({
    dataSource,
    isLoading,
    onEdit,
    onView
}) => {
    const columns = usePropertiesColumns(onEdit, onView);

    return (
        <>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="uuid"
                loading={isLoading}
            />
        </>
    )
}

export default PropertyTable