import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, Button, InputNumber, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertRestaurantTable, getRestaurantTableDetail } from "../../../api/restaurantTableApi";
import { queryClient } from "../../../app/queryClient";
import { MIN_SEAT_CAPACITY, MAX_SEAT_CAPACITY } from "../../../variables/constants";


const RestaurantTableForm = ({
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

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    // 1. API Query for Table Detail
    const { data, isLoading } = useApiQuery({
        fetchQueryName: "table-detail",
        fetchQueryFunction: getRestaurantTableDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    // Extract the nested 'response' object from your JSON
    const tableData = data;

    const initData = queryClient.getQueryData(["initData", "authenticated"]);
    const tableStatusOptions = useMemo(() =>
        initData?.statuses?.table_status?.map(s => ({ value: s.uuid, label: s.name })) || [], [initData]);

    // 2. Fill Form when data arrives
    useEffect(() => {
        if (isAdd) {
            form.resetFields();
        } else if (tableData) {
            form.setFieldsValue({
                ...tableData,
                tableStatus: tableData.tableStatus?.uuid
            });
        }
    }, [tableData, isAdd, form]);

    const upsertMutation = useApiMutation({
        mutationFn: upsertRestaurantTable,
        invalidateKeys: [["restaurant-tables"]],
        shouldInvalidate: page === 1
    });

    const onFinish = (values) => {
        const payload = {
            tableNo: values.tableNo,
            capacity: values.capacity,
            tableStatus: values.tableStatus ? { uuid: values.tableStatus } : null,
            uuid: isEdit ? selectedRow?.uuid : null,
        };

        upsertMutation.mutate(payload, {
            onSuccess: () => {
                setDrawerOpen(false);
                if (isAdd) setPage(1);
                Toast.success(`Table ${isEdit ? "Updated" : "Created"} successfully.`);
            },
        });
    };

    const handleClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
        form.resetFields();
    };

    const sharedProps = {
        mode: "spinner",
        min: MIN_SEAT_CAPACITY,
        max: MAX_SEAT_CAPACITY,
        style: { width: "100%" },
    };

    return (
        <Drawer
            title={isView ? "Restaurant Table Details" : isEdit ? "Edit Restaurant Table" : "Add Restaurant Table"}
            size={550}
            onClose={handleClose}
            open={drawerOpen}
            extra={isView ? (
                <Button type="primary" onClick={() => setMode("edit")}>Edit</Button>
            ) : (
                <FormButtons onClick={() => form.submit()} mode={mode} isPending={upsertMutation.isPending} />
            )}
        >
            {isLoading ?
                <div className="flex items-center justify-center h-full min-h-[300px]">
                    <Loader />
                </div>
                : (
                    <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
                        <div className="grid grid-cols-12 gap-x-4">

                            <div className="col-span-6">
                                <Form.Item
                                    label="Restaurant Table Number"
                                    name="tableNo"
                                    rules={[{ required: true, message: 'Please input table number' }]}
                                >
                                    <Input readOnly={isView} placeholder="Enter Table Number" />
                                </Form.Item>
                            </div>

                            <div className="col-span-6">
                                <Form.Item
                                    label="Restaurant Table (Seats)"
                                    name="capacity"
                                    rules={[{ required: true, message: 'Please input capacity' }]}
                                >
                                    <InputNumber {...sharedProps} placeholder="Enter Seats Quantity" disabled={isView} />

                                </Form.Item>
                            </div>

                            <div className="col-span-12 mt-4">
                                <Form.Item
                                    label="Status"
                                    name="tableStatus"
                                    rules={[{ required: true, message: 'Please select status' }]}
                                >
                                    <Select
                                        placeholder="Select Table Status"
                                        disabled={isView}
                                        options={tableStatusOptions}
                                    />
                                </Form.Item>
                            </div>

                        </div>
                    </Form>
                )}
        </Drawer>
    );
};

export default RestaurantTableForm;