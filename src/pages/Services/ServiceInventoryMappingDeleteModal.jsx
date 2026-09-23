import { Modal } from "antd"

const ServiceInventoryMappingDeleteModal = ({
    open,
    onOk,
    onCancel,
    confirmLoading
}) => {

    return (
        <Modal
            title="Confirmation Delete"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            confirmLoading={confirmLoading}
        >
            Are you sure you want to delete this item?

        </Modal>
    )
}

export default ServiceInventoryMappingDeleteModal;