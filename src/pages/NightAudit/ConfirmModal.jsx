import { Input, Modal, Form } from "antd"
import { useApiMutation } from "../../hooks/useApiMutation";
import { systemLock } from "../../api/nightAuditApi";
import Toast from "../../component/Toast/Toast";
import { useNavigate } from "react-router-dom";


const ConfirmModal = ({
    open,
    onCancel
}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

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

    const tailwindcss = {
        footer: "dark:!bg-[#1F1F1F] dark:!border-[#e5e5e5]"
    }

    const systemLockMutation = useApiMutation({
        mutationFn: systemLock,
        shouldInvalidate: false,
        options: {
            onSuccess: (data) => {
                Toast.success("System locked successfully");
                onCancel(false);
                window.dispatchEvent(
                    new CustomEvent("breadcrumb_updated", {
                        detail: {
                            stepValue: 0,
                            nightAuditStarted: true,
                        },
                    })
                );
                navigate("/night-audit/pre-audit-check");
                form.resetFields()

            },
        },
    });

    const handleForceLogout = async () => {
        try {
            const values = await form.validateFields();
            console.log(values, "handleForceLogout")

            systemLockMutation.mutate({
                systemLockKey: values?.locking
            });
        }
        catch (error) {
            console.log("Validationfailed:", error);
        }
    };

    return (
        <Modal
            title="Confirm Night Audit"
            open={open}
            onCancel={onCancel}
            onOk={handleForceLogout}
            okText="Confirm"
            styles={stylesFn}
            classNames={tailwindcss}
            confirmLoading={systemLockMutation?.isPending}
        >
            <Form
                form={form}
            >
                <Form.Item
                    name="locking"
                    layout="vertical"
                    label="Locking"
                    rules={[{ required: true, message: 'Please input locking !' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
            {/* Admins will remain logged in but will not be able to perform any operations while the Night Audit is in progress. Do you wish to continue? */}
        </Modal>
    )
}

export default ConfirmModal