import React, { useState, useEffect } from "react";
import { Drawer, Row, Col, Form, Input, Select, DatePicker, TimePicker, Button } from "antd";
import dayjs from "dayjs";
import { TeamOutlined, CalendarOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Loader from "../../../component/Loader/Loader";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
// import { getHouseKeepingTaskDetail } from "../../../api/houseKeepingTaskApi";
import {
    getHouseKeepingTaskAssignDetail,
    createHouseKeepingTaskAssign,
    updateHouseKeepingTaskAssign
} from "../../../api/houseKeepingTaskAssignApi";
import Toast from "../../../component/Toast/Toast";

const HouseKeepingTaskAssignForm = ({
    drawerOpen,
    setDrawerOpen,
    houseKeepingTaskDetail,
    staffOptions,
}) => {
    const [form] = Form.useForm();
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const detail = houseKeepingTaskDetail;

    //--- Staff Options for Create Dropdown ---
    const staffIds = detail?.staff?.ids || [];
    const notAssignedStaffs = staffOptions?.filter(item => !staffIds.includes(item.id)) || [];
    const isStaffListEmpty = notAssignedStaffs.length === 0;

    // --- Staff Options for Edit Dropdown ---
    const usedStaffIds = detail?.housekeepingTaskAssignments?.map(a => a.staff?.id) || [];
    const currentStaffId = isEdit ? selectedAssignment?.staff?.id : null;

    const staffOptionsForEdit = (staffOptions || []).filter(staff => {
        if (isEdit && staff.id === currentStaffId) return true;
        return !usedStaffIds.includes(staff.id);
    });

    // 2. Fetch Specific Assignment Detail for Edit
    const { data: assignDetailRaw, isLoading: isAssignDetailLoading } = useApiQuery({
        fetchQueryName: "housekeeping-task-assign-detail",
        fetchQueryFunction: getHouseKeepingTaskAssignDetail,
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
                    housekeepingTask: detail?.uuid,
                    assignedDate: dayjs(assignDetail.assignedAt),
                    assignedTime: dayjs(assignDetail.assignedAt),
                    startedDate: assignDetail.startedAt ? dayjs(assignDetail.startedAt) : null,
                    startedTime: assignDetail.startedAt ? dayjs(assignDetail.startedAt) : null,
                    completedTime: assignDetail.completedAt ? dayjs(assignDetail.completedAt) : null,
                });
            } else if (!isEdit) {
                form.resetFields();
                form.setFieldsValue({
                    housekeepingTask: detail?.uuid,
                });
            }
        }
    }, [assignDetail, createDrawerOpen, isEdit, form, detail]);

    // 5. Mutations
    const createMutation = useApiMutation({
        mutationFn: createHouseKeepingTaskAssign,
        invalidateKeys: [["housekeeping-task-detail"]],
    });

    const updateMutation = useApiMutation({
        mutationFn: updateHouseKeepingTaskAssign,
        invalidateKeys: [["housekeeping-task-detail"], ["houseKeeping-tasks"]],
    });

    // const formatDateTime = (dateSource, timeSource) => {
    //     if (!dateSource || !timeSource) return null;
    //     return dateSource
    //         .hour(timeSource.hour())
    //         .minute(timeSource.minute())
    //         .second(timeSource.second())
    //         .format("YYYY-MM-DD HH:mm:ss");
    // };

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
        const { assignedDate, assignedTime, startedDate, startedTime, completedTime } = values;

        let combinedDateTimeforStarted = formatDateTime(startedDate, startedTime);
        let combinedDateTimeforCompleted = startedTime ? formatDateTime(startedTime ? null : startedDate, completedTime) : null;
        combinedDateTimeforCompleted = completedTime ? formatDateTime(startedDate, completedTime) : null;

        const editPayload = {
            uuid: isEdit ? selectedAssignment?.uuid : null,
            housekeepingTask: { uuid: values.housekeepingTask },
            staff: isStaffListEmpty ? { uuid: assignDetail?.staff?.uuid } : { uuid: values.staff },
            startedAt: combinedDateTimeforStarted,
            completedAt: combinedDateTimeforCompleted,
        };

        const createPayload = {
            housekeepingTask: { uuid: detail?.uuid },
            staff: { uuid: values.staff },
        }

        if (isEdit) {
            updateMutation.mutate(editPayload,
                {
                    onSuccess: () => {
                        Toast.success("Cleaning assign updated");
                        setCreateDrawerOpen(false);
                    },
                }
            );
        } else {
            createMutation.mutate(createPayload, {
                onSuccess: () => {
                    Toast.success("Cleaning assign created");
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

    return (
        <Drawer
            title="Assigns"
            width={550}
            onClose={() => setDrawerOpen(false)}
            open={drawerOpen}
            extra={<Button type="primary" onClick={() => { setIsEdit(false); setSelectedAssignment(null); setCreateDrawerOpen(true); }}>Add New Assign</Button>}
        >
            {isAssignDetailLoading ? (
                <div className="flex h-64 items-center justify-center"><Loader /></div>
            ) : !detail?.housekeepingTaskAssignments?.length ? (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <TeamOutlined className="text-gray-300 text-3xl mb-2" />
                    <p className="text-gray-400 font-bold uppercase text-[10px]">No assigns found</p>
                </div>
            ) : (
                <Row gutter={[8, 8]}>
                    {detail.housekeepingTaskAssignments.map((item, index) => (
                        <Col span={12} key={item.uuid || index}>
                            <div
                                onClick={() => { setIsEdit(true); setSelectedAssignment(item); setCreateDrawerOpen(true); }}
                                className="bg-white border border-gray-200 rounded p-2 shadow-sm relative pt-5 cursor-pointer hover:border-blue-400 transition-all group h-full"
                            >
                                <div className="absolute top-0 left-0 px-2 py-0.5 bg-blue-500 rounded-br text-[12px] text-white font-bold">{item?.staff?.name}</div>
                                <TightRow label="Assigned" value={item.assignedAt ? dayjs(item.assignedAt).format("YYYY-MM-DD HH:mm:ss") : "-"} isDate />
                                <TightRow label="Started" value={item.startedAt ? dayjs(item.startedAt).format("YYYY-MM-DD HH:mm:ss") : "-"} isDate />
                                <TightRow label="Completed" value={item.completedAt ? dayjs(item.completedAt).format("YYYY-MM-DD HH:mm:ss") : "-"} isDate />
                            </div>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Inner Drawer for Create/Edit */}
            <Drawer
                title={isEdit ? "Edit Assign" : "New Assign"}
                width={550}
                onClose={() => setCreateDrawerOpen(false)}
                open={createDrawerOpen}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="housekeepingTask" hidden><Input /></Form.Item>

                    <div className="space-y-4">
                        {isEdit ? (
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
                                    options={staffOptionsForEdit}
                                    showSearch
                                    optionFilterProp="label"
                                    disabled={notAssignedStaffs.length === 0}
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
                                <Form.Item name="startedDate" label="Date">
                                    <DatePicker className="w-full" />
                                </Form.Item>
                                <div className="grid grid-cols-2 gap-4">
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
                                    <Form.Item name="completedTime" label="Completed Time">
                                        <TimePicker className="w-full" format="HH:mm:ss" />
                                    </Form.Item>
                                </div>
                            </div>
                        </>
                    )}

                    {(!isStaffListEmpty || isEdit) && (
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={createMutation.isPending || updateMutation.isPending}
                        >
                            {isEdit ? "Update Task Assignment" : "Confirm Task Assignment"}
                        </Button>
                    )}
                </Form>
            </Drawer>
        </Drawer>
    );
};

export default HouseKeepingTaskAssignForm;
