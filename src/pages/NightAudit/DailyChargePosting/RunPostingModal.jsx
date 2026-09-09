import { Modal } from "antd"

const RunPostingModal = ({
    onCancel,
    onOk,
    open,
    confirmLoading
}) => {

    return (
        <Modal
            title="Post Daily Charges?"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            confirmLoading={confirmLoading}
        >
            All eligible charges for the current business date will be posted to guest folios.
            Do you want to continue?
        </Modal>
    )
}

export default RunPostingModal;