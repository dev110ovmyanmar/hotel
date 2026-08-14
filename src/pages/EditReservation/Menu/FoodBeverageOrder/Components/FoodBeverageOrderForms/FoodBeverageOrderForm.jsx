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
  Spin,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { queryClient } from "../../../../../../app/queryClient";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { reservationRoomMeta } from "../../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { createFoodBeverageOrder, deleteFoodBeverageOrderItem, foodBeverageOrderDetails, updateFoodBeverageOrder, upsertFoodBeverageOrderItem } from "../../../../../../api/foodBeverageOrder";
import Toast from "../../../../../../component/Toast/Toast";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import dayjs from "dayjs";
import { values } from "lodash";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { AiOutlineCloseSquare } from "react-icons/ai";


const { Text } = Typography;

const FoodBeverageOrderForm = ({
  open,
  onClose,
  reservationUuid,
  reservationRoomNo,
  reservationRoomId,
  reservationRoomUuid,
  mode,
  setMode,
  selectedData
}) => {
  const [form] = Form.useForm();
  const itemsValue = Form.useWatch("items", form);
  console.log(itemsValue, "ItemValuesssssss")

  const isAdd = mode === "add";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [summaryOpen, setSummaryOpen] = useState(false);
  const [menuUuid, setMenuUuid] = useState({});
  const [addedMenuIndex, setAddedMenuIndex] = useState(null);
  const [isEditToCreate, setIsEditToCreate] = useState(null);
  const [foodBeverageMenuSuccess, setFoodBeverageMenuSuccess] = useState(false);
  const [isSameUuid, setIsSameUuid] = useState([]);
  const [clickAddMenu, setClickAddMenu] = useState(false);
  const [isClickedEditUuid, setIsClickedEditUuid] = useState();

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const allStatuses = initData?.statuses;
  const consumptionType = allStatuses.consumption_type.map(order => (
    { value: order?.uuid, label: order?.name }
  ));
  const orderType = allStatuses.order_type.map(type => (
    { value: type?.uuid, label: type?.name }
  ));

  const { data, isPending: reservationRoomMetaPending } = useApiQuery({
    fetchQueryName: "order",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: reservationUuid,
      },
    },
  });

  const roomOptions = data?.rooms?.map(menu => (
    {
      value: menu?.room.uuid,
      label: menu?.room.roomNo,
    }
  ));

  const sharedProps = {
    mode: "spinner",
    min: 0,
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

  const deleteFoodBeverageOrderMenu = useApiMutation({
    mutationFn: deleteFoodBeverageOrderItem,
    invalidateKeys: [
      ["fnb-order-details", { uuid: selectedData?.uuid }],
    ],
  });

  const handleSubmit = (values) => {
    console.log(values, "handleSubmitValues")
    const menuItems = values?.items.map(item => ({
      uuid: item.menu,
      quantity: item.quantity,
      modifiers: item?.modifier?.map(uuid => ({
        uuid,
        quantity: item?.modifierQuantities?.[uuid] ?? 0,
      })),
    }));
    const payload = {
      orderAt: values?.orderDate && values?.orderTime
        ? `${values.orderDate.format("YYYY-MM-DD")} ${values.orderTime.format("HH:mm:ss")}`
        : null,
      menuItems: menuItems,
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
      reservationRoom: {
        uuid: reservationRoomUuid
      }
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
    data: fnbOrderDetails,
    isPending: fnbOrderDetailsPending
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

  useEffect(() => {
    if (!fnbOrderDetails || (!isView && !isEdit)) return;
    if (!data?.menu_items) return;

    const customDate = dayjs(fnbOrderDetails.orderedAt);

    const menuItems =
      fnbOrderDetails.fnbOrderItems?.map((item) => {
        const menuUuid = item?.menuItem?.uuid;

        // Find the full menu from your menu API data
        const selectedMenu = data.menu_items.find(
          (menu) => menu.uuid === menuUuid
        );

        // Existing modifiers from backend
        const existingModifiers =
          item?.fnbOrderItemModifiers || [];

        // Checkbox values
        const selectedModifiers = existingModifiers.map(
          (modifierItem) => modifierItem?.modifier?.uuid
        );

        // Create quantity for EVERY modifier in the menu
        const modifierQuantities = Object.fromEntries(
          (selectedMenu?.modifiers || []).map((modifier) => {
            const existingModifier = existingModifiers.find(
              (modifierItem) =>
                modifierItem?.modifier?.uuid === modifier.uuid
            );

            return [
              modifier.uuid,
              existingModifier?.quantity ?? 0,
            ];
          })
        );

        return {
          menu: menuUuid,
          quantity: item?.quantity,
          pricePerQty: item?.unitPrice,
          modifier: selectedModifiers,
          modifierQuantities,
        };
      }) || [];

    // Tell your UI which menu is selected
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
  }, [
    fnbOrderDetails,
    data?.menu_items,
    isView,
    isEdit,
    reservationRoomNo,
    form,
  ]);

  useEffect(() => {
    const pendingStatus = allStatuses?.order_status?.find(
      (status) => status.code === "pending"
    );

    if (isAdd && pendingStatus) {
      form.setFieldsValue({
        orderStatus: pendingStatus.uuid,
      });
    }
  }, [allStatuses, form]);

  const currentOrderStatus = fnbOrderDetails?.orderStatus?.code;

  const orderStatusOptions = allStatuses.order_status.map((order) => ({
    value: order.uuid,
    label: order.name,
    disabled:
      (
        isAdd &&
        (["cancelled", "completed"]).includes(order.code)
        ||
        isEdit &&
        (
          currentOrderStatus === "in_progress" &&
          ["pending"].includes(order.code)
        )
      ),
  }));

  const handleChangeMenu = (value, option, index) => {
    setMenuUuid((prev) => ({
      ...prev,
      [index]: value
    }))

    const selectedMenu = data?.menu_items?.find(
      (menu) => menu.uuid === value
    );

    if (selectedMenu) {
      form.setFieldValue(
        ["items", index, "pricePerQty"],
        selectedMenu.price
      );
    }

    form.setFieldValue(
      ["items", index, "quantity"],
      1
    );

    const modifierQuantities = {};

    selectedMenu.modifiers?.forEach((modifier) => {
      modifierQuantities[modifier.uuid] = 0;
    });

    form.setFieldValue(
      ["items", index, "modifierQuantities"],
      modifierQuantities
    );
  };

  const upsertFoodBeverageOrderItems = useApiMutation({
    mutationFn: upsertFoodBeverageOrderItem,
    invalidateKeys: [["fnb-order-details"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const handleUpdateMenuSubmit = (index) => {
    // console.log(selectedData,"selecteddatamen")
    // if (selectedData !== isClickedEditUuid) return;
    const values = form.getFieldsValue();

    const item = values?.items?.[index];

    const existingFnbOrderItem =
      fnbOrderDetails?.fnbOrderItems?.[index];

    const payload = {
      uuid: selectedData?.uuid,
      fnbOrderItem: {
        uuid: isClickedEditUuid
      },
      menuItem: {
        uuid: item?.menu,
        quantity: item?.quantity,
        modifiers:
          item?.modifier?.map((uuid) => ({
            uuid,
            quantity: item?.modifierQuantities?.[uuid] || 1,
          })) || [],
      },
    };


    upsertFoodBeverageOrderItems.mutate(payload, {
      onSuccess: () => {
        Toast.success("Food Beverage Order Item Updated Successfully.");
        // onClose(false);
        setIsEditToCreate(false);
        setAddedMenuIndex(null);
        setIsClickedEditUuid(null);
        setClickAddMenu(false)
        // setFoodBeverageMenuSuccess(true)
      }
    })

  }

  const handleDeleteMenu = (index, itemUuid) => {
    console.log(selectedData, "handleDeleteMenuIndex")

    const payload = {
      uuid: selectedData?.uuid,
      fnbOrderItem: {
        uuid: itemUuid
      }
    }

    deleteFoodBeverageOrderMenu.mutate(payload, {
      onSuccess: () => {
        remove(index);

        setAddedMenuIndex(null);
        setIsEditToCreate(null);
      }
    });
  };

  useEffect(() => {
    if (isAdd) {
      form.setFieldsValue({
        items: [
          {
            quantity: 0,
          },
        ],
      });

      setAddedMenuIndex(0);
      setIsEditToCreate(null);
    }
  }, [isAdd, form]);

  const isMenuEditable = (index) => {
    const currentItemUuid = fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;
    return (
      addedMenuIndex === index ||
      isEditToCreate === index ||
      !isSameUuid.includes(currentItemUuid)
    )
  }

  const handleOnClose = () => {
    onClose(false);
    form.resetFields();
    setMenuUuid({});
    setAddedMenuIndex(null);
  };

  const handleCloseForMenu = (name) => {
    form.resetFields([
      ["items", name],
    ]);
  }
  return (
    <>
      <Drawer
        open={open}
        onClose={handleOnClose}
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
                {
                  isAdd &&
                  <Button type="primary" onClick={() => {
                    form.submit(),
                      setMode("add")
                  }}>
                    Create
                  </Button>
                }
              </>
            )}
          </div>
        }
      >
        {
          !isAdd && (reservationRoomMetaPending || fnbOrderDetailsPending) ?
            <Spin />
            :
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              disabled={isView}
            >
              <Card size="small"
                title={(
                  <>
                    <div className="flex justify-between items-center">
                      <div>Order Info</div>
                      {
                        isEdit &&
                        <div>
                          <Button type="primary" onClick={() => {
                            form.submit(),
                              setMode("edit")
                          }} >
                            Update
                          </Button>
                        </div>
                      }
                    </div>
                  </>

                )}
                className="shadow-sm rounded"
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
                      options={orderStatusOptions}
                      disabled={currentOrderStatus === "completed" || currentOrderStatus === "cancelled"}
                    />
                  </Form.Item>
                </div>
              </Card>
              <Space direction="vertical" size="large" className="w-full my-2">
                <Form.List name="items" className="!my-2">
                  {(fields, { remove, add }) => (
                    <div>
                      {fields.map(({ key, name }) => {
                        const selectedMenuItem = data?.menu_items?.find(
                          (addon) => addon?.uuid === menuUuid[name]
                        );

                        const hasSelectedModifiers =
                          fnbOrderDetails?.fnbOrderItems?.[name]
                            ?.fnbOrderItemModifiers?.length > 0;

                        const showModifier = selectedMenuItem?.modifiers?.length > 0;
                        const currentMenu = itemsValue?.[name]?.menu;

                        const selectedMenus =
                          itemsValue?.map(item => item?.menu).filter(Boolean) || [];

                        const menuOptions = data?.menu_items?.map(menu => ({
                          value: menu.uuid,
                          label: menu.name,
                          disabled:
                            selectedMenus.includes(menu.uuid) &&
                            menu.uuid !== currentMenu,
                        }));

                        // New Uuid

                        const menuCardUuid = fnbOrderDetails?.uuid;
                        const currentItemUuid = fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;

                        const isClickedItemtoCreate = isSameUuid.includes(currentItemUuid);
                        console.log(isClickedEditUuid, "isClickedEditUuid")

                        const addNewMenu = addedMenuIndex === name;
                        return (
                          <Card
                            key={currentItemUuid}
                            title={
                              <div className="flex justify-between items-center">
                                <div>{`Menu ${name + 1}`}</div>
                              </div>
                            }
                            className="shadow-sm rounded !my-2 border-l-4 border-blue-500"
                            size="small"
                            extra={
                              fields?.length > 1 ?
                                <>
                                  {
                                    isEdit && (
                                      <div className="flex gap-x-3">

                                        {/* Newly added menu */}
                                        {(menuCardUuid && currentItemUuid === isClickedEditUuid) || (!isClickedEditUuid && !currentItemUuid) ? (
                                          <>
                                            <Tooltip title="Save Menu">
                                              {
                                                createFoodBeverageOrder.isPending ?
                                                  <Spin />
                                                  :
                                                  <AiOutlineCheckSquare
                                                    onClick={() => {
                                                      if (
                                                        itemsValue?.[name]?.menu &&
                                                        !createFoodBeverageOrder?.isPending
                                                      ) {
                                                        handleUpdateMenuSubmit(name)
                                                      }
                                                    }}
                                                    className={`text-2xl ${itemsValue?.[name]?.menu
                                                      ? "cursor-pointer text-blue-500"
                                                      : "cursor-not-allowed text-gray-400"
                                                      }`}
                                                    disabled={createFoodBeverageOrder?.isPending}
                                                  />
                                              }
                                            </Tooltip>

                                            <Tooltip title="Cancel Input Field">
                                              <AiOutlineCloseSquare
                                                onClick={() => {
                                                  handleCloseForMenu(name)

                                                }}
                                                className="text-2xl cursor-pointer text-red-500"
                                              />
                                            </Tooltip>

                                            <Tooltip title="Delete Menu">
                                              <DeleteOutlined
                                                onClick={() => {
                                                  if(isClickedEditUuid){
                                                      handleDeleteMenu(name, isClickedEditUuid);
                                                  }
                                                  else{
                                                    remove(name);
                                                  }
                                                }}
                                                className="text-2xl cursor-pointer !text-red-500"
                                              />
                                            </Tooltip>
                                          </>
                                        ) : (
                                          /* Existing menu */
                                          <>
                                            <Tooltip title="Edit Menu">
                                              <EditOutlined
                                                onClick={() => {
                                                  if (isClickedEditUuid || clickAddMenu) return;

                                                  const editMenuUuidtoCreate = fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;

                                                  if (editMenuUuidtoCreate) {
                                                    setIsSameUuid((prev) =>
                                                      prev?.includes(editMenuUuidtoCreate)
                                                        ? prev
                                                        : [...prev, editMenuUuidtoCreate]
                                                    )
                                                    setIsEditToCreate(name);
                                                    if (currentItemUuid !== isClickedEditUuid || !isClickedEditUuid) {
                                                      setIsClickedEditUuid(editMenuUuidtoCreate)
                                                    }

                                                  }

                                                }}
                                                className={`text-2xl ${(isClickedEditUuid && isClickedEditUuid === currentItemUuid && clickAddMenu) || (!clickAddMenu && !isClickedEditUuid)
                                                  ? "!cursor-pointer !text-blue-500"
                                                  : "!cursor-not-allowed !text-gray-400"
                                                  }`}

                                              />
                                            </Tooltip>

                                            <Tooltip title="Delete Menu">
                                              <DeleteOutlined
                                                onClick={() => {
                                                  const itemUuid = fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;

                                                  console.log(itemUuid, "ItemUUId")
                                                  if (!itemUuid) {
                                                    return;
                                                  }

                                                  // Existing menu → call delete API
                                                  if (itemUuid) {
                                                    handleDeleteMenu(name, itemUuid);
                                                    return;
                                                  }

                                                  // Newly added menu → only remove from form
                                                  setAddedMenuIndex(null);
                                                  setIsEditToCreate(null);
                                                  // remove(name);
                                                }}
                                                className="text-2xl cursor-pointer !text-red-500"
                                              />
                                            </Tooltip>
                                          </>
                                        )}

                                      </div>
                                    )
                                  }
                                </>
                                :
                                null
                            }
                          >
                            <div className="grid grid-cols-3 gap-3">
                              <Form.Item
                                label="Menu"
                                name={[name, "menu"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select a menu",
                                  },
                                ]}
                              >
                                <Select
                                  options={menuOptions}
                                  onChange={(value, option) =>
                                    handleChangeMenu(value, option, name)
                                  }
                                  placeholder="Select Menu"
                                  disabled={clickAddMenu && !currentItemUuid ? false : isAdd ? false : true}
                                />
                              </Form.Item>

                              <Form.Item
                                label="Quantity"
                                name={[name, "quantity"]}
                              >
                                <InputNumber
                                  {...sharedProps}
                                  disabled={currentItemUuid !== isClickedEditUuid}
                                />
                              </Form.Item>

                              <Form.Item
                                label="Price Per Qty"
                                name={[name, "pricePerQty"]}
                              >
                                <InputNumber
                                  className="!w-full"
                                  min={0}
                                  suffix="MMK"
                                  disabled={true}
                                />
                              </Form.Item>
                            </div>

                            {showModifier
                              ? (
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <Text strong>Add on Menu</Text>

                                    <Tag color="default" className="mr-0">
                                      Optional
                                    </Tag>
                                  </div>

                                  <Form.Item
                                    name={[name, "modifier"]}
                                    className="mb-0"
                                  >
                                    <Checkbox.Group
                                      className="w-full"
                                      disabled={currentItemUuid !== isClickedEditUuid}
                                      onChange={(checkedValues) => {
                                        selectedMenuItem?.modifiers.forEach((modify) => {
                                          const uuid = modify.uuid;

                                          const currentQuantity =
                                            form.getFieldValue([
                                              "items",
                                              name,
                                              "modifierQuantities",
                                              uuid,
                                            ]) ?? 0;

                                          const newQuantity = checkedValues.includes(uuid)
                                            ? currentQuantity > 0
                                              ? currentQuantity
                                              : 1
                                            : 0;

                                          form.setFieldValue(
                                            ["items", name, "modifierQuantities", uuid],
                                            newQuantity
                                          );
                                        });
                                      }}

                                    >
                                      <div className="space-y-2">
                                        {selectedMenuItem?.modifiers?.map(modify => {
                                          const selectedModifiers = itemsValue?.[name]?.modifier || [];

                                          const isModifierChecked = selectedModifiers.includes(modify.uuid);

                                          return (
                                            <div
                                              key={modify.uuid}
                                              className="grid grid-cols-3 gap-3 items-center py-2 border-b border-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                                            >
                                              <div className="flex items-center">
                                                <Checkbox
                                                  value={modify.uuid}
                                                  disabled={currentItemUuid !== isClickedEditUuid}
                                                >
                                                  <span className="ml-2 text-sm">
                                                    {modify.name}
                                                  </span>
                                                </Checkbox>
                                              </div>

                                              <Form.Item
                                                name={[name, "modifierQuantities", modify.uuid]}
                                                className="!m-0"
                                              >
                                                <InputNumber
                                                  {...sharedProps}
                                                  disabled={currentItemUuid !== isClickedEditUuid}

                                                />
                                              </Form.Item>

                                              <Form.Item className="!m-0">
                                                <InputNumber
                                                  className="!w-full"
                                                  min={0}
                                                  suffix="MMK"
                                                  disabled={true}
                                                  value={modify.unitPrice.toLocaleString()}
                                                />
                                              </Form.Item>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </Checkbox.Group>
                                  </Form.Item>
                                </div>
                              )
                              :
                              null
                            }
                          </Card>
                        );
                      })}

                      {
                        !isView &&
                        <Button
                          className="custom-blue-btn"
                          onClick={() => {
                            const newIndex = fields.length;

                            add({ quantity: 1 });
                            setAddedMenuIndex(newIndex);
                            console.log(addedMenuIndex, "addedMenuIndex");

                            setClickAddMenu(true)

                          }}
                          disabled={
                            !itemsValue?.every(item => item?.menu) ||
                            isClickedEditUuid ||
                            clickAddMenu

                          }

                        >
                          Add Menu
                        </Button>
                      }
                    </div>
                  )}
                </Form.List>
              </Space>
            </Form>
        }
      </Drawer >
    </>
  );
};

export default FoodBeverageOrderForm;
