import { Modal } from "antd"
import { IoFastFoodOutline } from "react-icons/io5";

const ServiceInventoryMappingDeleteModal = ({
    open,
    onOk,
    onCancel,
    confirmLoading,
    deleteServiceInventoryName
}) => {

    return (
        <Modal
            title="Delete Confirmation"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            confirmLoading={confirmLoading}
        >
            <div className="space-y-3 py-2">
                <p className="text-gray-700">
                    Are you sure you want to delete this item?
                </p>
                <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
                    <IoFastFoodOutline className="h-4 w-4 text-blue-500" />     
                    <span className="font-semibold text-blue-700">
                        {deleteServiceInventoryName}
                    </span>
                </div>
            </div>
        </Modal>
    )
}

export default ServiceInventoryMappingDeleteModal;