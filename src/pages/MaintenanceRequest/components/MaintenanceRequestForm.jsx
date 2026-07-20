import React, { useEffect, useMemo } from "react";
import { Form, Input, Drawer, DatePicker, Select, Button, TimePicker, Row, Col, Divider } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import {
    getMaintenanceRequestDetail,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    adminMeta,
} from "../../../api/maintenanceRequestApi";
import MaintenanceTaskAssignForm from "./MaintenanceTaskAssignForm";
import { houseKeepingAndMaintenanceRequestDarkMode } from "../../../utils";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const { TextArea } = Input;

const MaintenanceRequestForm = ({
    mode,
    setMode,
    drawerOpen,
    setDrawerOpen,
    selectedRow,
    setSelectedRow,
    setPage,

    //for task assign
    taskAssignDrawerOpen,
    setTaskAssignDrawerOpen,
    // staffOptionsforAssignment,
    onViewTaskAssign,
}) => {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const { hasPermission } = usePermission();
    const viewPermission = hasPermission(PERMISSIONS.MAINTENANCE_REQUEST_VIEW);
    const editPermission = hasPermission(PERMISSIONS.MAINTENANCE_REQUEST_EDIT);
    const taskAssignmentViewPermission = hasPermission(PERMISSIONS.MAINTENANCE_TASK_ASSIGNMENT_VIEW);

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isCreate = mode === "add";

    const initData = queryClient.getQueryData(["initData", "authenticated"]);
    const mapOptions = (data) => data?.map((item) => ({ value: item.uuid, label: item.name })) || [];

    const priorityOptions = useMemo(() => mapOptions(initData?.statuses?.priority_level),
        [initData]);
    const issueTypeOptions = useMemo(() => mapOptions(initData?.statuses?.issue_type),
        [initData]);
    const maintenanceStatusOptions = useMemo(() => mapOptions(initData?.statuses?.maintenance_status),
        [initData]);

    const { data: adminMetaData } = useApiQuery({
        fetchQueryName: "admin-meta",
        fetchQueryFunction: adminMeta,
        options: { enabled: drawerOpen }
    });

    const staffOptions = useMemo(() =>
        adminMetaData?.staffs?.filter(s => s.department?.code === "maintenance_engineering")
            .map(s => ({ value: s.id, label: s.name })),
        [adminMetaData]);

    const staffOptionsforAssignment = useMemo(() =>
        adminMetaData?.staffs?.filter(s => s.department?.code === "maintenance_engineering")
            .map(s => ({ value: s.uuid, label: s.name, id: s.id })),
        [adminMetaData]);

    const roomOptions = useMemo(() =>
        adminMetaData?.rooms?.map(r => ({ value: r.uuid, label: `Room ${r.roomNo}` })), [adminMetaData]);

    const departmentOptions = useMemo(() =>
        adminMetaData?.departments?.map(d => ({ value: d.uuid, label: d.name })), [adminMetaData]);

    const { data: detail, isLoading } = useApiQuery({
        fetchQueryName: "maintenance-request-detail",
        fetchQueryFunction: getMaintenanceRequestDetail,
        params: { uuid: selectedRow?.uuid },
        options: { enabled: !!selectedRow?.uuid && drawerOpen },
    });

    const reportedStatus = initData?.statuses?.maintenance_status?.find(s => s.code === "reported");

    const isDisableEdit = detail?.maintenanceStatus?.code === "verified";

    useEffect(() => {
        if (!drawerOpen) return;

        if (detail && (isView || isEdit)) {
            form.setFieldsValue({
                name: detail.name,
                roomUuid: detail.room?.uuid,
                issueType: detail.issueType?.uuid,
                priorityLevel: detail.priorityLevel?.uuid,
                maintenanceStatus: detail.maintenanceStatus?.uuid,
                staff: detail.staff?.ids || [],
                reportedFrom: detail.reportedFrom?.uuid,
                plannedStartDate: detail.plannedStartAt ? dayjs(detail.plannedStartAt) : null,
                plannedStartTime: detail.plannedStartAt ? dayjs(detail.plannedStartAt) : null,
                plannedEndDate: detail.plannedEndAt ? dayjs(detail.plannedEndAt) : null,
                plannedEndTime: detail.plannedEndAt ? dayjs(detail.plannedEndAt) : null,
                issueDescription: detail.issueDescription,
            });
        }

        if (isCreate) {
            form.resetFields();
            form.setFieldsValue({ maintenanceStatus: reportedStatus.uuid });
        }
    }, [detail, drawerOpen, isCreate, isView, isEdit, form, queryClient, initData, selectedRow]);

    // 6. Form Submission Logic
    const createMutation = useApiMutation({
        mutationFn: createMaintenanceRequest,
        invalidateKeys: [["maintenance-requests"]],
    });

    const updateMutation = useApiMutation({
        mutationFn: updateMaintenanceRequest,
        invalidateKeys: [["maintenance-requests"]],
    });

    const handleClose = () => {
        setDrawerOpen(false);
        setSelectedRow(null);
        form.resetFields();
    };

    const formatDateTime = (dateSource, timeSource) => {
        if (!dateSource || !timeSource) return null;
        return dateSource.hour(timeSource.hour()).minute(timeSource.minute()).format("YYYY-MM-DD HH:mm:ss");
    };

    const onFinish = (values) => {
        const createPayload = {
            name: values.name,
            issueDescription: values.issueDescription,
            room: { uuid: values.roomUuid },
            issueType: { uuid: values.issueType },
            priorityLevel: { uuid: values.priorityLevel },
            maintenanceStatus: { uuid: values.maintenanceStatus },
            reportedFrom: { uuid: values.reportedFrom },
            staff: { ids: values.staff || [] },
            plannedStartAt: formatDateTime(values.plannedStartDate, values.plannedStartTime),
            plannedEndAt: formatDateTime(values.plannedEndDate, values.plannedEndTime),
        };

        const updatePayload = {
            uuid: detail?.uuid,
            name: values.name,
            issueDescription: values.issueDescription,
            room: { uuid: values.roomUuid },
            issueType: { uuid: values.issueType },
            priorityLevel: { uuid: values.priorityLevel },
            maintenanceStatus: { uuid: values.maintenanceStatus },
            reportedFrom: { uuid: values.reportedFrom },
            housekeepingTask: detail?.housekeepingTask?.uuid ? { uuid: detail?.housekeepingTask?.uuid } : null,
            plannedStartAt: formatDateTime(values.plannedStartDate, values.plannedStartTime),
            plannedEndAt: formatDateTime(values.plannedEndDate, values.plannedEndTime),
        }

        if (isEdit) {
            updateMutation.mutate(updatePayload, {
                onSuccess: () => {
                    handleClose();
                    if (!isEdit) setPage(1);
                    Toast.success(`Maintenance request ${isEdit ? 'updated' : 'created'} successfully`);
                },
            });
        } else {
            createMutation.mutate(createPayload, {
                onSuccess: () => {
                    handleClose();
                    if (!isEdit) setPage(1);
                    Toast.success(`Maintenance request ${isEdit ? 'updated' : 'created'} successfully`);
                },
            });
        }

    };

    return (
        <>
            <Drawer
                title={isView ? "Maintenance Request Details" : isEdit ? "Edit Maintenance Request" : "New Maintenance Request"}
                size={550}
                onClose={handleClose}
                open={drawerOpen}
                extra={
                    isDisableEdit ? null :
                        isView ? (editPermission && <Button onClick={() => setMode("edit")} type="primary">Edit</Button>) :
                            <FormButtons onClick={() => form.submit()} mode={mode} isPending={createMutation.isPending || updateMutation.isPending} />}
            >
                {isLoading && !isCreate ? <div className="flex h-64 items-center justify-center"><Loader /></div> : (
                    <div>
                        <Form form={form} layout="vertical" onFinish={onFinish}>

                            {
                                detail?.housekeepingTask && (
                                    <div className="mb-4">
                                        <span className="text-blue-500 font-medium">Source HouseKeeping Task Id: #{detail?.housekeepingTask?.id}</span>
                                    </div>
                                )
                            }

                            {isCreate && (
                                <>
                                    <Form.Item name="housekeepingTask" noStyle><Input hidden /></Form.Item>
                                </>
                            )}

                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <Input readOnly={isView} placeholder="Enter Maintenance Request" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="roomUuid"
                                        label="Room"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView
                                                ? roomOptions?.find((item) => item.value === value)?.label
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} />
                                                :
                                                <Select options={roomOptions} disabled={isView || detail?.housekeepingTask} placeholder="Select Room" />
                                        }
                                    </Form.Item>

                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="issueType"
                                        label="Issue Type"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView
                                                ? issueTypeOptions?.find((item) => item.value === value)?.label
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <Select options={issueTypeOptions} disabled={isView} placeholder="Select Issue Type" />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="priorityLevel"
                                        label="Priority"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView
                                                ? priorityOptions?.find((item) => item.value === value)?.label
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <Select options={priorityOptions} disabled={isView} placeholder="Select Priority" />
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    {isCreate ? (
                                        <Form.Item
                                            name="maintenanceStatus"
                                            label="Maintenance Status"
                                            rules={[{ required: true, message: "Please select status" }]}
                                        >
                                            <Select
                                                options={maintenanceStatusOptions}
                                                // open={true? !true: undefined}
                                                disabled={true}

                                            />
                                        </Form.Item>
                                    ) : (
                                        <Form.Item
                                            name="maintenanceStatus"
                                            label="Maintenance Status"
                                            rules={[{ required: true }]}
                                            getValueProps={(value) => ({
                                                value: isView
                                                    ? maintenanceStatusOptions?.find((item) => item.value === value)?.label
                                                    : value,
                                            })}
                                        >
                                            {
                                                isView ? <Input readOnly={isView} /> :
                                                    <Select
                                                        options={maintenanceStatusOptions}
                                                        disabled={isView}
                                                        // disabled={true}
                                                        placeholder="Select Maintenance Status" />
                                            }
                                        </Form.Item>
                                    )
                                    }
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="plannedStartDate" label="Start Date"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView && value
                                                ? dayjs(value).format("YYYY-MM-DD")
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} />
                                                :
                                                <DatePicker className="w-full" disabled={isView} />

                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="plannedStartTime" label="Start Time"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView && value
                                                ? dayjs(value).format("HH:mm")
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="plannedEndDate" label="End Date"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView && value
                                                ? dayjs(value).format("YYYY-MM-DD")
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <DatePicker className="w-full" disabled={isView} />
                                        }
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="plannedEndTime" label="End Time"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView && value
                                                ? dayjs(value).format("HH:mm")
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <TimePicker className="w-full" format="HH:mm" disabled={isView} />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                {
                                    isCreate && (
                                        <Col span={12}>
                                            <Form.Item name="staff" label="Staff">
                                                <Select options={staffOptions} open={isView ? !isView : undefined}
                                                    mode="multiple" placeholder="Select Staff" />
                                            </Form.Item>
                                        </Col>
                                    )
                                }
                                <Col span={12}>
                                    <Form.Item name="reportedFrom" label="Reporting Department"
                                        rules={[{ required: true }]}
                                        getValueProps={(value) => ({
                                            value: isView
                                                ? departmentOptions?.find((item) => item.value === value)?.label
                                                : value,
                                        })}
                                    >
                                        {
                                            isView ?
                                                <Input readOnly={isView} /> :
                                                <Select options={departmentOptions} disabled={isView || detail?.housekeepingTask} placeholder="Select Dept" />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="issueDescription" label="Description" rules={[{ required: true }]}>
                                <TextArea rows={4} readOnly={isView} placeholder="Enter Description" />
                            </Form.Item>
                        </Form>


                        {(isEdit || isView) && (
                            <div className="flex justify-end mt-5">
                                {
                                    taskAssignmentViewPermission &&
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewTaskAssign(detail);
                                        }}
                                        className={`flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded text-[12px] border border-gray-100 hover:border-blue-200 transition-all ${houseKeepingAndMaintenanceRequestDarkMode}`}
                                    >
                                        <TeamOutlined /> Staff Assigns
                                    </button>
                                }
                            </div>
                        )}
                    </div>
                )}

            </Drawer >

            {/* Second Drawer */}
            < MaintenanceTaskAssignForm
                drawerOpen={taskAssignDrawerOpen}
                setDrawerOpen={setTaskAssignDrawerOpen}
                maintenanceTaskDetail={detail}
                staffOptions={staffOptionsforAssignment}
                setPage={setPage}
            />
        </>

    );
};

export default MaintenanceRequestForm;