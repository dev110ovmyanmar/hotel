import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, DatePicker, Select, Button, Divider, TimePicker } from "antd";
import { ClockCircleOutlined, ArrowRightOutlined, TeamOutlined } from "@ant-design/icons";
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
    updateHouseKeepingTask
} from "../../../api/houseKeepingTaskApi";
import { useNavigate } from "react-router-dom";
import HouseKeepingTaskAssignForm from "./HousKeepingTaskAssignForm";

const { TextArea } = Input;

const HouseKeepingTaskForm = ({
    mode,
    setMode,
    drawerOpen,
    setDrawerOpen,
    selectedRow,
    setSelectedRow,
    setPage,
    staffOptions,
    roomOptions,
    onViewTaskAssign,
    taskAssignDrawerOpen,
    setTaskAssignDrawerOpen,
    staffOptionsforAssignment
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
            const houseKeepingStatus = initData?.statuses?.housekeeping_status?.find(s => s.code === "pending");
            form.setFieldsValue({
                housekeepingStatus: houseKeepingStatus.uuid,
            })
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
            .format("YYYY-MM-DD HH:mm:ss");
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
                    Toast.success("House Keeping Task updated successfully");
                },
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => {
                    handleClose();
                    setPage(1);
                    Toast.success("House Keeping Task created successfully");
                },
            });
        }
    };


    const navigate = useNavigate();

    const handleNext = async () => {
        try {
            queryClient.setQueryData(["housekeeping-task-detail"], detail);
            setDrawerOpen(false);
            navigate("/maintenance-request?triggerOpen=true");
        } catch (error) {
            console.log("Failed:", error);
        }
    };

    return (
        <>
            <Drawer
                title={isView ? "Housekeeping Task Details" : isEdit ? "Edit Housekeeping Task" : "Create Housekeeping Task"}
                size={600}
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
                        <div>
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
                                    {/* <Form.Item name="housekeepingStatus" label="Status" rules={[{ required: true }]}>
                                        <Select options={hkStatusOptions} disabled={isView} />
                                    </Form.Item> */}
                                    {isCreate ? (
                                        <Form.Item
                                            name="housekeepingStatus"
                                            label="Housekeeping Status"
                                            rules={[{ required: true, message: "Please select status" }]}
                                        >
                                            <Select
                                                options={hkStatusOptions}
                                                disabled={true}
                                            />
                                        </Form.Item>
                                    ) : (
                                        <Form.Item name="housekeepingStatus" label="Housekeeping Status" rules={[{ required: true }]}>
                                            <Select
                                                options={hkStatusOptions}
                                                disabled={isView}
                                                placeholder="Select Housekeeping Status" />
                                        </Form.Item>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Date Field */}
                                    <Form.Item
                                        name="plannedStartDate"
                                        label="Plan Date"
                                        rules={[{ required: true }]}
                                        className="flex-1"
                                    >
                                        <DatePicker className="w-full" disabled={isView} />
                                    </Form.Item>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Form.Item
                                            name="plannedStartTime"
                                            label="Start Time"
                                            rules={[{ required: true }]}
                                            className="flex-1"
                                        >
                                            <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                        </Form.Item>

                                        <Form.Item
                                            name="plannedEndTime"
                                            label="End Time"
                                            rules={[{ required: true }]}
                                            className="flex-1"
                                        >
                                            <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                        </Form.Item>
                                    </div>

                                </div>

                                {
                                    isCreate && (
                                        <Form.Item
                                            name="staff"  // Changed from staffUuid to staffIds
                                            label="Assign Staff"
                                        // rules={[{ required: true }]}
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
                                    )
                                }

                                <Form.Item name="remark" label="Remarks">
                                    <TextArea rows={3} readOnly={isView} />
                                </Form.Item>
                            </Form>

                            {
                                (isEdit || isView) ? (
                                    <div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewTaskAssign(detail);
                                                }}
                                                className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded text-[12px] border border-gray-100 hover:border-blue-200 transition-all"
                                            >
                                                <TeamOutlined /> Staff Assigns
                                            </button>
                                        </div>

                                        <div className="flex justify-end gap-3 mt-6">
                                            <button onClick={handleNext} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded text-[12px] border border-gray-100 hover:border-blue-200 transition-all">
                                                Transfer to Maintenance Request <ArrowRightOutlined /></button>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                    )
                }
            </Drawer >

            {/* Second Drawer */}
            <HouseKeepingTaskAssignForm
                drawerOpen={taskAssignDrawerOpen}
                setDrawerOpen={setTaskAssignDrawerOpen}
                // selectedRow={selectedRow}
                // setSelectedRow={setSelectedRow}
                houseKeepingTaskDetail={detail}
                // mode={currentMode}
                staffOptions={staffOptionsforAssignment}
                setPage={setPage}
            />
        </>

    );
};

export default HouseKeepingTaskForm;
