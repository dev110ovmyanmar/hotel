import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertHouseKeeping, getHouseKeepingDetail, roomMeta } from "../../../api/houesKeepingStatusApi";
import FormItem from "antd/es/form/FormItem";

const { TextArea } = Input;

const HouseKeepingStatusForm = ({
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

    // 1. Get Global Options (Clean Statuses and Priority Levels)
    const initData = queryClient.getQueryData(["initData", "authenticated"]);

    const cleanStatusOptions = useMemo(() =>
        initData?.statuses?.clean_status?.map(s => ({ value: s.uuid, label: s.name })) || [], [initData]);

    const priorityOptions = useMemo(() =>
        initData?.statuses?.priority_level?.map(p => ({ value: p.uuid, label: p.name })) || [], [initData]);

    // 2. API Query for single Detail
    const { data: houseKeepingStatusDetail, isLoading } = useApiQuery({
        fetchQueryName: "housekeeping-detail",
        fetchQueryFunction: getHouseKeepingDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    //room data
    const { data: roomData } = useApiQuery({
        fetchQueryName: "room-meta",
        fetchQueryFunction: roomMeta,
    });

    const roomList = roomData?.rooms?.map((room) => ({
        value: room.uuid,
        label: room.roomNo,
    }));

    // 3. Fill Form
    useEffect(() => {
        if (houseKeepingStatusDetail) {
            form.setFieldsValue({
                roomUuid: houseKeepingStatusDetail.room?.uuid,
                cleanStatus: houseKeepingStatusDetail.cleanStatus?.uuid,
                priorityLevel: houseKeepingStatusDetail.priorityLevel?.uuid,
                remark: houseKeepingStatusDetail.remark,
            });
        }
    }, [houseKeepingStatusDetail, form, drawerOpen]);

    const upsertMutation = useApiMutation({
        mutationFn: upsertHouseKeeping,
        invalidateKeys: [["houseKeeping-statuses"]],
        shouldInvalidate: true
    });

    const onFinish = (values) => {
        const payload = {
            uuid: selectedRow?.uuid, // Housekeeping status uuid for update
            room: { uuid: values.roomUuid },
            cleanStatus: { uuid: values.cleanStatus },
            priorityLevel: { uuid: values.priorityLevel },
            remark: values.remark,
        };

        upsertMutation.mutate(payload, {
            onSuccess: () => {
                setDrawerOpen(false);
                Toast.success("Room status updated successfully.");
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
            title={isView ? "Room Status Details" : "Update Room Status"}
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
                <div className="flex h-64 items-center justify-center"><Loader /></div>
                : (
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="roomUuid" hidden><Input /></Form.Item>
                        <Form.Item label="Room" className="flex-2">
                            <Input
                                value={houseKeepingStatusDetail?.room?.roomNo}
                                disabled={true}
                            />
                        </Form.Item>

                        < div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label="Clean Status"
                                name="cleanStatus"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Select options={cleanStatusOptions} disabled={isView} placeholder="Select Clean Status" />
                            </Form.Item>

                            <Form.Item
                                label="Priority Level"
                                name="priorityLevel"
                                rules={[{ required: true, message: 'Required' }]}
                            >
                                <Select options={priorityOptions} disabled={isView} placeholder="Select Priority Level" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item label="Started At">
                                <Input
                                    className="bg-gray-50 text-gray-500" // Visual cue that it is read-only
                                    readOnly
                                    value={
                                        houseKeepingStatusDetail?.startedAt
                                            ? dayjs(houseKeepingStatusDetail?.startedAt).format("YYYY-MM-DD HH:mm:ss")
                                            : "----"
                                    }
                                />
                            </Form.Item>

                            <Form.Item label="Completed At">
                                <Input
                                    className="bg-gray-50 text-gray-500"
                                    readOnly
                                    value={
                                        houseKeepingStatusDetail?.completedAt
                                            ? dayjs(houseKeepingStatusDetail?.completedAt).format("YYYY-MM-DD HH:mm:ss")
                                            : "----"
                                    }
                                />
                            </Form.Item>
                        </div>

                        <Form.Item label="Remark" name="remark">
                            <TextArea
                                rows={3}
                                readOnly={isView}
                                placeholder="Enter Remark"
                            />
                        </Form.Item>
                    </Form>
                )}
        </Drawer>
    );
};

export default HouseKeepingStatusForm;