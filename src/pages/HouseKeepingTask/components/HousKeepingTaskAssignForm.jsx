import React, { useState, useEffect } from "react";
import { Drawer, Row, Col, Form, Input, Select, DatePicker, TimePicker, Button, Tag, Modal } from "antd";
import dayjs from "dayjs";
import { TeamOutlined, CalendarOutlined, ClockCircleOutlined, ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Loader from "../../../component/Loader/Loader";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";

import {
    getHouseKeepingTaskAssignDetail,
    createHouseKeepingTaskAssign,
    updateHouseKeepingTaskAssign,
    deleteHouseKeepingTaskAssign
} from "../../../api/houseKeepingTaskAssignApi";
import Toast from "../../../component/Toast/Toast";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { darkModeStyle } from "../../../utils";

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

    const [deleteModal, setDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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
        invalidateKeys: [["housekeeping-task-detail"], ["houseKeeping-tasks"]],
    });

    const updateMutation = useApiMutation({
        mutationFn: updateHouseKeepingTaskAssign,
        invalidateKeys: [["housekeeping-task-detail"], ["houseKeeping-tasks"], ["admin-meta"]],
    });

    const deleteMutation = useApiMutation({
        mutationFn: deleteHouseKeepingTaskAssign,
        invalidateKeys: [["housekeeping-task-detail"], ["houseKeeping-tasks"]],
    })

    const formatDateTime = (dateSource, timeSource) => {
        if (!dateSource) return null;

        if (!timeSource) {
            return dateSource.format("YYYY-MM-DD");
        }

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

    const openDeleteModal = (e, item) => {
        e.stopPropagation();
        setItemToDelete(item);
        setDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete?.uuid) return;

        try {
            const response = await deleteMutation.mutateAsync({
                params: { uuid: itemToDelete.uuid }
            });

            Toast.success(response);
            setDeleteModal(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const TightRow = ({ label, value, isDate = false }) => (
        <div className="grid grid-cols-[75px_1fr] items-center py-1 border-b border-gray-50 last:border-0">
            <span>{label}</span>
            <div className="flex items-center pl-2 border-l border-gray-100 ml-1">
                <span>{value || "-"}</span>
            </div>
        </div>
    );

    const hkTaskStatusMap = {
        completed: "completed",
        pending: "pending",
        in_progress: "in_progress",
        cancelled: "cancelled",
    };

    const firstItem = detail?.housekeepingStatus;
    const statusCode = detail?.housekeepingStatus?.code;
    const isDisableEdit = statusCode === "completed" || statusCode === "cancelled";
    const mappedCode = hkTaskStatusMap[statusCode];

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
            extra={
                (!isDisableEdit) ? (
                    <Button type="primary" onClick={() => {
                        setIsEdit(false);
                        setSelectedAssignment(null);
                        setCreateDrawerOpen(true);
                    }}>
                        Add New Assign
                    </Button>
                ) : null
            }
        >
            {
                isAssignDetailLoading ? (
                    <div className="flex h-64 items-center justify-center" > <Loader /></div>
                ) : !detail?.housekeepingTaskAssignments?.length ? (
                    <div className={`flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50 ${darkModeStyle}`}>
                        <TeamOutlined className="text-gray-300 text-3xl mb-2" />
                        <p className="text-gray-400 font-bold uppercase text-[10px]">No assigns found</p>
                    </div>
                ) : (
                    <div>
                        <Row gutter={[8, 8]}>
                            {detail.housekeepingTaskAssignments.map((item, index) => (
                                <Col span={12}>
                                    <div
                                        onClick={
                                            isDisableEdit ? null :
                                                () => {
                                                    setIsEdit(true);
                                                    setSelectedAssignment(item);
                                                    setCreateDrawerOpen(true);
                                                }
                                        }
                                        key={item?.uuid}

                                        className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm relative pt-7 transition-all group h-full flex flex-col justify-between 
                                                ${isDisableEdit
                                                ? 'cursor-default opacity-100'
                                                : 'cursor-pointer hover:border-blue-400 hover:shadow-md'
                                            }`}
                                    >
                                        {/* Staff Badge - Top Left */}
                                        <div className={`absolute top-0 left-0 px-3 py-1 rounded-br-lg rounded-tl-lg text-[11px] text-[#FFFFFF] tracking-wider bg-[#1677FF]`}
                                        >
                                            {item?.staff?.name || "Unassigned"}
                                        </div>

                                        <div className="absolute top-1 right-1 flex items-center gap-2">
                                            {!isDisableEdit && (
                                                <button
                                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer dark:hover:bg-[#141414] dark:hover:!backdrop-blur-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsEdit(true);
                                                        setSelectedAssignment(item);
                                                        setCreateDrawerOpen(true);
                                                    }}
                                                >
                                                    <EditOutlined className="text-[14px] text-blue-600" />
                                                </button>
                                            )}

                                            {
                                                item.startedAt ? null :
                                                    (
                                                        <button
                                                            className="p-1 rounded-full text-red-500 transition-colors cursor-pointer enabled:hover:bg-red-50 dark:hover:!bg-[#141414] dark:hover:!backdrop-blur-lg"
                                                            // onClick={(e) => handleDelete(e, item)}
                                                            onClick={(e) => openDeleteModal(e, item)}
                                                        >
                                                            <DeleteOutlined className="text-[14px]" />
                                                        </button>
                                                    )
                                            }
                                        </div>

                                        {/* Content Area */}
                                        <div className="space-y-1">
                                            <TightRow
                                                label="Assigned"
                                                value={item.assignedAt ? dayjs(item.assignedAt).format("YYYY-MM-DD HH:mm") : "-"}
                                                isDate
                                            />
                                            <TightRow
                                                label="Started"
                                                value={item.startedAt ? dayjs(item.startedAt).format("YYYY-MM-DD HH:mm") : "-"}
                                                isDate
                                            />
                                            <TightRow
                                                label="Completed"
                                                value={item.completedAt ? dayjs(item.completedAt).format("YYYY-MM-DD HH:mm") : "-"}
                                                isDate
                                            />
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        <Modal
                            title={
                                <span>
                                    Are you sure you want to delete the assignment for <b>{itemToDelete?.staff?.name}</b>?
                                </span>
                            }
                            open={deleteModal}
                            onCancel={() => {
                                setDeleteModal(false);
                                setItemToDelete(null);
                            }}
                            onOk={handleConfirmDelete}
                            confirmLoading={deleteMutation.isPending}
                            okText="OK"
                            mask={false}
                        />
                    </div>

                )
            }

            {/* Inner Drawer for Create/Edit */}
            {
                !isDisableEdit &&
                (
                    <Drawer
                        title={isEdit ? "Edit Assign" : "New Assign"}
                        width={550}
                        onClose={() => setCreateDrawerOpen(false)}
                        open={createDrawerOpen}
                        extra={(!isStaffListEmpty || isEdit) && (
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={form.submit}
                                block
                                loading={createMutation.isPending || updateMutation.isPending}
                            >
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        )}

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
                                            assignDetail?.startedAt ? (
                                                <div className="flex items-center gap-1 text-red-500 text-[11px] mt-1 italic">
                                                    <ExclamationCircleOutlined />
                                                    <span>Assigned is already started.</span>
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
                                            disabled={notAssignedStaffs.length === 0 || assignDetail?.startedAt}
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
                                                <TimePicker className="w-full" format="HH:mm" />
                                            </Form.Item>
                                            <Form.Item name="completedTime" label="Completed Time">
                                                <TimePicker className="w-full" format="HH:mm" />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Form>
                    </Drawer>


                )
            }
        </Drawer >
    );
};

export default HouseKeepingTaskAssignForm;
