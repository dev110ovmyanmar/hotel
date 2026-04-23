import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, Select, Button } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertSupplier, getSupplierDetail } from "../../../api/supplierApi";
import Status from "../../../component/Status/Status";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const { TextArea } = Input;

const SupplierForm = ({
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

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    const { hasPermission } = usePermission();
    const canEdit = hasPermission(PERMISSIONS.SUPPLIER_EDIT);

    // 1. Get Global Options from Cache
    const initData = queryClient.getQueryData(["initData", "authenticated"]);

    // 3. API Query for Supplier Detail
    const { data, isLoading } = useApiQuery({
        fetchQueryName: "supplier-detail",
        fetchQueryFunction: getSupplierDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    // console.log("DataAPI", data);

    const supplierData = data;

    // 4. Fill Form when data arrives
    useEffect(() => {
        if (isAdd) {
            form.resetFields()
        } else if (supplierData) {
            form.setFieldsValue({
                ...supplierData,
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
            status: values.status ? values.status : null,
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
                            <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                                <Input readOnly={isView} placeholder="Enter Phone Number" />
                            </Form.Item>
                        </div>

                        <div className="col-span-6">
                            <Form.Item label="Email" name="email">
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
                            <Status isView={isView} />
                        </div>
                    </div>
                </Form>
            )}
        </Drawer>
    );
};

export default SupplierForm;