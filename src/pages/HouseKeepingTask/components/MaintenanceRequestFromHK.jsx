import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Drawer, DatePicker, Select, Button, TimePicker, Row, Col } from "antd";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { createMaintenanceRequestFromHK } from "../../../api/houseKeepingTaskApi";
const { TextArea } = Input;

const MaintenanceRequestFromHK = ({
    drawerOpen,
    setDrawerOpen,
    houseKeepingTaskDetail,
    initData,
    adminMetaData
}) => {
    const [form] = Form.useForm();
    const mode = "add";

    const isCreate = mode === "add";

    const mapOptions = (data) => data?.map((item) => ({ value: item.uuid, label: item.name })) || [];

    const priorityOptions = useMemo(() => mapOptions(initData?.statuses?.priority_level),
        [initData]);
    const issueTypeOptions = useMemo(() => mapOptions(initData?.statuses?.issue_type),
        [initData]);
    const maintenanceStatusOptions = useMemo(() => mapOptions(initData?.statuses?.maintenance_status),
        [initData]);

    const roomOptions = useMemo(() =>
        adminMetaData?.rooms?.map(r => ({ value: r.uuid, label: `Room ${r.roomNo}` })), [adminMetaData]);

    const departmentOptions = useMemo(() =>
        adminMetaData?.departments?.map(d => ({ value: d.uuid, label: d.name })), [adminMetaData]);

    const houseKeepingDepartmentUuid = departmentOptions?.find(d => d.label === "Housekeeping")?.value;

    const hkDetail = houseKeepingTaskDetail;

    const reportedStatus = initData?.statuses?.maintenance_status?.find(s => s.code === "reported");

    useEffect(() => {
        if (!drawerOpen) return;

        if (isCreate) {
            if (hkDetail) {
                form.setFieldsValue({
                    maintenanceStatus: reportedStatus.uuid,
                    housekeepingTaskName: hkDetail.id,
                    housekeepingTask: hkDetail.uuid,
                    roomUuid: hkDetail.room?.uuid,
                    priorityLevel: hkDetail.priorityLevel?.uuid,
                });
            } else if (!hkDetail) {
                if (isCreate && !hkDetail) {
                    form.resetFields();
                    form.setFieldsValue({ maintenanceStatus: reportedStatus.uuid });
                }
            };
        }
    }, [drawerOpen, isCreate, hkDetail, form, initData]);

    const createMutation = useApiMutation({
        mutationFn: createMaintenanceRequestFromHK,
        invalidateKeys: [["maintenance-requests"]],
    });

    const handleClose = () => {
        setDrawerOpen(false);
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
            reportedFrom: { uuid: houseKeepingDepartmentUuid },
            housekeepingTask: { uuid: hkDetail?.uuid },
            plannedStartAt: formatDateTime(values.plannedStartDate, values.plannedStartTime),
            plannedEndAt: formatDateTime(values.plannedEndDate, values.plannedEndTime),
        };

        createMutation.mutate(createPayload, {
            onSuccess: () => {
                handleClose();
                Toast.success(`Maintenance request created successfully`);
            },
        });
    };

    return (
        <>
            <Drawer
                title={"New Maintenance Request"}
                size={550}
                onClose={handleClose}
                open={drawerOpen}
                extra={<FormButtons onClick={() => form.submit()} mode={mode} isPending={createMutation.isPending} />}
            >
                <div>
                    <Form form={form} layout="vertical" onFinish={onFinish}>

                        {isCreate && hkDetail && (
                            <>
                                <div className="mb-4">
                                    <span className="text-blue-500 font-medium">Source HouseKeeping Task Id: #{hkDetail?.id}</span>
                                </div>
                                <Form.Item name="housekeepingTask" noStyle><Input hidden /></Form.Item>
                            </>
                        )}

                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                            <Input
                                placeholder="Enter Maintenance Request" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                {
                                    hkDetail && (
                                        <Form.Item name="roomUuid" label="Room" rules={[{ required: true }]}>
                                            <Select options={roomOptions} open={true ? !true : undefined} placeholder="Select Room" />
                                        </Form.Item>
                                    )
                                }
                            </Col>
                            <Col span={12}>
                                <Form.Item name="issueType" label="Issue Type" rules={[{ required: true }]}>
                                    <Select options={issueTypeOptions}
                                        placeholder="Select Issue Type" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="priorityLevel" label="Priority" rules={[{ required: true }]}>
                                    <Select options={priorityOptions}
                                        placeholder="Select Priority" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                {isCreate ? (
                                    <Form.Item
                                        name="maintenanceStatus"
                                        label="Maintenance Status"
                                        rules={[{ required: true, message: "Please select status" }]}
                                        getValueProps={(value) => ({
                                            value: maintenanceStatusOptions?.find((item) => item.value === value)?.label || "",
                                        })}
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                ) : (
                                    <Form.Item name="maintenanceStatus" label="Maintenance Status" rules={[{ required: true }]}>
                                        <Select
                                            options={maintenanceStatusOptions}
                                            placeholder="Select Maintenance Status" />
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="plannedStartDate" label="Start Date"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker className="w-full"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="plannedStartTime" label="Start Time"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker className="w-full" format="HH:mm"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="plannedEndDate" label="End Date"
                                    rules={[{ required: true }]}
                                >
                                    <DatePicker className="w-full"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="plannedEndTime" label="End Time"
                                    rules={[{ required: true }]}
                                >
                                    <TimePicker className="w-full" format="HH:mm" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="issueDescription" label="Description" rules={[{ required: true }]}>
                            <TextArea rows={4} placeholder="Enter Description" />
                        </Form.Item>
                    </Form>

                </div>

            </Drawer>
        </>

    );
};

export default MaintenanceRequestFromHK;