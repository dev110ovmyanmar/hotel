import React, { useState } from "react";
import {
  Drawer,
  Table,
  Space,
  Tooltip,
  Select,
  Modal,
  Form,
  Button,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import {
  serviceAddonList,
  updateServiceAddon,
} from "../../../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../../../variables/constants";
import ColorStatusTag from "../../../../../../component/ColorStatusTag/ColorStatusTag";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { queryClient } from "../../../../../../app/queryClient";
import Toast from "../../../../../../component/Toast/Toast";

const ServiceAddonDrawer = ({
  open,
  onClose,
  reservationId,
  reservationDetails,
}) => {
  const [form] = Form.useForm();
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { data, isFetching } = useApiQuery({
    fetchQueryName: "service-addon",
    fetchQueryFunction: serviceAddonList,
    params: {
      pagination: { page: 1, perPage: LIMITS.PAGE_SIZE },
      reservationRoom: { uuid: reservationId },
    },
    enabled: open && !!reservationId,
  });

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedRecord(null);
    form.resetFields();
  };

  const updateAddon = useApiMutation({
    mutationFn: updateServiceAddon,
    invalidateKeys: [["service-addon"], ["service-order"]],
  });

  const currentStatusCode = selectedRecord?.addonStatus?.code;
  const addonStatusOptions =
    initData?.statuses?.addon_status
      ?.filter((status) => {
        if (!currentStatusCode) return true;
        if (["completed", "cancelled", "no_show"].includes(currentStatusCode)) {
          return status.code === currentStatusCode;
        }
        if (currentStatusCode === "in_progress") {
          return ["in_progress", "completed", "cancelled", "no_show"].includes(
            status.code,
          );
        }
        return true;
      })
      ?.map((status) => ({
        value: status.uuid,
        label: status.name,
      })) || [];

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      status: record?.addonStatus?.uuid,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (values) => {
    if (!selectedRecord) return;
    const reservationUuid =
      selectedRecord?.reservation?.uuid ||
      selectedRecord?.reservationId ||
      reservationDetails?.reservation?.uuid;

    const payload = {
      uuid: selectedRecord?.uuid,
      ...(reservationUuid && { reservation: { uuid: reservationUuid } }),
      ...(selectedRecord?.reservationRoom?.uuid && {
        reservationRoom: { uuid: selectedRecord.reservationRoom.uuid },
      }),
      ...(selectedRecord?.service?.uuid && {
        service: { uuid: selectedRecord.service.uuid },
      }),
      ...(selectedRecord?.servicePackage?.uuid && {
        servicePackage: { uuid: selectedRecord.servicePackage.uuid },
      }),
      quantity: selectedRecord?.quantity || 1,
      note: selectedRecord?.note || "",
      addonStatus: { uuid: values?.status },
    };

    updateAddon.mutate(payload, {
      onSuccess: () => {
        Toast.success("Service add-on status updated successfully");
        setIsEditModalOpen(false);
        setSelectedRecord(null);
        form.resetFields();
      },
    });
  };

  const columns = [
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "service",
    },
    {
      title: "Status",
      dataIndex: "addonStatus",
      key: "status",
      width: 160,
      render: (addonStatus) => <ColorStatusTag status={addonStatus} />,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      align:"center",
      render: (_, record) => {
        const isTerminal = ["completed", "cancelled", "no_show"].includes(
          record?.addonStatus?.code,
        );

        if (isTerminal) {
          return null;
        }

        return (
          <Space>
            <Tooltip title="Change Status">
              <EditOutlined
                style={{ fontSize: "14px" }}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Drawer
        title="Add On Service List"
        placement="right"
        width={700}
        onClose={onClose}
        open={open}
      >
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={data?.data || []}
          rowKey={(record) => record.uuid || record.id}
          pagination={false}
        />
      </Drawer>

      <Modal
        title="Update Add-On Service Status"
        open={isEditModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={updateAddon.isPending}
        okText="Update"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm">
              <span className="font-semibold">Service Name:</span>{" "}
              {selectedRecord?.service?.name || "-"}
            </p>
          </div>

          <Form.Item
            label="Add On Status"
            name="status"
            rules={[
              { required: true, message: "Please select an add on status" },
            ]}
          >
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={addonStatusOptions}
              placeholder="Select Add On Status"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceAddonDrawer;
