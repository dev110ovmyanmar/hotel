import React, { useEffect } from "react";
import { Drawer, Form, Input, InputNumber, Button, Select } from "antd";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import {
  reservationRoomMeta,
  serviceAddonCreate,
  serviceAddonDetails,
  updateServiceAddon,
} from "../../../../../../api/reservationSectionApi";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import TextArea from "antd/es/input/TextArea";
import { queryClient } from "./../../../../../../app/queryClient";
import { getFormattedDate } from "../../../../../../utils";

const sharedProps = {
  mode: "spinner",
  min: 1,
  max: 10,
  style: { width: 150 },
};

const ServiceAddOnForm = ({
  mode,
  setMode,
  serviceData,
  open,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  // const selectedServiceUuid = Form.useWatch("selectService", form);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const reservationUuid = isAdd
    ? serviceData?.uuid
    : serviceData?.reservation?.uuid || serviceData?.reservationUuid;
  const serviceOrderUuid = isAdd ? null : serviceData?.uuid;

  const { data: reservationRoom } = useApiQuery({
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: reservationUuid,
      },
    },
    options: { enabled: !!reservationUuid },
  });

  const { data: orderDetails } = useApiQuery({
    fetchQueryName: "service-addons",
    fetchQueryFunction: serviceAddonDetails,
    params: { uuid: serviceOrderUuid },
    options: { enabled: !!serviceOrderUuid && !isAdd },
  });

  const createServiceOrder = useApiMutation({
    mutationFn: serviceAddonCreate,
  });

  const updateAddon = useApiMutation({
    mutationFn: updateServiceAddon,
    invalidateKeys: [["service-addon"]],
  });


  const currentStatusCode = orderDetails?.addonStatus?.code;
  const addonStatus =
     initData?.statuses?.addon_status
     ?.filter((status) => {
      if (status.code === "completed" || status.code === "no_show") {
        return false;
      }

      if (isView) {
        return status.code === currentStatusCode;
      }

      if (isEdit) {
        if (currentStatusCode === "cancelled") {
          return status.code === "cancelled";
        }

        if (currentStatusCode === "in_progress") {
          return (
            status.code === "in_progress" ||
            status.code === "cancelled"
          );
        }

        return true;
      }

      return (
        status.code === "pending" ||
        status.code === "in_progress"
      );
    })
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    })) || [];

  const defaultStatus = initData?.statuses?.addon_status?.find(
    (status) => status.code === "pending",
  );

  const rooms =
    reservationRoom?.rooms
      ?.filter((room) => room?.roomStatus?.code === "confirmed")
      .map((room) => {
        const checkin = getFormattedDate(room?.checkinDate);
        const checkout = getFormattedDate(room?.checkoutDate);

        return {
          value: room?.uuid,
          label: `${room?.room?.roomNo} (${checkin} / ${checkout})`,
        };
      }) || [];

  const services =
    reservationRoom?.services
      ?.filter((service) => service?.serviceStages?.includes("pre_arrival"))
      ?.map((service) => ({
        value: service?.uuid,
        label: service?.name,
      })) || [];

  useEffect(() => {
    if (orderDetails && (isView || isEdit)) {
      form.setFieldsValue({
        roomNo: orderDetails?.reservationRoom?.uuid,
        selectService: orderDetails?.service?.uuid,
        servicePackage: orderDetails?.servicePackage?.uuid,
        quantity: orderDetails?.quantity || 1,
        note: orderDetails?.note,
        status: orderDetails?.addonStatus?.uuid,
      });
    }
  }, [orderDetails, isView, isEdit, form]);

  const handleSubmit = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        reservation: { uuid: reservationUuid },
        reservationRoom: values.roomNo ? { uuid: values.roomNo } : null,
        service: values.selectService ? { uuid: values.selectService } : null,
        servicePackage: values.servicePackage
          ? { uuid: values.servicePackage }
          : null,
        quantity: parseInt(values.quantity, 10) || 1,
        note: values.note,
        addonStatus: { uuid: values?.status },
      };

      createServiceOrder.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          if (onSuccess) onSuccess();
          setPage(1);
          Toast.success("Service Add on Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        uuid: serviceOrderUuid,
        reservation: { uuid: reservationUuid },
        reservationRoom: values.roomNo ? { uuid: values.roomNo } : null,
        service: values.selectService ? { uuid: values.selectService } : null,
        servicePackage: values.servicePackage
          ? { uuid: values.servicePackage }
          : null,
        quantity: parseInt(values.quantity, 10) || 1,
        note: values.note,
        addonStatus: { uuid: values?.status },
      };

      updateAddon.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          if (onSuccess) onSuccess();
          Toast.success("Service Order Updated Successfully!");
        },
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    if (onClose) onClose();
  };

  return (
    <Drawer
      destroyOnClose
      size={550}
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
              isPending={createServiceOrder.isPending || updateAddon.isPending}
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
          status: !isEdit ? defaultStatus?.uuid : undefined,
        }}
      >
        {!isAdd && (
          <Form.Item
            label="Room No"
            name="roomNo"
            getValueProps={(value) => ({
              value: isView
                ? rooms.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                }}
                options={rooms}
                placeholder="Select a Room"
              />
            )}
          </Form.Item>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Select Service"
            name="selectService"
            rules={[{ required: true, message: "Please select a service" }]}
            getValueProps={(value) => ({
              value: isView
                ? services.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select
                allowClear
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                }}
                options={services}
                placeholder="Select Service"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
            className="minus-icon"
          >
            <InputNumber
              {...sharedProps}
              placeholder="Outlined"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>

        <Form.Item label="Note" name="note">
          <TextArea />
        </Form.Item>
      
        <Form.Item
          label="Add On Status"
          name="status"
          rules={[
            { required: true, message: "Please select an add on status" },
          ]}
          getValueProps={(value) => ({
            value: isView
              ? addonStatus.find((item) => item.value === value)?.label
              : value,
          })}
        >
          {isView ? (
            <Input readOnly={isView} />
          ) : (
            <Select
              showSearch={{
                filterOption: (input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
              options={addonStatus}
              placeholder="Select Add On Status"
            />
          )}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ServiceAddOnForm;
