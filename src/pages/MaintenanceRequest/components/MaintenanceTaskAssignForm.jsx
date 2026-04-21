import React, { useState, useEffect } from "react";
import { Drawer, Row, Col, Form, Input, Select, DatePicker, TimePicker, Button } from "antd";
import dayjs from "dayjs";
import { TeamOutlined, CalendarOutlined, ClockCircleOutlined, ExclamationCircleOutlined, EditOutlined } from "@ant-design/icons";
import Loader from "../../../component/Loader/Loader";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getMaintenanceTaskAssignmentDetail, createMaintenanceTaskAssignment, updateMaintenanceTaskAssignment } from "../../../api/maintenanceTaskAssignmentApi";
import Toast from "../../../component/Toast/Toast";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const MaintenanceTaskAssignForm = ({
    drawerOpen,
    setDrawerOpen,
    maintenanceTaskDetail,
    staffOptions,
}) => {
    const [form] = Form.useForm();
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const { TextArea } = Input;
    const detail = maintenanceTaskDetail;

    //--- Staff Options for Create Dropdown ---
    const staffIds = detail?.staff?.ids || [];
    const notAssignedStaffs = staffOptions?.filter(item => !staffIds.includes(item.id)) || [];
    const isStaffListEmpty = notAssignedStaffs.length === 0;

    // --- Staff Options for Edit Dropdown ---
    const usedStaffIds = detail?.maintenanceTaskAssignments?.map(a => a.staff?.id) || [];
    const currentStaffId = isEdit ? selectedAssignment?.staff?.id : null;

    const staffOptionsForEdit = (staffOptions || []).filter(staff => {
        if (isEdit && staff.id === currentStaffId) return true;
        return !usedStaffIds.includes(staff.id);
    });

    // 2. Fetch Specific Assignment Detail for Edit
    const { data: assignDetailRaw, isLoading: isAssignDetailLoading } = useApiQuery({
        fetchQueryName: "maintenance-task-assign-detail",
        fetchQueryFunction: getMaintenanceTaskAssignmentDetail,
        params: { uuid: selectedAssignment?.uuid },
        options: { enabled: !!selectedAssignment?.uuid && createDrawerOpen && isEdit },
    });

    const assignDetail = assignDetailRaw;

    // 4. Form Initialization
    useEffect(() => {
        if (createDrawerOpen) {
            if (isEdit && assignDetail) {
                form.setFieldsValue({
                    staff: assignDetail?.staff?.uuid,
                    maintenanceRequest: detail?.uuid,
                    startedDate: assignDetail.startedAt ? dayjs(assignDetail.startedAt) : null,
                    startedTime: assignDetail.startedAt ? dayjs(assignDetail.startedAt) : null,
                    completedDate: assignDetail.completedAt ? dayjs(assignDetail.completedAt) : null,
                    completedTime: assignDetail.completedAt ? dayjs(assignDetail.completedAt) : null,
                    remark: assignDetail.remark,
                });
            } else if (!isEdit) {
                form.resetFields();
                form.setFieldsValue({
                    maintenanceRequest: detail?.uuid,
                });
            }
        }
    }, [assignDetail, createDrawerOpen, isEdit, form, detail]);

    // 5. Mutations
    const createMutation = useApiMutation({
        mutationFn: createMaintenanceTaskAssignment,
        invalidateKeys: [["maintenance-request-detail"]],
    });

    const updateMutation = useApiMutation({
        mutationFn: updateMaintenanceTaskAssignment,
        invalidateKeys: [["maintenance-request-detail"], ["maintenance-requests"]],
    });

    const isDisableEdit = detail?.maintenanceStatus?.code === "resolved" || detail?.maintenanceStatus?.code === "verified";

    const formatDateTime = (dateSource, timeSource) => {
        // 1. If there is no date, we can't format anything
        if (!dateSource) return null;

        // 2. If there is a date but no time, return just the date
        if (!timeSource) {
            return dateSource.format("YYYY-MM-DD");
        }

        // 3. If both exist, merge them and return the full string
        return dateSource
            .hour(timeSource.hour())
            .minute(timeSource.minute())
            .second(timeSource.second())
            .format("YYYY-MM-DD HH:mm:ss");
    };

    const onFinish = (values) => {
        const { startedDate, startedTime, completedDate, completedTime } = values;

        const combinedDateTimeforStarted = formatDateTime(startedDate, startedTime);
        const combinedDateTimeforCompleted = formatDateTime(completedDate, completedTime);

        const editPayload = {
            uuid: isEdit ? selectedAssignment?.uuid : null,
            maintenanceRequest: { uuid: values?.maintenanceRequest },
            staff: isStaffListEmpty ? { uuid: assignDetail?.staff?.uuid } : { uuid: values.staff },
            startedAt: combinedDateTimeforStarted,
            completedAt: combinedDateTimeforCompleted,
            remark: values?.remark,
        };

        const createPayload = {
            maintenanceRequest: { uuid: detail?.uuid },
            staff: { uuid: values.staff },
            remark: values?.remark,
        }

        if (isEdit) {
            updateMutation.mutate(editPayload,
                {
                    onSuccess: () => {
                        Toast.success("Maintenance assign updated");
                        setCreateDrawerOpen(false);
                    },
                }
            );
        } else {
            createMutation.mutate(createPayload, {
                onSuccess: () => {
                    Toast.success("Maintenance assign created");
                    setCreateDrawerOpen(false);
                }
            });
        }
    };

    // UI Helpers (Tight Row Style)
    const TightRow = ({ label, value, isDate = false }) => (
        <div className="grid grid-cols-[75px_1fr] items-center py-1 border-b border-gray-50 last:border-0">
            <span>{label}</span>
            <div className="flex items-center pl-2 border-l border-gray-100 ml-1">
                <span>{value || "-"}</span>
            </div>
        </div>
    );

    // --- Business Logic & Mapping ---
    const maintenanceRequestStatusMap = {
        resolved: "resolved",
        verified: "verified",
        reported: "reported",
        assigned: "assigned",
        in_progress: "in_progress",
    };

    const firstItem = detail?.maintenanceStatus;
    const statusCode = detail?.maintenanceStatus?.code;
    const mappedCode = maintenanceRequestStatusMap[statusCode];

    const statusForTag = {
        code: mappedCode,
        name: firstItem?.name
    };

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Assigns</span>
                    <ColorStatusTag status={statusForTag} />
                </div>
            }
            size={550}
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            extra={isDisableEdit ? null :
                <Button type="primary"
                    onClick={() => {
                        setIsEdit(false);
                        setSelectedAssignment(null);
                        setCreateDrawerOpen(true);
                    }}>Add New Assign</Button>}
        >
            {isAssignDetailLoading ? (
                <div className="flex h-64 items-center justify-center"><Loader /></div>
            ) : !detail?.maintenanceTaskAssignments?.length ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <TeamOutlined className="text-gray-300 text-3xl mb-2" />
                    <p className="text-gray-400 font-bold uppercase text-[10px]">No assigns found</p>
                </div>
            ) : (
                <Row gutter={[8, 8]}>
                    {detail.maintenanceTaskAssignments.map((item, index) => (
                        <Col span={12} key={item.uuid || index}>
                            <div
                                onClick={() => { setIsEdit(true); setSelectedAssignment(item); setCreateDrawerOpen(true); }}
                                className="bg-white border border-gray-200 rounded p-2 shadow-sm relative pt-5 cursor-pointer hover:border-blue-400 transition-all group h-full"
                            >
                                <div className="absolute top-0 left-0 px-2 py-0.5 bg-blue-500 rounded-br text-[12px] text-white font-bold">{item?.staff?.name}</div>

                                <div className="absolute top-1 right-0 px-3 pb-3 pt-1 rounded-br-lg rounded-tl-lg text-[11px] tracking-wider">
                                    <span className="text-xs font-bold flex items-center justify-end gap-1">
                                        <EditOutlined className="text-[14px]" />
                                    </span>
                                </div>

                                <TightRow label="Started" value={item.startedAt ? dayjs(item.startedAt).format("YYYY-MM-DD HH:mm:ss") : "-"} isDate />
                                <TightRow label="Completed" value={item.completedAt ? dayjs(item.completedAt).format("YYYY-MM-DD HH:mm:ss") : "-"} isDate />
                                <TightRow label="Remark" value={item.remark ? item.remark : "-"} />
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Inner Drawer for Create/Edit */}
            <Drawer
                title={isEdit ? "Edit Assign" : "New Assign"}
                size={550}
                onClose={() => setCreateDrawerOpen(false)}
                open={createDrawerOpen}
                destroyOnClose
                extra={
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={form.submit}
                        block
                        loading={createMutation.isPending || updateMutation.isPending}
                    >
                        {isEdit ? "Update" : "Create"}
                    </Button>
                }
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="maintenanceRequest" hidden><Input /></Form.Item>

                    <div className="space-y-4">
                        {isEdit ? (
                            <Form.Item
                                name="staff"
                                label="Assigned Staff"
                                rules={[{ required: true, message: 'Please select a staff member' }]}
                                extra={
                                    isDisableEdit ? (
                                        <div className="flex items-center gap-1 text-red-500 text-[11px] mt-1 italic">
                                            <ExclamationCircleOutlined />
                                            <span>Issue is already resolved or verified.</span>
                                        </div>
                                    ) : notAssignedStaffs.length === 0 ? (
                                        <div className="flex items-center gap-1 text-red-500 text-[11px] mt-1 italic">
                                            <ExclamationCircleOutlined />
                                            <span>There are no more staff members available to assign.</span>
                                        </div>
                                    ) : null
                                }
                            >
                                <Select
                                    placeholder={isEdit ? "Select new staff to change..." : "Select staff"}
                                    options={staffOptionsForEdit}
                                    showSearch
                                    optionFilterProp="label"
                                    disabled={notAssignedStaffs.length === 0 || isDisableEdit}
                                    allowClear={isEdit}
                                />
                            </Form.Item>
                        ) :
                            (
                                <Form.Item
                                    name="staff"
                                    label="Assigned Staff"
                                    rules={[{ required: true, message: 'Please select a staff member' }]}
                                    extra={
                                        notAssignedStaffs.length === 0 ? (
                                            <div className="flex items-center gap-1 text-red-500 text-[11px] mt-1 italic">
                                                <ExclamationCircleOutlined />
                                                <span>There are no more staff members available to assign.</span>
                                            </div>
                                        ) : null
                                    }
                                >
                                    <Select
                                        placeholder={isEdit ? "Select new staff to change..." : "Select staff"}
                                        options={notAssignedStaffs}
                                        showSearch
                                        optionFilterProp="label"
                                        disabled={notAssignedStaffs.length === 0}
                                        allowClear={isEdit}
                                    />
                                </Form.Item>
                            )}
                    </div>

                    {isEdit && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="startedDate" label="Started Date">
                                    <DatePicker className="w-full" />
                                </Form.Item>
                                {/* <Form.Item name="startedTime" label="Started Time">
                                    <TimePicker className="w-full" format="HH:mm:ss" />
                                </Form.Item> */}
                                <Form.Item
                                    name="startedTime"
                                    label="Started Time"
                                    dependencies={['startedDate']} // Re-checks logic when startedDate changes
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const date = form.getFieldValue('startedDate');
                                                // If a date exists but time is missing, throw an error
                                                if (date && !value) {
                                                    return Promise.reject(new Error('Please select a time for this date!'));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <TimePicker className="w-full" format="HH:mm:ss" />
                                </Form.Item>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item name="completedDate" label="Completed Date">
                                    <DatePicker className="w-full" />
                                </Form.Item>
                                {/* <Form.Item name="completedTime" label="Completed Time">
                                    <TimePicker className="w-full" format="HH:mm:ss" />
                                </Form.Item> */}
                                <Form.Item
                                    name="completedTime"
                                    label="Completed Time"
                                    dependencies={['completedDate']} // Re-checks logic when startedDate changes
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const date = form.getFieldValue('completedDate');
                                                // If a date exists but time is missing, throw an error
                                                if (date && !value) {
                                                    return Promise.reject(new Error('Please select a time for this date!'));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <TimePicker className="w-full" format="HH:mm:ss" />
                                </Form.Item>
                            </div>
                        </>
                    )}

                    <Form.Item name="remark" label="Remark">
                        <TextArea rows={3} placeholder="Enter Remark" />
                    </Form.Item>

                </Form>
            </Drawer>
        </Drawer>
    );
};

export default MaintenanceTaskAssignForm;
