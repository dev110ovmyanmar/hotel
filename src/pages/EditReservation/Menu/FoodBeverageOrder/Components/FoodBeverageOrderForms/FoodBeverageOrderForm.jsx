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
  Tooltip,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { queryClient } from "../../../../../../app/queryClient";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { reservationRoomMeta } from "../../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import {
  createFoodBeverageOrder,
  foodBeverageOrderDetails,
  updateFoodBeverageOrder,
} from "../../../../../../api/foodBeverageOrder";
import Toast from "../../../../../../component/Toast/Toast";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import dayjs from "dayjs";
import { values } from "lodash";

const { Text } = Typography;

const FoodBeverageOrderForm = ({
  open,
  onClose,
  reservationUuid,
  reservationRoomNo,
  reservationRoomId,
  mode,
  setMode,
  selectedData,
}) => {
  const [form] = Form.useForm();
  const itemsValue = Form.useWatch("items", form);

  const isAdd = mode === "add";
  console.log(isAdd, "IsAddtrue?");
  const isEdit = mode === "edit";
  const isView = mode === "view";
  const [orders, setOrders] = useState([{ id: Date.now() }]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [menuUuid, setMenuUuid] = useState({});

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const allStatuses = initData?.statuses;
  const consumptionType = allStatuses.consumption_type.map((order) => ({
    value: order?.uuid,
    label: order?.name,
  }));

  const orderType = allStatuses.order_type.map((type) => ({
    value: type?.uuid,
    label: type?.name,
  }));

  const { data } = useApiQuery({
    fetchQueryName: "order",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: reservationUuid,
      },
    },
  });

  const menuItemOptions = data?.menu_items?.map((menu) => ({
    value: menu?.uuid,
    label: menu?.name,
  }));

  const roomOptions = data?.rooms?.map((menu) => ({
    value: menu?.room.uuid,
    label: menu?.room.roomNo,
    // disabled:
  }));

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
    // max: 10,
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
    console.log(mode, "FormSubmitmode");
    const menuItems = values?.items.map((item) => ({
      uuid: item.menu,
      quantity: item.quantity,
      modifiers: item?.modifier?.map((uuid) => ({
        uuid: uuid,
        quantity: 1,
      })),
    }));
    const payload = {
      orderAt:
        values?.orderDate && values?.orderTime && isEdit
          ? `${values.orderDate.format("YYYY-MM-DD")} ${values.orderTime.format("HH:mm:ss")}`
          : null,
      menuItems: menuItems,
      consumptionType: {
        uuid: values?.consumptionType,
      },
      orderStatus: {
        uuid: values?.orderStatus,
      },
      orderType: {
        uuid: values?.orderType,
      },
      uuid: isEdit ? selectedData?.uuid : null,
      reservation: {
        uuid: isAdd ? reservationUuid : null,
      },
    };
    if (isAdd) {
      createFoodBeverate.mutate(payload, {
        onSuccess: () => {
          Toast.success("Food Order Created Successfully");
          onClose(false);
        },
      });
    }

    if (isEdit) {
      updateFoodBeverate.mutate(payload, {
        onSuccess: () => {
          Toast.success("Food Order Updated Successfully");
          onClose(false);
        },
      });
    }
  };

  const { data: fnbOrderDetails } = useApiQuery({
    fetchQueryName: "fnb-order-details",
    fetchQueryFunction: foodBeverageOrderDetails,
    params: {
      uuid: selectedData?.uuid,
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });
  console.log(fnbOrderDetails, "fnbOrderDetailsSelectedDataIn");

  useEffect(() => {
    if (fnbOrderDetails && (isView || isEdit)) {
      const customDate = dayjs(fnbOrderDetails.orderedAt);

      const menuItems =
        fnbOrderDetails.fnbOrderItems?.map((item) => ({
          menu: item.menuItems?.uuid,
          quantity: item.quantity,
          pricePerQty: item.unitPrice,
          modifier: item?.fnbOrderItemModifiers?.map(
            (item) => item?.modifiers?.uuid,
          ),
        })) || [];

      // Render one card for each menu
      setOrders(menuItems.map((_, index) => ({ id: index + 1 })));

      // So modifier section knows which menu is selected
      const selectedMenus = {};
      menuItems.forEach((item, index) => {
        selectedMenus[index] = item.menu;
      });
      setMenuUuid(selectedMenus);

      form.setFieldsValue({
        orderDate: customDate,
        orderTime: customDate,
        room: reservationRoomNo,
        consumptionType: fnbOrderDetails.consumptionType?.uuid,
        orderType: fnbOrderDetails.orderType?.uuid,
        orderStatus: fnbOrderDetails.orderStatus?.uuid,
        items: menuItems,
      });
    }
  }, [fnbOrderDetails, isView, isEdit]);

  useEffect(() => {
    const pendingStatus = allStatuses?.order_status?.find(
      (status) => status.code === "pending",
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
      (isAdd && ["cancelled", "completed"].includes(order.code)) ||
      (isEdit &&
        currentOrderStatus === "pending" &&
        ["cancelled", "completed"].includes(order.code)) ||
      (currentOrderStatus === "in_progress" &&
        ["pending"].includes(order.code)),
  }));

  const handleChangeMenu = (value, option, index) => {
    setMenuUuid((prev) => ({
      ...prev,
      [index]: value,
    }));

    const selectedMenu = data?.menu_items?.find((menu) => menu.uuid === value);

    if (selectedMenu) {
      form.setFieldValue(["items", index, "pricePerQty"], selectedMenu.price);
    }
  };

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
              <>
                {isAdd && (
                  <Button
                    type="primary"
                    onClick={() => {
                      (form.submit(), setMode("add"));
                    }}
                  >
                    Create
                  </Button>
                )}
              </>
            )}
          </div>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          disabled={isView}
        >
          <Card
            size="small"
            title={
              <>
                <div className="flex justify-between items-center">
                  <div>Order Info</div>
                  {isEdit && (
                    <div>
                      <Button
                        type="primary"
                        onClick={() => {
                          (form.submit(), setMode("edit"));
                        }}
                      >
                        Update Order Info
                      </Button>
                    </div>
                  )}
                </div>
              </>
            }
            className="shadow-sm rounded"
            // headStyle={{ backgroundColor: "#fafafa" }}
          >
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
                  disabled={
                    currentOrderStatus === "completed" ||
                    currentOrderStatus === "cancelled"
                  }
                />
              </Form.Item>
            </div>
          </Card>
          <Space direction="vertical" size="large" className="w-full">
            {orders.map((order, index) => {
              // selected menu for card
              const selectedMenuItem = data?.menu_items?.find(
                (addon) => addon?.uuid === menuUuid[index],
              );

              const hasSelectedModifiers =
                fnbOrderDetails?.fnbOrderItems?.[index]?.fnbOrderItemModifiers
                  ?.length > 0;

              const showModifier = isAdd
                ? selectedMenuItem?.modifiers?.length > 0
                : hasSelectedModifiers;
              return (
                <Card
                  key={order.id}
                  title={
                    <>
                      <div className="flex justify-between items-center">
                        <div>{`Order ${index + 1}`}</div>
                        {isEdit && (
                          <div>
                            <Button type="primary">Update</Button>
                          </div>
                        )}
                      </div>
                    </>
                  }
                  className="shadow-sm rounded mb-4 border-l-4 border-blue-500"
                  // headStyle={{ backgroundColor: "#fafafa" }}
                  size="small"
                  extra={
                    orders.length > 1 && (
                      <Tooltip title="Delete Order">
                        <DeleteOutlined
                          style={{ fontSize: "16px", color: "red" }}
                          onClick={() => deleteOrder(order.id, index)}
                        />
                      </Tooltip>
                    )
                  }
                >
                  <div className="grid grid-cols-3 gap-3">
                    <Form.Item
                      label="Menu"
                      name={["items", index, "menu"]}
                      required
                    >
                      <Select
                        options={menuItemOptions}
                        onChange={(value, option) =>
                          handleChangeMenu(value, option, index)
                        }
                        placeholder="Select Menu"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Quantity"
                      name={["items", index, "quantity"]}
                      initialValue={1}
                    >
                      <InputNumber {...sharedProps} />
                    </Form.Item>
                    <Form.Item
                      label="Price Per Qty"
                      name={["items", index, "pricePerQty"]}
                    >
                      <InputNumber className="!w-full" min={0} suffix="MMK" />
                    </Form.Item>
                  </div>

                  {/* Add on List */}
                  {orders?.length > 0 && (
                    <div>
                      {showModifier ? (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Text strong>Add on Menu</Text>
                            <Tag color="default" className="mr-0">
                              Optional
                            </Tag>
                          </div>
                          <Form.Item
                            name={["items", index, "modifier"]}
                            className="mb-0"
                          >
                            <Checkbox.Group className="w-full">
                              <div className="space-y-2">
                                {selectedMenuItem?.modifiers?.map((modify) => (
                                  <div
                                    // key={modify.label}
                                    className="grid grid-cols-3 gap-3 items-center py-2 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                  >
                                    {/*  Select Box + Name */}
                                    <div className="flex items-center">
                                      <Checkbox
                                        key={modify.uuid}
                                        value={modify.uuid}
                                      >
                                        <span className="ml-2 text-sm">
                                          {modify.name}
                                        </span>
                                      </Checkbox>
                                    </div>

                                    {/*  Quantity */}
                                    <div className="text-center">
                                      <InputNumber
                                        {...sharedProps}
                                        value={modify?.unitCost}
                                      />
                                    </div>

                                    {/* Price  */}
                                    <div className=" border border-gray-300 p-1 rounded ">
                                      <Text className="text-sm font-medium">
                                        {modify.unitPrice.toLocaleString()}{" "}
                                        <span className="ml-15">MMK</span>
                                      </Text>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Checkbox.Group>
                          </Form.Item>
                        </div>
                      ) : null}

                      {/*  selected add on labels */}
                    </div>
                  )}
                </Card>
              );
            })}
          </Space>

          {!isView && (
            <div className=" mt-3 ">
              <Button className="custom-blue-btn" onClick={addMenu}>
                Add Menu
              </Button>
            </div>
          )}
        </Form>
      </Drawer>
    </>
  );
};

export default FoodBeverageOrderForm;
