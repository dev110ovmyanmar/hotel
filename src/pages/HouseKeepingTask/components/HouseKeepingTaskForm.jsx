import React, { useEffect, useMemo, useState } from "react";
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
import HouseKeepingTaskAssignForm from "./HousKeepingTaskAssignForm";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import MaintenanceRequestFromHK from "./MaintenanceRequestFromHK";
import { houseKeepingAndMaintenanceRequestDarkMode } from "../../../utils";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

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
    adminMetaData,
    onViewTaskAssign,
    taskAssignDrawerOpen,
    setTaskAssignDrawerOpen,
    staffOptionsforAssignment
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const [maintenanceRequestDrawerOpen, setMaintenanceRequestDrawerOpen] = useState(false);

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isCreate = mode === "add";

    const { hasPermission } = usePermission();
    const viewPermission = hasPermission(PERMISSIONS.HK_TASK_VIEW);
    const editPermission = hasPermission(PERMISSIONS.HK_TASK_EDIT);

    // ===== Options & Meta Data =====
    const initData = queryClient.getQueryData(["initData", "authenticated"]);

    const mapOptions = (data) =>
        data?.map((item) => ({ value: item.uuid, label: item.name })) || [];

    const priorityOptions = useMemo(() => mapOptions(initData?.statuses?.priority_level), [initData]);
    const taskTypeOptions = useMemo(() => mapOptions(initData?.statuses?.task_type), [initData]);

    // ===== Fetch Detail =====
    const { data: detail, isLoading } = useApiQuery({
        fetchQueryName: "housekeeping-task-detail",
        fetchQueryFunction: getHouseKeepingTaskDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    const statusCode = detail?.housekeepingStatus?.code;
    const editCurrentStatus = statusCode || selectedRow?.housekeepingStatus?.code;
    const isDisableEdit = statusCode === "completed" || statusCode === "cancelled";

    const hkStatusOptions = initData?.statuses?.housekeeping_status?.map((item) => {
        return (
            {
                value: item.uuid,
                label: item.name,
                disabled:
                    isView ||

                    (
                        isEdit &&
                        (
                            (
                                editCurrentStatus === "pending" &&
                                ["in_progress", "completed"].includes(item.code)
                            ) ||
                            (
                                editCurrentStatus === "in_progress" &&
                                ["pending", "cancelled"].includes(item.code)
                            )
                        )
                    )

            }
        )
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
        invalidateKeys: [["houseKeeping-tasks"], ["admin-meta"]],
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

    const handleNext = () => {
        setMaintenanceRequestDrawerOpen(true);
    };

    return (
        <>
            <Drawer
                title={isView ? "Housekeeping Task Details" : isEdit ? "Edit Housekeeping Task" : "Create Housekeeping Task"}
                size={600}
                onClose={handleClose}
                open={drawerOpen}
                extra={
                    isDisableEdit ? null : ( // If disabled, show nothing
                        isView ? (
                            editPermission && <Button onClick={() => setMode("edit")} type="primary">Edit</Button>
                        ) : (
                            <FormButtons
                                onClick={() => form.submit()}
                                mode={mode}
                                isPending={isPending}
                            />
                        )
                    )
                }
            >
                {isLoading && !isCreate ?
                    <div className="flex h-64 items-center justify-center"><Loader /></div>
                    : (
                        <div>
                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                <div className="grid grid-cols-2 gap-4">

                                    <Form.Item
                                        name="roomUuid"
                                        label="Room No"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => {
                                            const room = adminMetaData?.rooms?.find((r) => r.uuid === value);
                                            if (isView) {
                                                return {
                                                    value: `Room ${room?.roomNo}`,
                                                    suffix: (
                                                        <ColorStatusTag
                                                            status={{
                                                                code: room?.housekeepingStatus?.cleanStatus?.code,
                                                                name: room?.housekeepingStatus?.cleanStatus?.name
                                                            }}
                                                        />
                                                    )
                                                };
                                            }
                                            return { value };
                                        }}
                                    >
                                        {isView ? <Input readOnly /> :
                                            <Select
                                                options={roomOptions}
                                                disabled={isView}
                                                placeholder="Select Room"
                                                showSearch
                                                optionFilterProp="searchLabel"
                                                filterOption={(input, option) =>
                                                    String(option?.searchLabel ?? "")
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                            />}
                                    </Form.Item>

                                    <Form.Item name="taskType" label="Task Type" rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView
                                                ? taskTypeOptions?.find((item) => item.value === value)?.label
                                                : value,
                                        })}>
                                        {
                                            isView ? <Input readOnly={isView} /> :
                                                <Select options={taskTypeOptions} disabled={isView} placeholder="Select Task Type" />
                                        }
                                    </Form.Item>

                                </div>

                                <div className="grid grid-cols-2 gap-4">

                                    <Form.Item name="priorityLevel"
                                        label="Priority" rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView
                                                ? priorityOptions?.find((item) => item.value === value)?.label
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <Select
                                                    options={priorityOptions}
                                                    disabled={isView}
                                                    placeholder="Select Priority" />
                                        }
                                    </Form.Item>

                                    {
                                        isCreate ? (
                                            <Form.Item
                                                name="housekeepingStatus"
                                                label="Housekeeping Status"
                                                rules={[{ required: true, message: "Please select status" }]}
                                                getValueProps={(value) => ({
                                                    value: isCreate
                                                        ? hkStatusOptions?.find((item) => item.value === value)?.label
                                                        : value,
                                                })}
                                            >
                                                <Input readOnly={isCreate} /> 
                                            </Form.Item>
                                        ) : (
                                            <Form.Item name="housekeepingStatus"
                                                label="Housekeeping Status"
                                                rules={[{ required: true }]}
                                                getValueProps={(value) => ({
                                                    value: isView
                                                        ? hkStatusOptions?.find((item) => item.value === value)?.label
                                                        : value,
                                                })}
                                            >
                                                {
                                                    isView ?
                                                        <Input readOnly={isView} /> :
                                                        <Select
                                                            options={hkStatusOptions}
                                                            disabled={isView}
                                                            placeholder="Select Housekeeping Status" />
                                                }
                                            </Form.Item>
                                        )
                                    }
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Form.Item
                                        name="plannedStartDate"
                                        label="Plan Date"
                                        rules={[{ required: true }]}
                                        className="flex-1"
                                        getValueProps={(value) => ({
                                            value: isView && value
                                                ? dayjs(value).format("YYYY-MM-DD")
                                                : value,
                                        })}
                                    >
                                        {isView ? (
                                            <Input readOnly={isView} />
                                        ) : (
                                            <DatePicker className="w-full" placeholder="Select Date" />
                                        )}
                                    </Form.Item>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Form.Item
                                            name="plannedStartTime"
                                            label="Start Time"
                                            rules={[{ required: true }]}
                                            className="flex-1"
                                            getValueProps={(value) => ({
                                                value: isView && value
                                                    ? dayjs(value).format("HH:mm")
                                                    : value,
                                            })}
                                        >
                                            {
                                                isView ? <Input readOnly={isView} /> :
                                                    <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                            }
                                        </Form.Item>

                                        <Form.Item
                                            name="plannedEndTime"
                                            label="End Time"
                                            rules={[{ required: true }]}
                                            className="flex-1"
                                            getValueProps={(value) => ({
                                                value: isView && value
                                                    ? dayjs(value).format("HH:mm")
                                                    : value,
                                            })}
                                        >
                                            {
                                                isView ? <Input readOnly={isView} /> :
                                                    <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                            }
                                        </Form.Item>

                                    </div>

                                </div>

                                {
                                    isCreate && (
                                        <Form.Item
                                            name="staff"  // Changed from staffUuid to staffIds
                                            label="Assign Staff"
                                        >
                                            <Select
                                                mode="multiple"
                                                options={staffOptions}
                                                disabled={isView}
                                                placeholder="Select Staffs"
                                                optionFilterProp="label"
                                                allowClear
                                            />
                                        </Form.Item>
                                    )
                                }

                                <Form.Item name="remark" label="Remarks">
                                    <TextArea rows={3} readOnly={isView} placeholder="Enter Remarks" />
                                </Form.Item>
                            </Form>

                            {
                                (isEdit || isView) ? (
                                    editPermission &&
                                    <div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewTaskAssign(detail);
                                                }}
                                                className={`flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded text-[12px] border border-gray-100 hover:border-blue-200 transition-all ${houseKeepingAndMaintenanceRequestDarkMode}`}
                                            >
                                                <TeamOutlined /> Staff Assigns
                                            </button>
                                        </div>
                                        {
                                            isDisableEdit ? null :
                                                <div className="flex justify-end gap-3 mt-6">
                                                    <button onClick={handleNext} className={`flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded text-[12px] border border-gray-100 hover:border-blue-200 transition-all ${houseKeepingAndMaintenanceRequestDarkMode}`}>
                                                        Transfer Maintenance Request <ArrowRightOutlined /></button>
                                                </div>
                                        }

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
                houseKeepingTaskDetail={detail}
                staffOptions={staffOptionsforAssignment}
                setPage={setPage}
            />

            <MaintenanceRequestFromHK
                drawerOpen={maintenanceRequestDrawerOpen}
                setDrawerOpen={setMaintenanceRequestDrawerOpen}
                houseKeepingTaskDetail={detail}
                initData={initData}
                adminMetaData={adminMetaData}
            />
        </>

    );
};

export default HouseKeepingTaskForm;
