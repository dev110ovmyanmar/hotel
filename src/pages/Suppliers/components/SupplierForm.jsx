import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, Select, Button } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertSupplier, getSupplierDetail } from "../../../api/supplierApi";
import { phoneValidator, emailValidator } from "../../../variables/constants";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import { validatePhoneNumber } from "../../../utils";

const { TextArea } = Input;

const SupplierForm = ({
    statusOptions,
    mode,
    setMode,
    drawerOpen,
    setDrawerOpen,
    selectedRow,
    setSelectedRow,
    setPage,
    page,
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const phoneValue = Form.useWatch("phone", form);

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    const { hasPermission } = usePermission();
    const canEdit = hasPermission(PERMISSIONS.SUPPLIER_EDIT);

    const { data, isLoading } = useApiQuery({
        fetchQueryName: "supplier-detail",
        fetchQueryFunction: getSupplierDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    const supplierData = data;

    useEffect(() => {
        if (isAdd) {
            form.resetFields()
        } else if (supplierData) {
            form.setFieldsValue({
                ...supplierData,
                status: supplierData.status?.uuid,
            });
        }
    }, [supplierData, isAdd, form]);

    const upsertMutation = useApiMutation({
        mutationFn: upsertSupplier,
        invalidateKeys: [["suppliers"]],
        shouldInvalidate: page === 1
    });

    const onFinish = (values) => {
        const payload = {
            ...values,
            status: { uuid: values.status },
            uuid: isEdit ? selectedRow?.uuid : null,
        };

        upsertMutation.mutate(payload, {
            onSuccess: () => {
                setDrawerOpen(false);
                if (isAdd) setPage(1);
                Toast.success(`Supplier ${isEdit ? "Updated" : "Created"} successfully.`);
            },
        });
    };

    const handleClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
        form.resetFields();
    };

    return (
        <Drawer
            title={isView ? "Supplier Details" : isEdit ? "Edit Supplier" : "Add Supplier"}
            size={550}
            afterOpenChange={(open) => {
                if (open && isAdd) {
                    form.resetFields();
                    const defaultStatus = statusOptions?.find((s) => s.label.toLowerCase() === 'active')?.value;
                    form.setFieldsValue({ status: defaultStatus });
                }
            }}
            onClose={handleClose}
            open={drawerOpen}
            extra={isView ?
                canEdit && (
                    <Button type="primary" onClick={() => setMode("edit")}>Edit</Button>
                ) : (
                    <FormButtons onClick={() => form.submit()} mode={mode} isPending={upsertMutation.isPending} />
                )}
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-full min-h-[300px]">
                    <Loader />
                </div>
            ) : (
                <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
                    <div className="grid grid-cols-12 gap-x-4">
                        <div className="col-span-12">
                            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                                <Input readOnly={isView} placeholder="Enter Supplier Name" />
                            </Form.Item>
                        </div>
                        <div className="col-span-6">
                            <Form.Item label="Code" name="code" rules={[{ required: true }]}>
                                <Input readOnly={isView} placeholder="Enter Supplier Code" />
                            </Form.Item>
                        </div>

                        <div className="col-span-6">
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    { required: true },
                                    // {
                                    //     validator: validatePhoneNumber
                                    // }
                                ]}
                            >
                                <Input
                                    readOnly={isView}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key) &&
                                            !(e.key === "+" && value.length === 0)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    placeholder="Enter Phone Number"
                                />
                            </Form.Item>
                        </div>

                        <div className="col-span-6">
                            <Form.Item label="Email" name="email" rules={[{ validator: emailValidator }]}>
                                <Input readOnly={isView} placeholder="Enter Email Address" />
                            </Form.Item>
                        </div>

                        <div className="col-span-6">
                            <Form.Item label="Contact Person" name="contactPerson" rules={[{ required: true }]}>
                                <Input readOnly={isView} placeholder="Enter Contact Person" />
                            </Form.Item>
                        </div>


                        <div className="col-span-12">
                            <Form.Item label="Website" name="website">
                                <Input readOnly={isView} placeholder="Enter Website Address" />
                            </Form.Item>
                        </div>

                        <div className="col-span-12">
                            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                                <TextArea rows={2} readOnly={isView} placeholder="Enter Address" />
                            </Form.Item>
                        </div>

                        <div className="col-span-12">
                            <Form.Item label="Remark" name="remark">
                                <TextArea rows={2} readOnly={isView} placeholder="Enter Remark" />
                            </Form.Item>
                        </div>

                        <div className="col-span-12">
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: "Status is required" }]}
                            >
                                <Select
                                    options={statusOptions || []}
                                    placeholder="Select Status"
                                    open={isView ? false : undefined}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            )}
        </Drawer>
    );
};

export default SupplierForm;