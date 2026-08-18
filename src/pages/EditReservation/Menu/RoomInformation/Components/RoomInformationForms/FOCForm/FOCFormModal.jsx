import React from 'react'
import { Modal, Form, Select, Input, Button, Switch } from 'antd'

const FOCFormModal = ({
    open,
    onCancel,
    onSubmit,
    loading,
    record,
    editType,
    complimentaryTypes,
    form,
    hasChanges,
    onValuesChange,
}) => {
    const title = `Edit FOC - ${
        editType === 'extra'
            ? record?.extraType?.replace('_', ' ')
            : editType === 'mealPlan'
                ? `${record?.code ?? ''} ${record?.name ?? ''}`
                : `Child ${record?.childSequence ?? ''}`
    }`

    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    disabled={!hasChanges}
                    onClick={onSubmit}
                >
                    Save
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" className="mt-4" onValuesChange={onValuesChange}>
                <Form.Item
                    name="complimentaryType"
                    label="Complimentary Type"
                    rules={[{ required: true, message: 'Please select a complimentary type' }]}
                >
                    <Select placeholder="Select type">
                        {complimentaryTypes?.map((type) => (
                            <Select.Option key={type.code} value={type.code}>
                                {type.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="complimentaryReason"
                    label="Reason"
                >
                    <Input.TextArea rows={3} placeholder="Enter reason" />
                </Form.Item>

                <Form.Item
                    name="isComplimentary"
                    label="Is Complimentary"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FOCFormModal
