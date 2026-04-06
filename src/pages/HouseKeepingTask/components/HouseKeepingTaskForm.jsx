import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, DatePicker, Select, Button, Divider, TimePicker } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import {
    upsertHouseKeepingTask,
    getHouseKeepingTaskDetail,
    roomMeta,
    adminMeta,
    updateHouseKeepingTask
} from "../../../api/houseKeepingTaskApi";

const { TextArea } = Input;

const HouseKeepingTaskForm = ({
    mode,
    setMode,
    drawerOpen,
    setDrawerOpen,
    selectedRow,
    setSelectedRow,
    setPage,
    staffOptions
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isCreate = mode === "add";

    // ===== Options & Meta Data =====
    const initData = queryClient.getQueryData(["initData", "authenticated"]);

    const mapOptions = (data) =>
        data?.map((item) => ({ value: item.uuid, label: item.name })) || [];

    const priorityOptions = useMemo(() => mapOptions(initData?.statuses?.priority_level), [initData]);
    const taskTypeOptions = useMemo(() => mapOptions(initData?.statuses?.task_type), [initData]);
    const hkStatusOptions = useMemo(() => mapOptions(initData?.statuses?.housekeeping_status), [initData]);

    const { data: roomData } = useApiQuery({
        fetchQueryName: "room-meta",
        fetchQueryFunction: roomMeta,
        options: { enabled: drawerOpen }
    });

    const roomOptions = roomData?.rooms?.map((r) => ({
        value: r.uuid,
        label: `Room ${r.roomNo} - ${r.roomType?.name}`,
    }));

    // ===== Fetch Detail =====
    const { data: detail, isLoading } = useApiQuery({
        fetchQueryName: "housekeeping-task-detail",
        fetchQueryFunction: getHouseKeepingTaskDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    // ===== Fill Form =====
    useEffect(() => {
        if (detail && drawerOpen) {
            form.setFieldsValue({
                roomUuid: detail.room?.uuid,
                taskType: detail.taskType?.uuid,
                priorityLevel: detail.priorityLevel?.uuid,
                housekeepingStatus: detail.housekeepingStatus?.uuid,
                staff: detail.staff?.ids || [],
                plannedStartDate: detail.plannedStartAt ? dayjs(detail.plannedStartAt) : null,
                plannedStartTime: detail.plannedStartAt ? dayjs(detail.plannedStartAt) : null,
                plannedEndDate: detail.plannedEndAt ? dayjs(detail.plannedEndAt) : null,
                plannedEndTime: detail.plannedEndAt ? dayjs(detail.plannedEndAt) : null,
                remark: detail.remark,
            });
        }
        if (isCreate && drawerOpen) {
            form.resetFields();
        }
    }, [detail, form, drawerOpen, isCreate]);

    // ===== Mutations =====
    const createMutation = useApiMutation({
        mutationFn: upsertHouseKeepingTask,
        invalidateKeys: [["houseKeeping-tasks"]],
    });

    const updateMutation = useApiMutation({
        mutationFn: updateHouseKeepingTask,
        invalidateKeys: [["houseKeeping-tasks"]],
    });

    // Determine loading state for FormButtons
    const isPending = createMutation.isPending || updateMutation.isPending;

    const handleClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
        form.resetFields();
    };

    const formatDateTime = (dateSource, timeSource) => {
        if (!dateSource || !timeSource) return null;

        return dateSource
            .hour(timeSource.hour())
            .minute(timeSource.minute())
            .format("YYYY-MM-DD HH:mm");
    };

    const onFinish = (values) => {
        const { plannedStartDate, plannedStartTime, plannedEndDate, plannedEndTime } = values;

        // Merge the date from one and the time from the other
        const combinedDateTimeforPlanStart = formatDateTime(plannedStartDate, plannedStartTime);
        const combinedDateTimeforPlanEnd = formatDateTime(plannedStartDate, plannedEndTime);

        const payload = {
            uuid: isEdit ? selectedRow?.uuid : undefined,
            room: { uuid: values.roomUuid },
            taskType: { uuid: values.taskType },
            priorityLevel: { uuid: values.priorityLevel },
            housekeepingStatus: { uuid: values.housekeepingStatus },
            staff: { ids: values.staff || [] },
            plannedStartAt: combinedDateTimeforPlanStart,
            plannedEndAt: combinedDateTimeforPlanEnd,
            remark: values.remark,
        };

        if (isEdit) {
            updateMutation.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                    Toast.success("Cleaning schedule updated successfully");
                },
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                    setPage(1);
                    Toast.success("Cleaning schedule created successfully");
                },
            });
        }
    };

    return (
        <>
            <Drawer
                title={isView ? "Cleaning Schedule Details" : isEdit ? "Edit Cleaning Schedule" : "Create Cleaning Schedule"}
                size={550}
                onClose={handleClose}
                open={drawerOpen}
                extra={
                    isView ? (
                        <Button onClick={() => setMode("edit")} type="primary">Edit</Button>
                    ) : (
                        <FormButtons
                            onClick={() => form.submit()}
                            mode={mode}
                            isPending={isPending}
                        />
                    )
                }
            >
                {isLoading && !isCreate ?
                    <div className="flex h-64 items-center justify-center"><Loader /></div>
                    : (
                        <Form form={form} layout="vertical" onFinish={onFinish}>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="roomUuid" label="Room No" rules={[{ required: true }]}>
                                    <Select options={roomOptions} disabled={isView} placeholder="Select Room" />
                                </Form.Item>
                                <Form.Item name="taskType" label="Task Type" rules={[{ required: true }]}>
                                    <Select options={taskTypeOptions} disabled={isView} />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="priorityLevel" label="Priority" rules={[{ required: true }]}>
                                    <Select options={priorityOptions} disabled={isView} />
                                </Form.Item>
                                <Form.Item name="housekeepingStatus" label="Status" rules={[{ required: true }]}>
                                    <Select options={hkStatusOptions} disabled={isView} />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Date Field */}
                                <Form.Item
                                    name="plannedStartDate"
                                    label="Planned Date"
                                    rules={[{ required: true }]}
                                    className="flex-1"
                                >
                                    <DatePicker className="w-full" disabled={isView} />
                                </Form.Item>

                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item
                                        name="plannedStartTime"
                                        label="Plan Start Time"
                                        rules={[{ required: true }]}
                                        className="flex-1"
                                    >
                                        <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                    </Form.Item>

                                    <Form.Item
                                        name="plannedEndTime"
                                        label="Plan End Time"
                                        rules={[{ required: true }]}
                                        className="flex-1"
                                    >
                                        <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                    </Form.Item>
                                </div>

                            </div>

                            <Form.Item
                                name="staff"  // Changed from staffUuid to staffIds
                                label="Assign Staff"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    mode="multiple"
                                    options={staffOptions}
                                    disabled={isView}
                                    placeholder="Select Housekeepers"
                                    optionFilterProp="label"
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item name="remark" label="Remarks">
                                <TextArea rows={3} readOnly={isView} />
                            </Form.Item>
                        </Form>
                    )
                }
            </Drawer >
        </>

    );
};

export default HouseKeepingTaskForm;
