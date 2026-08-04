import React, { useEffect, useState } from "react";
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
  Checkbox,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { queryClient } from "../../../../../../app/queryClient";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { reservationRoomMeta } from "../../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { createFoodBeverageOrder, foodBeverageOrderDetails, updateFoodBeverageOrder } from "../../../../../../api/foodBeverageOrder";
import Toast from "../../../../../../component/Toast/Toast";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import dayjs from "dayjs";
import { values } from "lodash";

const { Text } = Typography;

const FoodBeverageOrderForm = ({
  open,
  onClose,
  reservationUuid,
  reservationRoomId,
  mode,
  setMode,
  selectedData
}) => {
  const [form] = Form.useForm();
  const itemsValue = Form.useWatch("items", form);

  const isAdd = mode === "add";
  console.log(isAdd, "IsAddtrue?")
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const [orders, setOrders] = useState([{ id: Date.now() }]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [menuUuid, setMenuUuid] = useState();

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const allStatuses = initData?.statuses;
  const consumptionType = allStatuses.consumption_type.map(order => (
    { value: order?.uuid, label: order?.name }
  ));

  const orderType = allStatuses.order_type.map(type => (
    { value: type?.uuid, label: type?.name }
  ));

  const { data } = useApiQuery({
    fetchQueryName: "order",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: reservationUuid,
      },
    },
  });

  const menuItemOptions = data?.menuItems?.map(menu => (
    { value: menu?.uuid, label: menu?.name }
  ));

  const roomOptions = data?.rooms?.map(menu => (
    { value: menu?.room.uuid, label: menu?.room.roomNo }
  ));

  const addMenu = () => {
    setOrders([...orders, { id: Date.now() }]);
  };

  const deleteOrder = (id, index) => {
    const newOrders = orders.filter((order) => order.id !== id);
    setOrders(newOrders);

    const currentItems = form.getFieldValue("items") || [];
    const newItems = currentItems.filter((_, i) => i !== index);
    form.setFieldsValue({ items: newItems });
  };

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    style: { width: "100%" },
  };

  const createFoodBeverate = useApiMutation({
    mutationFn: createFoodBeverageOrder,
    invalidateKeys: [["food-beverage-orders"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const updateFoodBeverate = useApiMutation({
    mutationFn: updateFoodBeverageOrder,
    invalidateKeys: [["food-beverage-orders"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const handleSubmit = (values) => {
    console.log("FormValues:", values);
    const payload = {
      menuItem: {
        uuid: values?.menu
      },
      quantity: values?.quantity,
      consumptionType: {
        uuid: values?.consumptionType
      },
      orderStatus: {
        uuid: values?.orderStatus
      },
      orderType: {
        uuid: values?.orderType
      },
      uuid: isEdit ? selectedData?.uuid : null,
      reservation: {
        uuid: reservationUuid
      },
    };

    if (isAdd) {
      createFoodBeverate.mutate(payload, {
        onSuccess: () => {
          Toast.success("Food Order Created Successfully");
          onClose(false)
        }
      })
    }

    if (isEdit) {
      updateFoodBeverate.mutate(payload, {
        onSuccess: () => {
          Toast.success("Food Order Updated Successfully");
          onClose(false)
        }
      })
    }
  };



  const {
    data: fnbOrderDetails
  } = useApiQuery({
    fetchQueryName: "fnb-order-details",
    fetchQueryFunction: foodBeverageOrderDetails,
    params: {
      uuid: selectedData?.uuid,
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });
  console.log(fnbOrderDetails, "fnbOrderDetailsSelectedDataIn")
  useEffect(() => {
    if (fnbOrderDetails && (isView || isEdit)) {
      console.log(fnbOrderDetails, "FnbOrderDetails")
      const customDate = dayjs(fnbOrderDetails?.orderedAt);
      form.setFieldsValue({
        orderDate: customDate,
        orderTime: customDate,
        room: fnbOrderDetails?.reservation_room?.uuid,
        consumptionType: fnbOrderDetails?.consumptionType?.uuid,
        orderType: fnbOrderDetails?.orderType?.uuid,
        orderStatus: fnbOrderDetails?.orderStatus?.uuid,
      });
    }
  }, [fnbOrderDetails, isView, isEdit]);

  useEffect(() => {
    const pendingStatus = allStatuses?.order_status?.find(
      (status) => status.code === "pending"
    );

    if (pendingStatus) {
      form.setFieldsValue({
        orderStatus: pendingStatus.uuid,
      });
    }
  }, [allStatuses, form]);

  const currentOrderStatus = fnbOrderDetails?.orderStatus?.code;

  const orderStatus = allStatuses.order_status.map((order) => ({
    value: order.uuid,
    label: order.name,
    disabled:
      (
        isAdd &&
        ["cancelled", "completed"].includes(order.code)
      ) ||
      (
        isEdit &&
        (
          currentOrderStatus === "pending" &&
          ["cancelled", "completed"].includes(order.code)
        ) ||
        (
          currentOrderStatus === "in_progress" &&
          ["pending"].includes(order.code)
        )
      ),
  }));

  const handleChangeMenu = (values, option) => {
    setMenuUuid(values)
    console.log(values, "handleChangeMenuValues");
    console.log(option, "LabelhandleChangeMenu")
  };

  const selectedMenuItem = data?.menuItems
    ?.find((addon) => addon?.uuid === menuUuid);

  return (
    <>
      {" "}
      <Drawer
        open={open}
        onClose={onClose}
        size={650}
        destroyOnClose
        title={
          <div className="flex justify-between items-center">
            <span>
              {isView
                ? "Food Beverage Order Details"
                : isEdit
                  ? "Edit Food Beverage Order"
                  : "Add Food Beverage Order"}
            </span>
            {isView ? (
              selectedData?.orderStatus?.code !== "completed" && (
                <Button type="primary" onClick={() => setMode("edit")}>
                  Edit
                </Button>
              )
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={
                  createFoodBeverate.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Card size="small" title="Order Info" className="shadow-sm rounded" headStyle={{ backgroundColor: "#fafafa" }}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Order Date"
                name="orderDate"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
              <Form.Item
                label="Order Time"
                name="orderTime"
                rules={[{ required: true }]}
              >
                <TimePicker className="w-full" format="h:mm A" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Room" name="room" rules={[{ required: true }]}>
                <Select
                  placeholder="Select Room"
                  style={{ width: "100%" }}
                  options={roomOptions}
                />
              </Form.Item>

              <Form.Item
                label="Consumption Type"
                name="consumptionType"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Comsumption Type"
                  style={{ width: "100%" }}
                  options={consumptionType}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Order Type"
                name="orderType"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Order Type"
                  style={{ width: "100%" }}
                  options={orderType}
                />
              </Form.Item>

              <Form.Item
                label="Order Status"
                name="orderStatus"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Order Status"
                  style={{ width: "100%" }}
                  options={orderStatus}
                  disabled={currentOrderStatus === "completed" || currentOrderStatus === "cancelled"}
                />
              </Form.Item>
            </div>


          </Card>
          <Space direction="vertical" size="large" className="w-full">
            {orders.map((order, index) => {
              // selected menu for card
              const selectedMenuKey = itemsValue?.[index]?.menu;
              // const availableAddons = menuAddons[selectedMenuKey] || [];

              return (
                <Card
                  key={order.id}
                  title={`Order ${index + 1}`}
                  className="shadow-sm rounded mb-4 border-l-4 border-blue-500"
                  headStyle={{ backgroundColor: "#fafafa" }}
                  size="small"
                  extra={
                    orders.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteOrder(order.id, index)}
                      />
                    )
                  }
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Form.Item label="Menu" name="menu">
                      <Select
                        options={menuItemOptions}
                        onChange={(value, option) => handleChangeMenu(value, option)}
                        placeholder="Select Menu"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Quantity"
                      name="quantity"
                      initialValue={1}
                    >
                      <InputNumber {...sharedProps} />
                    </Form.Item>
                    <Form.Item
                      label="Price Per Qty"
                      name="pricePerQty"
                    >
                      <InputNumber className="!w-full" min={0} suffix="MMK" />
                    </Form.Item>
                  </div>

                  {/* Add on List */}
                  {orders?.length > 0 && (
                    <div>
                      {selectedMenuItem
                        ?.modifiers?.length > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <Text strong>Add on Menu</Text>
                            <Tag color="default" className="mr-0">
                              Optional
                            </Tag>
                          </div>
                        )}


                      {/*  selected add on labels */}
                      <Form.Item
                        name={["items", index, "addons"]}
                        className="mb-0"
                      >
                        <Checkbox.Group className="w-full">
                          <div className="space-y-2">
                            {selectedMenuItem?.modifiers?.map(modify => (
                                  <div
                                    key={modify.label}
                                    className="grid grid-cols-3 gap-3 items-center py-2 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                  >
                                    {/*  Select Box + Name */}
                                    <div className="flex items-center">
                                      <Checkbox value={modify.name}>
                                        <span className="ml-2 text-sm">
                                          {modify.name}
                                        </span>
                                      </Checkbox>
                                    </div>

                                    {/*  Quantity */}
                                    <div className="text-center">
                                      <InputNumber {...sharedProps} />
                                    </div>

                                    {/* Price  */}
                                    <div className=" border border-gray-300 p-1 rounded ">
                                      <Text className="text-sm font-medium">
                                        {modify.unitPrice.toLocaleString()}{" "}
                                        <span className="ml-15">MMK</span>
                                      </Text>
                                    </div>
                                  </div>
                                ))
                              }
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  )}
                </Card>
              );
            })}
          </Space>

          {
            !isView &&
            <div className=" mt-3 ">
              <Button className="custom-blue-btn" onClick={addMenu}>
                Add Menu
              </Button>
            </div>
          }
        </Form>
      </Drawer>
    </>
  );
};

export default FoodBeverageOrderForm;
