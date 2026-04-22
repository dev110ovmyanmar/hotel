import { Modal } from "antd"


const ConfirmModal = ({
    open,
    onCancel,
    onOk

}) => {
    const stylesFn = {
        content: {
            borderRadius: 14,
            border: "1px solid #ccc",
            padding: 0,
            overflow: "hidden",
        },
        header: {
            padding: 16,
            borderBottom: "1px solid #e5e5e5",
        },
        body: {
            padding: 16,
        },
        footer: {
            padding: "16px",
            backgroundColor: "#fafafa",
            borderTop: "1px solid #e5e5e5",
        },
    };


    return (
        <Modal

            title="Confirm Force Logout"
            open={open}
            onCancel={onCancel}
            onOk={onOk}
            okText="Confirm"
            styles={stylesFn}
        >
            The action will forcefully logout all other users after alerting them. Do you wish to continue?

        </Modal>
    )
}

export default ConfirmModal