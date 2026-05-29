import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  TimePicker,
  Select,
  Card,
  Typography,
  Tag,
  Radio,
  Table,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
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
  console.log(folioUuid, "serviceDatas");

  const uuid = serviceData?.uuid;

  const [form] = Form.useForm();
  const isView = mode === "view";
  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const [searchOpen, setSearchOpen] = useState(false);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  // const currencies = initData?.currencies?.map((currency) => ({
  //   value: currency.uuid,
  //   label: currency.code,
  // }));

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

  const createServiceOrder = useApiMutation({
    mutationFn: serviceOrderCreate,
    invalidateKeys: [["service-order"]],
    // shouldInvalidate: page === 1,
  });

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    style: { width: 150 },
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      reservation: { uuid },
      room: {
        uuid: values.roomNo,
      },
      folio: {
        uuid: Array.isArray(folioUuid) ? folioUuid[0]?.uuid : folioUuid?.uuid,
      },
      currency: {
        uuid: Array.isArray(folioUuid)
          ? folioUuid[0]?.currency?.uuid
          : folioUuid?.currency?.uuid,
      },

      orderStatus: { uuid: values.order_status },
      // uuid: isEdit ? guestData?.uuid || data?.uuid : null,
    };
    const mutation = isAdd && createServiceOrder;

    createServiceOrder.mutate(payload, {
      onSuccess: () => {
        form.resetFields();
        handleClose();
        // setDrawerOpen(false);
        setPage(1);
        Toast.success("Room Created Successfully!");
      },
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
      initialValues={{
        quantity: 1,
      }}
      title={
        <div className="flex justify-between items-center">
          <span>Add New Service Order</span>
          <Button type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Service Order Date" name="serviceOrderDate">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Service Order Time" name="ServiceOrderTime">
            <TimePicker className="w-full" format="h:mm A" />
          </Form.Item>
        </div>
        <Form.Item label="Room No" name="roomNo" rules={[{ required: true }]}>
          <Select placeholder="Select a Room" options={rooms} />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Select Service" name="selectService">
            <Select
              placeholder="Select Select Service"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Service Package" name="servicePackage">
            <Select
              placeholder="Select Service Package"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Exchange Rate "
          name="exchangeRate "
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Exchange Rate "
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-6">
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

          <Form.Item
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
          </Form.Item>
        </div>

        <Form.Item
          label="Unit Cost"
          name="unitCost "
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Unit Cost"
            suffix="MMK"
          />
        </Form.Item>

        <Form.Item
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
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          {" "}
          <Form.Item
            label="Service Charge Amount "
            name="serviceChargeAmount "
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
            name="discountAmount "
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Discount Amount"
              suffix="MMK"
            />
          </Form.Item>
        </div>

        <Form.Item
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
        </Form.Item>

        <Form.Item
          label="Order Status"
          name="order_status"
          rules={[{ required: true }]}
          getValueProps={(value) => ({
            value: isView
              ? orderStatus.find((item) => item.value === value)?.label
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
              options={orderStatus}
              placeholder="Select Order Status"
            />
          )}
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddNewServiceOrderForm;
