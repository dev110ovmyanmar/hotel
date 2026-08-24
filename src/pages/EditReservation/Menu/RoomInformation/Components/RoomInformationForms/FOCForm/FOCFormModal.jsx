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

    // Handle form submission
    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                // Create payload and clean it
                const payload = { ...values };

                // Remove complimentary fields if switch is OFF
                if (!payload.isComplimentary) {
                    delete payload.complimentaryType;
                    delete payload.complimentaryReason;
                }

                // Call parent onSubmit with cleaned payload
                onSubmit(payload);
            })
            .catch((error) => {
                console.error('Validation failed:', error);
            });
    };

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
                    onClick={handleSubmit}  // Use custom handler
                >
                    Save
                </Button>,
            ]}
        >
            <Form 
                form={form} 
                layout="vertical" 
                className="mt-4" 
                onValuesChange={onValuesChange}
            >
                <Form.Item
                    name="isComplimentary"
                    label="Is Complimentary"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                {/* Conditional fields - only shown when switch is ON */}
                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) => 
                        prev.isComplimentary !== curr.isComplimentary
                    }
                >
                    {({ getFieldValue }) => {
                        const isComplimentary = getFieldValue('isComplimentary');
                        return isComplimentary ? (
                            <>
                                <Form.Item
                                    name="complimentaryType"
                                    label="Complimentary Type"
                                    rules={[{ required: true, message: 'Please select a complimentary type' }]}
                                >
                                    <Select placeholder="Select type">
                                        {complimentaryTypes?.map((type) => (
                                            <Option key={type.code} value={type.code}>
                                                {type.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="complimentaryReason"
                                    label="Reason"
                                    rules={[{ required: true, message: 'Please enter a reason' }]}
                                >
                                    <Input.TextArea rows={3} placeholder="Enter reason" />
                                </Form.Item>
                            </>
                        ) : null;
                    }}
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default FOCFormModal