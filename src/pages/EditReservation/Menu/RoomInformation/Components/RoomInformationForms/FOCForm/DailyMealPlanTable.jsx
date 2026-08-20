import React, { useState } from 'react'
import { Table, Form } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import { useApiMutation } from "../../../../../../../hooks/useApiMutation";
import { updateMealPlanFOC } from "../../../../../../../api/dailyOccupactionApi";
import Toast from '../../../../../../../component/Toast/Toast';
import { queryClient } from '../../../../../../../app/queryClient';
import FOCFormModal from './FOCFormModal';



const DailyMealPlanTable = ({ 
    data, 
    mealPricingMode, 
    complimentaryTypes,
    occupancyUuid, 
    selectedRow,
    onSuccess,
    isDatePastCheck
 }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [hasChanges, setHasChanges] = useState(false)
    const [form] = Form.useForm()

    const mealPlanMutation = useApiMutation({
        mutationFn: updateMealPlanFOC,
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
            isComplimentary: selectedRow?.isMealComplimentary,
            complimentaryType: selectedRow?.mealComplimentaryType,
            complimentaryReason: selectedRow?.mealComplimentaryReason,
        })
        setModalOpen(true)
    }

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const payload = {
                uuid: occupancyUuid,
                isComplimentary: values.isComplimentary,
                complimentaryType: values.complimentaryType || null,
                complimentaryReason: values.complimentaryReason || null,
            }
            mealPlanMutation.mutate(payload)
        }).catch((err) => {
            console.log('validateFields error:', err)
        })
    }


    const isSeparate = mealPricingMode === 'separate'
    const isMealComplimentary = selectedRow?.isMealComplimentary
    console.log("IsMeal", isMealComplimentary);

    const dataSource = [{ ...data, key: data?.uuid || 'meal-plan', mealPricingMode, isMealComplimentary }]

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (val) => <span className="font-semibold text-slate-700 dark:text-gray-200">{val}</span>,
        },
        {
            title: 'Pricing Mode',
            dataIndex: 'mealPricingMode',
            key: 'mealPricingMode',
            align: 'center',
            render: (val) => <div>{val}</div>,
        },
        {
            title: 'Type',
            dataIndex: 'complimentaryType',
            key: 'complimentaryType',
            render: () => (
                <span className="text-xs">
                    <span className="font-semibold text-slate-700 dark:text-gray-200">
                        {selectedRow?.mealComplimentaryType || '-'}
                    </span>
                    {selectedRow?.mealComplimentaryReason && (
                        <span className="text-slate-500 dark:text-gray-400">
                            {' '}({selectedRow?.mealComplimentaryReason})
                        </span>
                    )}
                </span>
            ),
        },
        {
            title: 'Complimentary',
            key: 'isMealComplimentary',
            align: 'center',
            render: () =>
                <div className={selectedRow?.isMealComplimentary === true ? "text-[#389E0D]" : "text-[#CF1322]"}>
                    {selectedRow?.isMealComplimentary === true ? "True" : "False"}
                </div>,
        },
        {
            title: "Total",
            key: 'total',
            align: 'center',
            render: () => <span>
                {selectedRow?.mealCharge}
            </span>
        }
        ,
        ...((!isDatePastCheck && isSeparate) ? [{
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
                    Meal Plan
                </h3>
                <div className="rounded-lg border border-slate-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden bg-white shadow-sm">
                    <Table
                        size="small"
                        rowKey={(record) => record.key}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                        tableLayout="auto"
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
                loading={mealPlanMutation.isPending}
                record={selectedRecord}
                editType="mealPlan"
                complimentaryTypes={complimentaryTypes}
                form={form}
                hasChanges={hasChanges}
                onValuesChange={() => setHasChanges(true)}
            />
        </>
    )
}

export default DailyMealPlanTable
