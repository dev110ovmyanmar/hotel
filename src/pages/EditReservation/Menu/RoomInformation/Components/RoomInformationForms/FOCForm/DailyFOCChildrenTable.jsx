import React, { useState } from 'react'
import { Table, Form } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useApiMutation } from "../../../../../../../hooks/useApiMutation";
import { updateChildrenFOC } from "../../../../../../../api/dailyOccupactionApi";
import Toast from '../../../../../../../component/Toast/Toast';
import { queryClient } from '../../../../../../../app/queryClient';
import FOCFormModal from './FOCFormModal';

const DailyFOCChildrenTable = ({ data = [], complimentaryTypes, onSuccess, isDatePastCheck }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [hasChanges, setHasChanges] = useState(false)
    const [form] = Form.useForm()

    const childMutation = useApiMutation({
        mutationFn: updateChildrenFOC,
        invalidateKeys: [["dailyOccupactions"]],
        options: {
            onSuccess: () => {
                Toast.success("FOC Updated Successfully")
                setModalOpen(false)
                setSelectedRecord(null)
                form.resetFields()
                onSuccess?.()
            },
            onError: (error) => {
               console.log(error);
            },
        },
    })

    const handleEdit = (record) => {
        setSelectedRecord(record)
        setHasChanges(false)
        form.setFieldsValue({
            isComplimentary: record.isComplimentary,
            complimentaryType: record.complimentaryType,
            complimentaryReason: record.complimentaryReason,
        })
        setModalOpen(true)
    }

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const payload = {
                uuid: selectedRecord.uuid,
                isComplimentary: values.isComplimentary,
                complimentaryType: values.complimentaryType || null,
                complimentaryReason: values.complimentaryReason || null,
            }
            childMutation.mutate(payload)
        })
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'childSequence',
            key: 'childSequence',
            align: 'center',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            align: 'center',
        },
                {
        title: 'Type',
        dataIndex: 'complimentaryType',
        key: 'complimentary',
        render: (_, record) => (
        <span className="text-xs">
            <span className="font-semibold text-slate-700 dark:text-gray-200">
                {record.complimentaryType || '-'}
            </span>
            {record.complimentaryReason && (
                <span className="text-slate-500 dark:text-gray-400">
                    {' '}({record.complimentaryReason})
                </span>
            )}
        </span>
        ),
        },
        {
            title: 'Complimentary',
            dataIndex: 'isComplimentary',
            key: 'isComplimentary',
            align: 'center',
            render: (val) =>
            <div
            className={val === true ? "text-[#389E0D]" : "text-[#CF1322]"}
            >
            {val === true ? "True" : "False"}
            </div>
        },
        {
            title: 'Total',
            dataIndex: 'chargeAmount',
            key: 'chargeAmount',
            align: 'right',
            render: (val) => <span>{val?.toLocaleString() ?? '0'}</span>,
        },
        ...((!isDatePastCheck) ? [{
        title: 'Action',
        key: 'action',
        width: 40,
        align: 'center',
        render: (_, record) => (
        <EditOutlined
        className="text-blue-500 hover:text-blue-700 cursor-pointer"
        onClick={() => handleEdit(record)}
        />
  ),
}] : [])
    ]

    return (
        <>
            <div className="bg-slate-100 dark:bg-gray-900 p-4 rounded-lg">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">
                    Children
                </h3>
                <div className="rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <Table
                        size="small"
                        rowKey={(record) => record.uuid}
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        tableLayout="auto"
                        rowClassName={(_, index) =>
                            index % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-slate-50/60 dark:bg-gray-800/50"
                        }
                    />
                </div>
            </div>

            <FOCFormModal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false)
                    setSelectedRecord(null)
                    form.resetFields()
                }}
                onSubmit={handleSubmit}
                loading={childMutation.isPending}
                record={selectedRecord}
                editType="child"
                complimentaryTypes={complimentaryTypes}
                form={form}
                hasChanges={hasChanges}
                onValuesChange={() => setHasChanges(true)}
            />
        </>
    )
}

export default DailyFOCChildrenTable
