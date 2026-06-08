import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  TimePicker,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {
  reservationRoomMeta,
  serviceOrderCreate,
} from "../../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { queryClient } from "../../../../../../app/queryClient";

const { Text } = Typography;

const AddNewServiceOrderForm = ({
  mode,
  serviceData,
  folioUuid,
  open,
  onClose,
  page,
  setPage,
}) => {
  const uuid = serviceData?.uuid;

  const [form] = Form.useForm();
  const isView = mode === "view";
  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const [searchOpen, setSearchOpen] = useState(false);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const selectedServiceUuid = Form.useWatch("selectService", form);

  const orderStatus = initData?.statuses?.order_status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const { data: reservationRoom } = useApiQuery({
    fetchQueryName: "service-order",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: uuid,
      },
    },
  });

  const rooms =
    reservationRoom?.rooms?.map((room) => ({
      value: room?.uuid,
      label: `${room?.room?.roomNo} (${room?.checkinDate} - ${room?.checkoutDate}) `,
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
    currentServiceObj?.servicePackages?.map((servicePackage) => ({
      value: servicePackage?.uuid,
      label: servicePackage?.name,
    })) || [];

  const createServiceOrder = useApiMutation({
    mutationFn: serviceOrderCreate,
    invalidateKeys: [["folios"]],
  });

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    style: { width: 150 },
  };

  const handleClose = () => {
    form.resetFields();
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      serviceOrderDate: values.serviceOrderDate
        ? values.serviceOrderDate.format("DD-MM-YYYY")
        : null,
      serviceOrderTime: values.serviceOrderTime
        ? values.serviceOrderTime.format("HH:mm")
        : null,

      reservation: { uuid },
      reservationRoom: {
        uuid: values.roomNo,
      },
      service: values.selectService
        ? {
            uuid: values.selectService,
          }
        : null,
      servicePackage: values.servicePackage
        ? {
            uuid: values.servicePackage,
          }
        : null,

      quantity: parseInt(values.quantity, 10),
    };

    createServiceOrder.mutate(payload, {
      onSuccess: () => {
        console.log("Service Order Created Successfully!");
        handleClose();
        if (setPage) setPage(1);
      },
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Add New Service Order</span>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={createServiceOrder.isLoading}
          >
            Create
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{
          quantity: 1,
          serviceOrderDate: dayjs(),
          serviceOrderTime: dayjs(),
        }}
      >
        {/* <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Service Order Date" name="serviceOrderDate">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Service Order Time" name="serviceOrderTime">
            <TimePicker className="w-full" format="h:mm A" />
          </Form.Item>
        </div> */}
        <Form.Item label="Room No" name="roomNo">
          <Select placeholder="Select a Room" options={rooms} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Select Service"
            name="selectService"
            rules={[{ required: true }]}
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

          <Form.Item
            label="Service Package"
            name="servicePackage"
            getValueProps={(value) => ({
              value: isView
                ? servicePackages?.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={servicePackages}
                placeholder="Select Order Service Package"
                disabled={!selectedServiceUuid || isView}
              />
            )}
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

        {/* <Form.Item
            label="Unit Price"
            name="unitPrice"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Unit Price"
              suffix="MMK"
            />
          </Form.Item> */}

        {/* <Form.Item
          label="Unit Cost"
          name="unitCost"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Unit Cost"
            suffix="MMK"
          />
        </Form.Item> */}

        {/* <Form.Item
          label="Sub Total"
          name="subTotal"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Sub Total"
            suffix="MMK"
          />
        </Form.Item> */}

        {/* <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Select Tax" name="selectTax">
            <Select
              placeholder="Select Tax"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Tax Amount"
            name="taxAmount"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Total tax"
              suffix="MMK"
            />
          </Form.Item>
        </div> */}

        {/* <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Service Charge Amount"
            name="serviceChargeAmount"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Total Amount"
              suffix="MMK"
            />
          </Form.Item>
          <Form.Item
            label="Discount Amount"
            name="discountAmount"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Discount Amount"
              suffix="MMK"
            />
          </Form.Item>
        </div> */}

        {/* <Form.Item
          label="Total Amount"
          name="totalAmount"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Total Amount"
            suffix="MMK"
          />
        </Form.Item> */}

        {/* <Form.Item
          label="Order Status"
          name="order_status"
          rules={[{ required: true }]}
          getValueProps={(value) => ({
            value: isView
              ? orderStatus?.find((item) => item.value === value)?.label
              : value,
          })}
        >
          {isView ? (
            <Input readOnly={isView} />
          ) : (
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={orderStatus}
              placeholder="Select Order Status"
            />
          )}
        </Form.Item> */}
      </Form>
    </Drawer>
  );
};

export default AddNewServiceOrderForm;
