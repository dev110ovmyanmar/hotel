import React, { useEffect } from "react";
import { Drawer, Form, Input, InputNumber, Button, Select } from "antd";

import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import {
  reservationRoomMeta,
  serviceOrderCreate,
  serviceOrderDetails,
} from "../../../../../../api/reservationSectionApi";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";

const ServiceAddOnForm = ({
  mode,
  setMode,
  serviceData,
  open,
  onClose,
  onSuccess,
}) => {
  const isView = mode === "view";
  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const reservationUuid = isAdd
    ? serviceData?.uuid
    : serviceData?.reservation?.uuid || serviceData?.reservationUuid;
  const serviceOrderUuid = isAdd ? null : serviceData?.uuid;

  const [form] = Form.useForm();
  const selectedServiceUuid = Form.useWatch("selectService", form);

  const { data: reservationRoom } = useApiQuery({
    fetchQueryName: "service-order",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: reservationUuid,
      },
    },
    options: { enabled: !!reservationUuid },
  });

  const { data: orderDetails } = useApiQuery({
    fetchQueryName: "service-orders",
    fetchQueryFunction: serviceOrderDetails,
    params: { uuid: serviceOrderUuid },
    options: { enabled: !!serviceOrderUuid && !isAdd },
  });

  const createServiceOrder = useApiMutation({
    mutationFn: serviceOrderCreate,
    invalidateKeys: [["service-order"]],
  });

  const rooms =
    reservationRoom?.rooms?.map((room) => ({
      value: room?.uuid,
      label: `${room?.room?.roomNo} (${room?.checkinDate} - ${room?.checkoutDate})`,
    })) || [];

  const services =
    reservationRoom?.services?.map((service) => ({
      value: service?.uuid,
      label: service?.name,
    })) || [];

  const currentServiceObj = reservationRoom?.services?.find(
    (service) => service.uuid === selectedServiceUuid,
  );

  const servicePackages =
    currentServiceObj?.servicePackages?.map((pkg) => ({
      value: pkg?.uuid,
      label: pkg?.name,
    })) || [];

  useEffect(() => {
    if (orderDetails && (isView || isEdit)) {
      form.setFieldsValue({
        roomNo: orderDetails?.reservationRoom?.uuid,
        selectService: orderDetails?.service?.uuid,
        servicePackage: orderDetails?.servicePackage?.uuid,
        quantity: orderDetails?.quantity || 1,
      });
    }
  }, [orderDetails, isView, isEdit, form]);

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    style: { width: 150 },
  };

  const handleClose = () => {
    form.resetFields();
    if (onClose) onClose();
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      reservation: { uuid: reservationUuid },
      reservationRoom: values.roomNo ? { uuid: values.roomNo } : null,
      service: values.selectService ? { uuid: values.selectService } : null,
      servicePackage: values.servicePackage
        ? { uuid: values.servicePackage }
        : null,
      quantity: parseInt(values.quantity, 10) || 1,
    };

    createServiceOrder.mutate(payload, {
      onSuccess: () => {
        handleClose();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Drawer
      destroyOnClose
      size={500}
      open={open}
      onClose={handleClose}
      title={
        <div className="flex justify-between items-center">
          <span>
            {isView
              ? "Service Details"
              : isEdit
                ? "Edit Service"
                : "Add Service"}
          </span>
          {isView ? (
            <Button type="primary" onClick={() => setMode("edit")}>
              Edit
            </Button>
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              isPending={createServiceOrder.isPending}
              mode={mode}
            />
          )}
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        disabled={isView}
        initialValues={{
          quantity: 1,
        }}
      >
        <Form.Item label="Room No" name="roomNo">
          <Select placeholder="Select a Room" options={rooms} allowClear />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Select Service"
            name="selectService"
            rules={[{ required: true, message: "Please select a service" }]}
          >
            <Select
              showSearch
              options={services}
              placeholder="Select Order Service"
              onChange={() => form.setFieldValue("servicePackage", undefined)}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item label="Service Package" name="servicePackage">
            <Select
              showSearch
              options={servicePackages}
              placeholder="Select Package"
              disabled={isView || !selectedServiceUuid}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              allowClear
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true }]}
        >
          <InputNumber
            {...sharedProps}
            placeholder="Outlined"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ServiceAddOnForm;
