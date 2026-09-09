import { Input, Modal, Form } from "antd"
import { useApiMutation } from "../../hooks/useApiMutation";
import { systemLock, systemUnlock } from "../../api/nightAuditApi";
import Toast from "../../component/Toast/Toast";
import { useNavigate } from "react-router-dom";


const ConfirmModal = ({
    open,
    onCancel,
    activeAdminDatas
}) => {
    console.log(activeAdminDatas?.pages[0]?.nightAudit?.targetBusinessDate, "activeAdminDatasINConfrimMOdal")
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

    const nightAuditStorage = {
        isLocked: activeAdminDatas?.pages[0]?.systemLock?.isLocked,
        businessDate: activeAdminDatas?.pages[0]?.nightAudit?.targetBusinessDate,
    };
    
    const systemLockMutation = useApiMutation({
        mutationFn: systemLock,
        shouldInvalidate: false,
        options: {
            onSuccess: (data) => {
                Toast.success("System locked successfully");
                localStorage.setItem(
                    "nightAudit",
                    JSON.stringify(nightAuditStorage)
                );
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
            onError: () => {
                form.resetFields()
            }
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
        onCancel(false);
    };

    const handleForceLogoutToNavigate = () => {
        // try {
        //     const values = await form.validateFields();
        //     console.log(values, "handleForceLogout")

        //     systemLockMutation.mutate({
        //         systemLockKey: values?.locking
        //     });
        // }
        // catch (error) {
        //     console.log("Validationfailed:", error);
        // }
        // onCancel(false);
        window.dispatchEvent(
            new CustomEvent("breadcrumb_updated", {
                detail: {
                    stepValue: 0,
                    nightAuditStarted: true,
                },
            })
        );
        navigate("/night-audit/pre-audit-check");
    };
    return (
        <Modal
            title="Start Night Audit"
            open={open}
            onCancel={() => {
                onCancel();
                form.resetFields()
            }}
            onOk={handleForceLogout}
            okText="Start"
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
                    label="Night Audit Key"
                    rules={[{ required: true, message: 'Please enter the Night Audit Key' }]}
                    
                >
                    <Input placeholder="Enter Night Audit Key"/>
                </Form.Item>
            </Form>
            {/* Admins will remain logged in but will not be able to perform any operations while the Night Audit is in progress. Do you wish to continue? */}
        </Modal>
    )
}

export default ConfirmModal;