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
  Modal,
  Collapse,
  Table,
  Descriptions,
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
import { BookTemplateIcon, Check } from "lucide-react";
import PriceTag, { priceFormatter, priceParser } from "../../../../../../component/PriceTag/PriceTag";
import { InfoRow, SectionCard } from "../../../RoomInformation/Components/RoomInformationForms/DailyBreakDownDetailFormDrawer";


const { Text } = Typography;

const FoodBeverageOrderForm = ({
  open,
  onClose,
  reservationUuid,
  reservationRoomNo,
  reservationRoomId,
  reservationRoomUuid,
  refetchOrderList,
  mode,
  setMode,
  selectedData
}) => {
  const [form] = Form.useForm();
  const itemsValue = Form.useWatch("items", form);
  const selectedOrderType = Form.useWatch("orderType", form);
  const taxValue = Form.useWatch("tax", form);
  const serviceChargesValue = Form.useWatch("serviceCharges", form);

  const isAdd = mode === "add";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  const [menuUuid, setMenuUuid] = useState({});
  const [addedMenuIndex, setAddedMenuIndex] = useState(null);
  const [isSameUuid, setIsSameUuid] = useState([]);
  const [clickAddMenu, setClickAddMenu] = useState(false);
  const [isClickedEditUuid, setIsClickedEditUuid] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteUuid, setIsDeleteUuid] = useState();
  const [deleteTarget, setDeleteTarget] = useState({
    index: null,
    itemUuid: null,
  });

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const allStatuses = initData?.statuses;
  const consumptionType = allStatuses.consumption_type.map(order => (
    { value: order?.uuid, label: order?.name }
  ));

  const orderType = allStatuses.order_type.map(type => (
    { value: type?.uuid, label: type?.name, code: type?.code }
  ));
  const dineInOrderType =
    orderType?.find((type) => type.value === selectedOrderType)?.code === "dine_in";

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
      value: menu?.uuid,
      label: menu?.room.roomNo,
    }
  ));

  const tableOptions = data?.restaurant_tables.map(table => (
    { value: table?.uuid, label: table?.tableNo }
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
        uuid: values?.room
      },
      restaurantTable: {
        uuid: values?.tableNo
      },
      isTaxable: values?.tax,
      isServiceChargeable: values?.serviceCharges,
      refNo: values?.refNo
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
        const menuUuidFromFnbDetails = item?.menuItem?.uuid;

        // Find the full menu from your menu API data
        const selectedMenu = data.menu_items.find(
          (menu) => menu.uuid === menuUuidFromFnbDetails
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
          menu: menuUuidFromFnbDetails,
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
      room: fnbOrderDetails?.reservationRoom?.uuid,
      consumptionType: fnbOrderDetails.consumptionType?.uuid,
      orderType: fnbOrderDetails.orderType?.uuid,
      orderStatus: fnbOrderDetails.orderStatus?.uuid,
      tableNo: fnbOrderDetails?.restaurantTable?.uuid,
      tax: fnbOrderDetails?.isTaxable,
      serviceCharges: fnbOrderDetails?.isServiceChargeable,
      refNo: fnbOrderDetails?.refNo,
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

    if (isAdd) {
      form.setFieldsValue({
        tax: true,
        serviceCharges: false
      })
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

      form.setFieldValue(
        ["items", index, "quantity"],
        1
      );
    }

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
        setAddedMenuIndex(null);
        setIsClickedEditUuid(null);
        setClickAddMenu(false);
        setIsDeleteUuid(null)
      }
    })
  }

  const handleDeleteMenu = (itemUuid) => {
    const payload = {
      uuid: selectedData?.uuid,
      fnbOrderItem: {
        uuid: itemUuid
      }
    }

    deleteFoodBeverageOrderMenu.mutate(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        // Remove only the deleted UUID from edit state
        setIsSameUuid((prev) =>
          prev.filter((uuid) => uuid !== itemUuid)
        );

        // Reset current editing state
        setIsClickedEditUuid();
        setClickAddMenu(false);
        setAddedMenuIndex(null);
        setIsDeleteUuid(null);
        setDeleteTarget({
          index: null,
          itemUuid: null,
        });
      }
    });
  };

  useEffect(() => {
    if (isAdd) {
      form.setFieldsValue({
        items: [
          {
            quantity: 0,
            pricePerQty: 0
          },
        ],
      });

      setAddedMenuIndex(0);
      setIsSameUuid([]);
      setIsClickedEditUuid(null);
      setClickAddMenu(false);
      setIsDeleteUuid(null)
    }
  }, [isAdd, form]);

  const handleOnClose = async () => {
    onClose(false);
    form.resetFields();
    setMenuUuid({});
    setAddedMenuIndex(null);
    setIsDeleteUuid(null)

    await refetchOrderList()
  };

  const handleCloseForMenu = (name) => {
    form.resetFields([
      ["items", name],
    ]);
  };

  const handleCanceltoOriginalValue = (name) => {
    const originalItem =
      fnbOrderDetails?.fnbOrderItems?.[name];

    const originalMenuUuid = fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;

    if (!originalItem) return;

    form.setFieldValue(
      ["items", name, "menu"],
      originalItem?.menuItem?.uuid
    );

    form.setFieldValue(
      ["items", name, "quantity"],
      originalItem?.quantity ?? 0
    );

    form.setFieldValue(
      ["items", name, "pricePerQty"],
      originalItem?.unitPrice ?? 0
    );

    form.setFieldValue(
      ["items", name, "modifier"],
      originalItem?.fnbOrderItemModifiers?.map(
        (modifier) => modifier?.modifier?.uuid
      ) ?? []
    );

    form.setFieldValue(
      ["items", name, "modifierQuantities"],
      Object.fromEntries(
        originalItem?.fnbOrderItemModifiers?.map((modifier) => [
          modifier?.modifier?.uuid,
          modifier?.quantity ?? 0
        ]) ?? []
      )
    );

    setIsSameUuid([]);
    setAddedMenuIndex(null);
    setIsClickedEditUuid(null);
    setClickAddMenu(false);
    setIsDeleteUuid(null)
  };

  const columns = [
    {
      title: "Menu",
      dataIndex: ["menuItem", "name"],
      key: "menu",
    },
    {
      title: "Price",
      key: "price",
      render: (record) => {
        return (
          <div>{record?.quantity} x {record?.menuItem.price}</div>
        )
      }
    },
    {
      title: "Add on Price",
      dataIndex: "modifierTotal",
      key: "modifierTotal",
      render: (text) => {
        return (
          <div>{text.toLocaleString()}</div>
        )
      },
      align: "center"
    },
    {
      title: "Total",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (text) => {
        return (
          <div>{text.toLocaleString()}</div>
        )
      },
      align: "right"
    },
  ];

  return (
    <>
      <Drawer
        open={open}
        onClose={handleOnClose}
        size={600}
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
                <Button
                  type="primary"
                  onClick={() => setMode("edit")}
                >
                  Edit
                </Button>
              )
            ) : (
              <>
                {
                  isAdd &&
                  <Button
                    type="primary" onClick={() => {
                      form.submit(),
                        setMode("add")
                    }}
                    loading={createFoodBeverate?.isPending}
                  >
                    Create
                  </Button>
                }
              </>
            )}
          </div>
        }
      >
        {
          isEdit && (reservationRoomMetaPending || fnbOrderDetailsPending) ?
            <Spin />
            :
            !isView &&
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
                          }}
                            loading={updateFoodBeverate?.isPending}

                          >
                            Update
                          </Button>
                        </div>
                      }
                    </div>
                  </>

                )}
                className="shadow-sm rounded order-info-forms"
              >
                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item
                    label="Order Date"
                    name="orderDate"
                    rules={[{ required: true }]}
                  >
                    <DatePicker className="w-full" format="YYYY-MM-DD" />
                  </Form.Item>
                  <Form.Item
                    label="Order Time"
                    name="orderTime"
                    rules={[{ required: true }]}
                  >
                    <TimePicker className="w-full" format="h:mm A" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item label="Room" name="room" >
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

                <div className="grid grid-cols-2 gap-x-4">
                  <Form.Item
                    label="Ref No"
                    name="refNo"
                  >
                    <Input
                      placeholder="Enter Ref No"
                      disabled={isView}
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
                      disabled={currentOrderStatus === "completed" || currentOrderStatus === "cancelled" || isView}
                    />
                  </Form.Item>
                </div>

                <div className="flex items-center grid grid-cols-3 gap-2 ">
                  <div className="flex gap-x-2 ">
                    <Form.Item
                      className="!m-0"
                      name="tax"
                      valuePropName="checked"
                    >
                      <Checkbox
                        classNames={{
                          icon:
                            (isView && taxValue)
                              ? "custom-checkbox-icon"
                              : "",
                        }}
                      >
                        Tax
                      </Checkbox>
                    </Form.Item>

                    <Form.Item
                      className="!m-0"
                      name="serviceCharges"
                      valuePropName="checked"
                    >
                      <Checkbox
                        classNames={{
                          icon:
                            (isView && serviceChargesValue)
                              ? "custom-checkbox-icon"
                              : "",
                        }}
                        className="!text-[11px]"
                      >
                        Service Charges
                      </Checkbox>
                    </Form.Item>
                  </div>

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

                  {
                    dineInOrderType ?
                      <Form.Item
                        label="Table No"
                        name="tableNo"
                        required={dineInOrderType}
                        rules={[
                          {
                            required: dineInOrderType,
                            message: "Please select Table No",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select Table No"
                          style={{ width: "100%" }}
                          options={tableOptions}
                        />
                      </Form.Item>
                      :
                      null
                  }
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

                        const showModifier = selectedMenuItem?.modifiers?.length > 0;
                        // const currentMenu = itemsValue?.[name]?.menu;

                        const selectedMenus =
                          itemsValue?.map(item => item?.menu).filter(Boolean) || [];

                        // const menuOptions = data?.menu_items?.map(menu => {
                        //   return (
                        //     {
                        //       value: menu.uuid,
                        //       label: menu.name,
                        //       disabled:
                        //         selectedMenus.includes(menu.uuid) &&
                        //         isNewMenu
                        //       // menu.uuid !== currentMenu,
                        //     }
                        //   )
                        // });

                        const currentMenu = itemsValue?.[name]?.menu;
                        const isNewMenu = addedMenuIndex === name;

                        const detailMenuUuids =
                          fnbOrderDetails?.fnbOrderItems
                            ?.map(item => item?.menuItem?.uuid)
                            ?.filter(Boolean) || [];

                        // const selectedMenuUuids =
                        //   itemsValue
                        //     ?.map(item => item?.menu)
                        //     ?.filter(Boolean) || [];

                        // const isNewMenu = !currentMenu;

                        const menuOptions = data?.menu_items?.map(menu => {
                          const alreadyInDetails = detailMenuUuids.includes(menu.uuid);
                          const alreadySelected = selectedMenus.includes(menu.uuid);

                          return {
                            value: menu.uuid,
                            label: menu.name,

                            disabled: isEdit
                              ? isNewMenu
                                ? alreadyInDetails || alreadySelected
                                : (alreadyInDetails || alreadySelected) &&
                                menu.uuid !== currentMenu
                              : alreadySelected,
                          };
                        });

                        // New Uuid

                        const menuCardUuid = fnbOrderDetails?.uuid;
                        const currentItemUuid = fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;

                        const isCurrentMenuEditing =
                          currentItemUuid && currentItemUuid === isClickedEditUuid;
                        const isCurrentCardEditable =
                          isNewMenu || isCurrentMenuEditing;

                        // for editoutlined
                        const isMenuEditing =
                          isClickedEditUuid === currentItemUuid;
                        const canEdit =
                          isEdit &&
                          !clickAddMenu &&
                          (
                            !isClickedEditUuid ||
                            isDeleteUuid ||
                            isMenuEditing
                          );
                        return (
                          <>
                            <Collapse
                              defaultActiveKey={isAdd || clickAddMenu ? [currentItemUuid || key] : []}
                              className="!my-2 order-info-forms"
                              items={[
                                {
                                  key: currentItemUuid || key,

                                  label: (
                                    <div className={`flex items-center w-ful justify-between`}>
                                      <div className="font-medium">
                                        {isAdd
                                          ? (
                                            menuOptions?.find(
                                              (option) =>
                                                option.value === itemsValue?.[name]?.menu
                                            )?.label || `Menu ${name + 1}`
                                          )
                                          : (
                                            fnbOrderDetails?.fnbOrderItems?.[name]?.menuItem?.name ||
                                            menuOptions?.find(
                                              (option) =>
                                                option.value === itemsValue?.[name]?.menu
                                            )?.label ||
                                            `Menu ${name + 1}`
                                          )}
                                      </div>

                                      {(!isAdd) && (
                                        <span className="mr-6">
                                          ( {fnbOrderDetails?.fnbOrderItems?.[name]?.grandTotal?.toLocaleString()} MMK )
                                        </span>
                                      )}
                                    </div>
                                  ),

                                  extra: (
                                    <div
                                      className="flex gap-x-2 items-center"
                                      onClick={(e) => {
                                        // Prevent clicking Edit/Delete from opening/closing Collapse
                                        e.stopPropagation();
                                      }}
                                    >
                                      {/* ADD MODE */}
                                      {isAdd && fields?.length > 1 && (
                                        <Tooltip title="Delete Card">
                                          <AiOutlineCloseSquare
                                            onClick={() => {
                                              if (fields?.length === 1) return;

                                              remove(name);
                                              setClickAddMenu(false);
                                            }}
                                            className="text-xl cursor-pointer text-red-500"
                                          />
                                        </Tooltip>
                                      )}

                                      {/* EDIT MODE */}
                                      {isEdit && (
                                        <>
                                          {/* Newly added menu */}
                                          {(menuCardUuid &&
                                            currentItemUuid === isClickedEditUuid) ||
                                            (!isClickedEditUuid && !currentItemUuid) ? (
                                            <>
                                              {/* Save Menu */}
                                              <Tooltip title="Save Menu">
                                                {upsertFoodBeverageOrderItems.isPending ? (
                                                  <Spin />
                                                ) : (
                                                  <AiOutlineCheckSquare
                                                    onClick={() => {
                                                      if (
                                                        itemsValue?.[name]?.menu &&
                                                        !upsertFoodBeverageOrderItems?.isPending
                                                      ) {
                                                        handleUpdateMenuSubmit(name);
                                                      }
                                                    }}
                                                    className={`text-2xl ${itemsValue?.[name]?.menu
                                                      ? "cursor-pointer text-blue-500"
                                                      : "cursor-not-allowed text-gray-400"
                                                      }`}
                                                  />
                                                )}
                                              </Tooltip>

                                              {/* Cancel */}
                                              <Tooltip title="Cancel">
                                                <AiOutlineCloseSquare
                                                  onClick={() => {
                                                    if (clickAddMenu) {
                                                      remove(name);

                                                      setIsSameUuid([]);
                                                      setAddedMenuIndex(null);
                                                      setIsClickedEditUuid(null);
                                                      setClickAddMenu(false);
                                                      setIsDeleteUuid(null);
                                                    } else {
                                                      handleCanceltoOriginalValue(name);
                                                    }
                                                  }}
                                                  className="text-2xl cursor-pointer text-red-500"
                                                />
                                              </Tooltip>

                                              {/* Delete newly added menu */}
                                              {!clickAddMenu && (
                                                <Tooltip title="Delete Menu">
                                                  <DeleteOutlined
                                                    onClick={() => {
                                                      if (fields.length <= 1) return;

                                                      const currentItem =
                                                        form.getFieldValue([
                                                          "items",
                                                          name,
                                                        ]);

                                                      const itemUuid =
                                                        fnbOrderDetails?.fnbOrderItems?.find(
                                                          (item) =>
                                                            item?.menuItem?.uuid ===
                                                            currentItem?.menu
                                                        )?.uuid;

                                                      if (!itemUuid) return;

                                                      setDeleteTarget({
                                                        index: name,
                                                        itemUuid,
                                                      });

                                                      setIsDeleteUuid(itemUuid);

                                                      if (
                                                        fields?.length > 1 &&
                                                        !clickAddMenu
                                                      ) {
                                                        setIsModalOpen(true);
                                                      }
                                                    }}
                                                    className={`!text-xl ${fields.length > 1 && canEdit
                                                      ? "!cursor-pointer !text-red-500"
                                                      : "!cursor-not-allowed !text-gray-400"
                                                      }`}
                                                  />
                                                </Tooltip>
                                              )}
                                            </>
                                          ) : (
                                            <>
                                              {/* Existing menu - Edit */}
                                              <Tooltip title="Edit Menu">
                                                <EditOutlined
                                                  onClick={() => {
                                                    if (!canEdit) return;

                                                    const itemUuid =
                                                      fnbOrderDetails?.fnbOrderItems?.[name]
                                                        ?.uuid;

                                                    if (!itemUuid) return;

                                                    setIsClickedEditUuid(itemUuid);

                                                    setIsSameUuid((prev) =>
                                                      prev.includes(itemUuid)
                                                        ? prev
                                                        : [...prev, itemUuid]
                                                    );

                                                    setClickAddMenu(false);
                                                    setIsDeleteUuid(null);
                                                  }}
                                                  className={`text-2xl ${canEdit
                                                    ? "!cursor-pointer !text-blue-500"
                                                    : "!cursor-not-allowed !text-gray-400"
                                                    }`}
                                                />
                                              </Tooltip>

                                              {/* Existing menu - Delete */}
                                              <Tooltip title="Delete Menu">
                                                <DeleteOutlined
                                                  onClick={() => {
                                                    if (fields.length <= 1) return;

                                                    const currentItem =
                                                      form.getFieldValue([
                                                        "items",
                                                        name,
                                                      ]);

                                                    const itemUuid =
                                                      fnbOrderDetails?.fnbOrderItems?.find(
                                                        (item) =>
                                                          item?.menuItem?.uuid ===
                                                          currentItem?.menu
                                                      )?.uuid;

                                                    if (!itemUuid) return;

                                                    setDeleteTarget({
                                                      index: name,
                                                      itemUuid,
                                                    });

                                                    setIsDeleteUuid(itemUuid);

                                                    if (
                                                      fields?.length > 1 &&
                                                      !clickAddMenu
                                                    ) {
                                                      setIsModalOpen(true);
                                                    }
                                                  }}
                                                  className={`!text-xl ${fields.length > 1 && canEdit
                                                    ? "!cursor-pointer !text-red-500"
                                                    : "!cursor-not-allowed !text-gray-400"
                                                    }`}
                                                />
                                              </Tooltip>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ),

                                  children: (
                                    <div className="px-1">
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
                                            disabled={
                                              isView
                                                ? true
                                                :
                                                isAdd
                                                  ? false
                                                  : !isCurrentCardEditable
                                            }
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          label="Quantity"
                                          name={[name, "quantity"]}
                                        >
                                          <InputNumber
                                            {...sharedProps}
                                            min={
                                              itemsValue?.[name]?.menu ? 1 : 0
                                            }
                                            disabled={
                                              isView
                                                ? true
                                                :
                                                isAdd
                                                  ? !itemsValue?.[name]?.menu
                                                  : !isCurrentCardEditable ||
                                                  !itemsValue?.[name]?.menu
                                            }
                                          />
                                        </Form.Item>

                                        <Form.Item
                                          label="Price Per Qty"
                                          name={[name, "pricePerQty"]}
                                        >
                                          <InputNumber
                                            className="!w-full"
                                            min={0}
                                            suffix={
                                              <div className="dark:!text-gray-200">
                                                MMK
                                              </div>
                                            }
                                            formatter={priceFormatter}
                                            parser={priceParser}
                                            disabled
                                          />
                                        </Form.Item>
                                      </div>

                                      {showModifier &&
                                        selectedMenuItem?.modifiers?.length > 0 && (
                                          <div className="mt-2">
                                            <div className="flex justify-between items-center !mb-1">
                                              <Text strong>Add on Menu</Text>

                                              <Tag
                                                color="default"
                                                className="mr-0"
                                              >
                                                Optional
                                              </Tag>
                                            </div>

                                            <Form.Item
                                              name={[name, "modifier"]}
                                              className="!mb-0 !p-0"
                                            >
                                              <Checkbox.Group
                                                className="w-full"
                                                onChange={(checkedValues) => {
                                                  selectedMenuItem?.modifiers?.forEach(
                                                    (modify) => {
                                                      const uuid = modify.uuid;

                                                      const currentQuantity =
                                                        form.getFieldValue([
                                                          "items",
                                                          name,
                                                          "modifierQuantities",
                                                          uuid,
                                                        ]) ?? 0;

                                                      const newQuantity =
                                                        checkedValues.includes(uuid)
                                                          ? currentQuantity > 0
                                                            ? currentQuantity
                                                            : 1
                                                          : 0;

                                                      form.setFieldValue(
                                                        [
                                                          "items",
                                                          name,
                                                          "modifierQuantities",
                                                          uuid,
                                                        ],
                                                        newQuantity
                                                      );
                                                    }
                                                  );
                                                }}
                                              >
                                                <div className="space-y-2">
                                                  {selectedMenuItem?.modifiers?.map(
                                                    (modify, index) => {
                                                      const selectedModifiers =
                                                        itemsValue?.[name]?.modifier ||
                                                        [];

                                                      const isModifierChecked =
                                                        selectedModifiers.includes(
                                                          modify.uuid
                                                        );

                                                      const latestRow =
                                                        index ===
                                                        selectedMenuItem.modifiers
                                                          .length -
                                                        1;

                                                      return (
                                                        <div
                                                          key={modify.uuid}
                                                          className={`
                                                            grid grid-cols-3
                                                            gap-3
                                                            items-center
                                                            py-2
                                                            !border-gray-50
                                                            hover:bg-gray-50
                                                            dark:!border-gray-700
                                                            dark:hover:bg-gray-900/50
                                                            transition-colors
                                                            ${latestRow
                                                              ? ""
                                                              : "border-b"
                                                            }
                                                        `}
                                                        >
                                                          {/* Modifier name */}
                                                          <div className="flex items-center">
                                                            <Checkbox
                                                              value={modify.uuid}
                                                              disabled={
                                                                isView
                                                                  ? true
                                                                  :
                                                                  isAdd
                                                                    ? false
                                                                    : !isCurrentCardEditable
                                                              }
                                                              classNames={{
                                                                icon:
                                                                  (isView &&
                                                                    selectedModifiers.includes(
                                                                      modify.uuid
                                                                    )) ||
                                                                    (isEdit &&
                                                                      selectedModifiers.includes(
                                                                        modify.uuid
                                                                      ))
                                                                    ? "custom-checkbox-icon"
                                                                    : "",
                                                              }}
                                                            >
                                                              <span className="ml-2 text-sm">
                                                                {modify.name}
                                                              </span>
                                                            </Checkbox>
                                                          </div>

                                                          {/* Modifier quantity */}
                                                          <Form.Item
                                                            name={[
                                                              name,
                                                              "modifierQuantities",
                                                              modify.uuid,
                                                            ]}
                                                            className="!m-0"
                                                          >
                                                            <InputNumber
                                                              {...sharedProps}
                                                              min={
                                                                isModifierChecked
                                                                  ? 1
                                                                  : 0
                                                              }
                                                              disabled={
                                                                isView
                                                                  ?
                                                                  true :
                                                                  !isModifierChecked ||
                                                                  !isCurrentCardEditable
                                                              }
                                                            />
                                                          </Form.Item>

                                                          {/* Modifier price */}
                                                          <Form.Item className="!m-0">
                                                            <InputNumber
                                                              className="!w-full"
                                                              min={0}
                                                              suffix={
                                                                <div className="dark:!text-gray-200">
                                                                  MMK
                                                                </div>
                                                              }
                                                              disabled
                                                              value={modify.unitPrice?.toLocaleString()}
                                                            />
                                                          </Form.Item>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              </Checkbox.Group>
                                            </Form.Item>
                                          </div>
                                        )}
                                    </div>
                                  ),
                                },
                              ]}
                            />
                          </>
                        );
                      })}

                      {
                        isEdit &&
                        <Button
                          className="custom-blue-btn"
                          onClick={() => {
                            const newIndex = fields.length;
                            add({
                              menu: undefined,
                              quantity: 0,
                              pricePerQty: 0,
                              modifier: [],
                              modifierQuantities: {},
                            });
                            setAddedMenuIndex(newIndex);

                            setClickAddMenu(true);
                            setIsClickedEditUuid(null);
                            setIsDeleteUuid(null)
                          }}
                          disabled={
                            !itemsValue?.every(item => item?.menu) ||
                            addedMenuIndex !== null ||
                            isClickedEditUuid ||
                            !!isDeleteUuid
                          }
                        >
                          Add Menu
                        </Button>
                      }

                      {
                        isAdd &&
                        <Button
                          className="custom-blue-btn"
                          onClick={() => {
                            const newIndex = fields.length;

                            add({
                              menu: undefined,
                              quantity: 0,
                              pricePerQty: 0,
                              modifier: [],
                              modifierQuantities: {},
                            });
                            setAddedMenuIndex(newIndex);

                            setClickAddMenu(true)

                          }}
                          disabled={!itemsValue?.every(item => item?.menu)}
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

        {
          isView &&
          <SectionCard title="Summary">
            <div>
              <div className="grid grid-cols-3 gap-3 my-2">
                <div>
                  <div className="flex gap-x-2">
                    <span>Date:</span>
                    <span>{fnbOrderDetails?.orderAt ? dayjs(fnbOrderDetails?.orderAt).format("YYYY-MM-DD") : "-"}</span>
                  </div>
                </div>
                <div>
                  <div className="flex gap-x-2">
                    <span>Time:</span>
                    <span>{fnbOrderDetails?.orderAt ? dayjs(fnbOrderDetails?.orderAt).format("hh:mm A") : "-"}</span>
                  </div>
                </div>
                <div>
                  <div className="flex gap-x-2">
                    <span>Check No:</span>
                    <span>{fnbOrderDetails?.refNo ? fnbOrderDetails?.refNo : "-"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="flex gap-x-2">
                    <span>Room:</span>
                    <span>{fnbOrderDetails?.reservationRoom ? fnbOrderDetails?.reservationRoom?.room?.roomNo : "-"}</span>
                  </div>
                </div>
                <div>
                  <div className="flex gap-x-2">
                    <span className="text-[13px]">Consumption Type:</span>
                    <span>{fnbOrderDetails?.consumptionType?.name ? fnbOrderDetails?.consumptionType?.name : "-"}</span>
                  </div>
                </div>
                <div>
                  <div className="flex gap-x-2">
                    <span>Order Type:</span>
                    <span>{fnbOrderDetails?.orderType?.name ? fnbOrderDetails?.orderType?.name : "-"}</span>
                  </div>
                </div>

                {
                  fnbOrderDetails?.orderType?.code === "dine_in" ?
                    <div>
                      <div className="flex gap-x-2 mb-2">
                        <span>Table No:</span>
                        <span>{fnbOrderDetails?.restaurantTable ? fnbOrderDetails?.restaurantTable?.tableNo : "-"}</span>
                      </div>
                    </div>
                    :
                    null
                }
              </div>

              <div className="my-3 border border-gray-200 !p-0 shadow-md">
                <Table
                  columns={columns}
                  dataSource={fnbOrderDetails?.fnbOrderItems}
                  rowKey={(record) => record.uuid}
                  pagination={false}
                  bordered={false}
                  size="small"
                  className="plain-table"
                />

              </div>
            </div>

            {/* {
              fnbOrderDetails?.fnbOrderItems.map(item => (
                <div className="flex justify-between">
                  <div>
                    {item?.menuItem?.name}
                  </div>
                  <div>
                    {item?.quantity}
                  </div>
                  <div>
                    {item?.menuItem?.price}
                  </div>
                </div>
              ))
            } */}

            {/* <Descriptions title="Description" bordered>
              {fnbOrderDetails?.fnbOrderItems?.map((item) => (
                <Descriptions.Item
                  key={item.uuid}
                  label={item?.menuItem?.name}
                >
                  Qty: {item?.quantity} × {item?.menuItem?.price}
                </Descriptions.Item>
              ))}
            </Descriptions> */}

            <div className="flex flex-col gap-3 mt-3">
              <div className="flex justify-between items-center">
                <div>Sub Total</div>
                <div>{(fnbOrderDetails?.subTotal)?.toLocaleString('en-US')} MMK</div>
              </div>
              {/* <div className="border border-gray-200/70 dark:border-gray-500/70"></div> */}

              <div className="flex justify-between items-center">
                <div>Tax</div>
                <div>{(fnbOrderDetails?.taxTotal)?.toLocaleString('en-US')} MMK</div>
              </div>
              {/* <div className="border border-gray-200/70 dark:border-gray-500/70"></div> */}

              <div className="flex justify-between items-center">
                <div>Service Charges</div>
                <div>{(fnbOrderDetails?.serviceChargeTotal)?.toLocaleString('en-US')} MMK</div>
              </div>
              {/* <div className="border border-gray-200/70 dark:border-gray-500/70"></div> */}

              <div className="flex justify-between items-center">
                <div>Discount</div>
                <div className="text-red-400">- {(fnbOrderDetails?.discountTotal)?.toLocaleString('en-US')} MMK</div>
              </div>
              {/* <div className="border border-gray-200/70 dark:border-gray-500/70"></div> */}

            </div>

            <div className="my-2 border-t border-dashed border-slate-300 dark:border-gray-600" />

            <div className="flex justify-between items-center rounded-xl px-4 py-3.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
              <span className="font-bold text-slate-800 dark:text-gray-100">
                Grand Total
              </span>
              <div className="flex justify-end gap-1 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                <div>{(fnbOrderDetails?.grandTotal)?.toLocaleString('en-US')}</div>
                <span>MMK</span>
              </div>
            </div>
          </SectionCard>
        }

      </Drawer >

      <Modal
        title="Delete Confirmation"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => {
          if (!deleteTarget.itemUuid) return;

          handleDeleteMenu(deleteTarget.itemUuid);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setDeleteTarget({
            index: null,
            itemUuid: null,
          });
          setIsDeleteUuid(null);
        }}
        confirmLoading={deleteFoodBeverageOrderMenu?.isPending}
        mask={false}
      >
        Are you sure you want to delete this menu?
      </Modal>
    </>
  );
};

export default FoodBeverageOrderForm;

// Original Card
{/* <Card
  key={currentItemUuid}
  title={
    <div className="flex justify-between items-center">
      <div>{`Menu ${name + 1}`}</div>
    </div>
  }
  className="shadow-sm rounded !my-2 border-l-4 border-blue-500 order-info-forms"
  size="small"
  extra={
    <>
      {isAdd && (
        fields?.length > 1 && (
          <div className="flex gap-x-2">
            <Tooltip title="Delete Card">
              <AiOutlineCloseSquare
                onClick={() => {
                  if (fields?.length === 1) return;
                  remove(name);
                  setClickAddMenu(false)
                }}
                className="text-xl cursor-pointer text-red-500"
              />
            </Tooltip>
          </div>
        )
      )}

      {
        isEdit && (
          <div className="flex gap-x-2">

            {/* Newly added menu */}
//             {(menuCardUuid && currentItemUuid === isClickedEditUuid) || (!isClickedEditUuid && !currentItemUuid)
//               ? (
//                 <>
//                   <Tooltip title="Save Menu">
//                     {
//                       upsertFoodBeverageOrderItems.isPending ?
//                         <Spin />
//                         :
//                         <AiOutlineCheckSquare
//                           onClick={() => {
//                             if (
//                               itemsValue?.[name]?.menu &&
//                               !upsertFoodBeverageOrderItems?.isPending
//                             ) {
//                               handleUpdateMenuSubmit(name)
//                             }
//                           }}
//                           className={`text-2xl ${itemsValue?.[name]?.menu
//                             ? "cursor-pointer text-blue-500"
//                             : "cursor-not-allowed text-gray-400"
//                             }`}
//                           disabled={upsertFoodBeverageOrderItems?.isPending}
//                         />
//                     }
//                   </Tooltip>

//                   <Tooltip title="Cancel">
//                     <AiOutlineCloseSquare
//                       onClick={() => {
//                         if (clickAddMenu) {
//                           remove(name);
//                           // setMenuUuid({});
//                           setIsSameUuid([]);
//                           setAddedMenuIndex(null);
//                           setIsClickedEditUuid(null);
//                           setClickAddMenu(false);
//                           setIsDeleteUuid(null);
//                         }
//                         else {
//                           handleCanceltoOriginalValue(name)
//                         }
//                       }}
//                       className="text-2xl cursor-pointer text-red-500"
//                     />
//                   </Tooltip>

//                   {
//                     !clickAddMenu &&

//                     <Tooltip title="Delete Menu">
//                       <DeleteOutlined
//                         onClick={() => {
//                           if (fields.length <= 1) return;

//                           const currentItem = form.getFieldValue(["items", name]);

//                           const itemUuid = fnbOrderDetails?.fnbOrderItems?.find(
//                             item => item?.menuItem?.uuid === currentItem?.menu
//                           )?.uuid;

//                           if (!itemUuid) return;

//                           setDeleteTarget({
//                             index: name,
//                             itemUuid,
//                           });

//                           setIsDeleteUuid(itemUuid);
//                           if (fields?.length > 1 && !clickAddMenu) {
//                             setIsModalOpen(true)
//                           }
//                         }}
//                         className={`!text-xl ${fields.length > 1 && canEdit
//                           ? "!cursor-pointer !text-red-500"
//                           : "!cursor-not-allowed !text-gray-400"
//                           }`}
//                       />
//                     </Tooltip>
//                   }

//                 </>
//               ) : (
//                 /* Existing menu */
//                 <>
//                   <Tooltip title="Edit Menu">
//                     <EditOutlined
//                       onClick={() => {
//                         if (!canEdit) return;

//                         const itemUuid =
//                           fnbOrderDetails?.fnbOrderItems?.[name]?.uuid;

//                         if (!itemUuid) return;

//                         setIsClickedEditUuid(itemUuid);

//                         setIsSameUuid((prev) =>
//                           prev.includes(itemUuid)
//                             ? prev
//                             : [...prev, itemUuid]
//                         );

//                         setClickAddMenu(false);
//                         setIsDeleteUuid(null)


//                       }}
//                       // className="text-2xl !cursor-pointer !text-blue-500"
//                       className={`text-2xl ${canEdit
//                         ? "!cursor-pointer !text-blue-500"
//                         : "!cursor-not-allowed !text-gray-400"
//                         }`}

//                     />
//                   </Tooltip>

//                   <Tooltip title="Delete Menu">
//                     <DeleteOutlined
//                       onClick={() => {
//                         if (fields.length <= 1) return;

//                         const currentItem = form.getFieldValue(["items", name]);

//                         const itemUuid = fnbOrderDetails?.fnbOrderItems?.find(
//                           item => item?.menuItem?.uuid === currentItem?.menu
//                         )?.uuid;

//                         if (!itemUuid) return;

//                         setDeleteTarget({
//                           index: name,
//                           itemUuid,
//                         });

//                         setIsDeleteUuid(itemUuid);
//                         if (fields?.length > 1 && !clickAddMenu) {
//                           setIsModalOpen(true)
//                         }
//                       }}
//                       className={`!text-xl ${fields.length > 1 && canEdit
//                         ? "!cursor-pointer !text-red-500"
//                         : "!cursor-not-allowed !text-gray-400"
//                         }`}
//                     />
//                   </Tooltip>
//                 </>
//               )}

//           </div>
//         )
//       }
//     </>
//   }
// >
//   <div className="grid grid-cols-3 gap-3">
//     <Form.Item
//       label="Menu"
//       name={[name, "menu"]}
//       rules={[
//         {
//           required: true,
//           message: "Please select a menu",
//         },
//       ]}
//     >
//       <Select
//         options={menuOptions}
//         onChange={(value, option) =>
//           handleChangeMenu(value, option, name)
//         }
//         placeholder="Select Menu"
//         disabled={isAdd ? false : !isCurrentCardEditable}
//       />
//     </Form.Item>

//     <Form.Item
//       label="Quantity"
//       name={[name, "quantity"]}
//     >
//       <InputNumber
//         {...sharedProps}
//         min={itemsValue?.[name]?.menu ? 1 : 0}
//         disabled={isAdd ? !itemsValue?.[name]?.menu : !isCurrentCardEditable || !itemsValue?.[name]?.menu}
//       />
//     </Form.Item>

//     <Form.Item
//       label="Price Per Qty"
//       name={[name, "pricePerQty"]}
//     >
//       <InputNumber
//         className="!w-full"
//         min={0}
//         suffix={<div className="dark:!text-gray-200">MMK</div>}
//         disabled={true}
//       />
//     </Form.Item>
//   </div>

//   {showModifier
//     ? (
//       <div>
//         <div className="flex justify-between items-center !mb-1">
//           <Text strong>Add on Menu</Text>

//           <Tag color="default" className="mr-0">
//             Optional
//           </Tag>
//         </div>

//         <Form.Item
//           name={[name, "modifier"]}
//           className="!mb-0 !p-0"
//         >
//           <Checkbox.Group
//             className="w-full"
//             onChange={(checkedValues) => {
//               selectedMenuItem?.modifiers.forEach((modify) => {
//                 const uuid = modify.uuid;

//                 const currentQuantity =
//                   form.getFieldValue([
//                     "items",
//                     name,
//                     "modifierQuantities",
//                     uuid,
//                   ]) ?? 0;

//                 const newQuantity = checkedValues.includes(uuid)
//                   ? currentQuantity > 0
//                     ? currentQuantity
//                     : 1
//                   : 0;

//                 form.setFieldValue(
//                   ["items", name, "modifierQuantities", uuid],
//                   newQuantity
//                 );
//               });
//             }}

//           >
//             <div className="space-y-2">
//               {selectedMenuItem?.modifiers?.map((modify, index) => {
//                 const selectedModifiers = itemsValue?.[name]?.modifier || [];
//                 const isModifierChecked = selectedModifiers.includes(modify.uuid);
//                 const lastestRow = index === selectedMenuItem?.modifiers?.length - 1;
//                 return (
//                   <div
//                     key={modify.uuid}
//                     className={`grid grid-cols-3 gap-3 items-center py-2  !border-gray-50 hover:bg-gray-50 dark:!border-gray-700 dark:hover:bg-gray-900/50 transition-colors ${lastestRow ? "" : "border-b"}`}
//                   >
//                     <div className="flex items-center">
//                       <Checkbox
//                         value={modify.uuid}
//                         disabled={isAdd ? false : !isCurrentCardEditable}
//                         classNames={{
//                           icon:
//                             (isView && itemsValue?.[name]?.modifier?.includes(modify.uuid))
//                               ? "custom-checkbox-icon"
//                               : isEdit && itemsValue?.[name]?.modifier?.includes(modify.uuid)
//                                 ? "custom-checkbox-icon"
//                                 : "",
//                         }}
//                       >
//                         <span className="ml-2 text-sm">
//                           {modify.name}
//                         </span>
//                       </Checkbox>
//                     </div>

//                     <Form.Item
//                       name={[name, "modifierQuantities", modify.uuid]}
//                       className="!m-0"
//                     >
//                       <InputNumber
//                         {...sharedProps}
//                         min={isModifierChecked ? 1 : 0}
//                         disabled={!isModifierChecked ? true : !isCurrentCardEditable}

//                       />
//                     </Form.Item>

//                     <Form.Item className="!m-0">
//                       <InputNumber
//                         className="!w-full"
//                         min={0}
//                         suffix={<div className="dark:!text-gray-200">MMK</div>}
//                         disabled={true}
//                         value={modify.unitPrice.toLocaleString()}
//                       />
//                     </Form.Item>
//                   </div>
//                 )
//               })}
//             </div>
//           </Checkbox.Group>
//         </Form.Item>
//       </div>
//     )
//     :
//     null
//   }
// </Card> 

// Original Modifier
// {
//   showModifier
//     ? (
//       <div>
//         <div className="flex justify-between items-center !mb-1">
//           <Text strong>Add on Menu</Text>

//           <Tag color="default" className="mr-0">
//             Optional
//           </Tag>
//         </div>

//         <Form.Item
//           name={[name, "modifier"]}
//           className="!mb-0 !p-0"
//         >
//           <Checkbox.Group
//             className="w-full"
//             onChange={(checkedValues) => {
//               selectedMenuItem?.modifiers.forEach((modify) => {
//                 const uuid = modify.uuid;

//                 const currentQuantity =
//                   form.getFieldValue([
//                     "items",
//                     name,
//                     "modifierQuantities",
//                     uuid,
//                   ]) ?? 0;

//                 const newQuantity = checkedValues.includes(uuid)
//                   ? currentQuantity > 0
//                     ? currentQuantity
//                     : 1
//                   : 0;

//                 form.setFieldValue(
//                   ["items", name, "modifierQuantities", uuid],
//                   newQuantity
//                 );
//               });
//             }}

//           >
//             <div className="space-y-2">
//               {selectedMenuItem?.modifiers?.map((modify, index) => {
//                 const selectedModifiers = itemsValue?.[name]?.modifier || [];
//                 const isModifierChecked = selectedModifiers.includes(modify.uuid);
//                 const lastestRow = index === selectedMenuItem?.modifiers?.length - 1;
//                 return (
//                   <div
//                     key={modify.uuid}
//                     className={`grid grid-cols-3 gap-3 items-center py-2  !border-gray-50 hover:bg-gray-50 dark:!border-gray-700 dark:hover:bg-gray-900/50 transition-colors ${lastestRow ? "" : "border-b"}`}
//                   >
//                     <div className="flex items-center">
//                       <Checkbox
//                         value={modify.uuid}
//                         disabled={isAdd ? false : !isCurrentCardEditable}
//                         classNames={{
//                           icon:
//                             (isView && itemsValue?.[name]?.modifier?.includes(modify.uuid))
//                               ? "custom-checkbox-icon"
//                               : isEdit && itemsValue?.[name]?.modifier?.includes(modify.uuid)
//                                 ? "custom-checkbox-icon"
//                                 : "",
//                         }}
//                       >
//                         <span className="ml-2 text-sm">
//                           {modify.name}
//                         </span>
//                       </Checkbox>
//                     </div>

//                     <Form.Item
//                       name={[name, "modifierQuantities", modify.uuid]}
//                       className="!m-0"
//                     >
//                       <InputNumber
//                         {...sharedProps}
//                         min={isModifierChecked ? 1 : 0}
//                         disabled={!isModifierChecked ? true : !isCurrentCardEditable}

//                       />
//                     </Form.Item>

//                     <Form.Item className="!m-0">
//                       <InputNumber
//                         className="!w-full"
//                         min={0}
//                         suffix={<div className="dark:!text-gray-200">MMK</div>}
//                         disabled={true}
//                         value={modify.unitPrice.toLocaleString()}
//                       />
//                     </Form.Item>
//                   </div>
//                 )
//               })}
//             </div>
//           </Checkbox.Group>
//         </Form.Item>
//       </div>
//     )
//     :
//     null
// }

{/* Collapse For Only Modifier */ }
// {showModifier
//   ? (
//     <Collapse
//       items={[
//         {
//           key: "modifier",
//           label: (
//             <div className="flex justify-between items-center">
//               <Text strong>Add on Menu</Text>

//               <Tag color="default" className="mr-0">
//                 Optional
//               </Tag>
//             </div>
//           ),

//           children: (
//             <>
//               {
//                 showModifier &&
//                 <div>
//                   <Form.Item
//                     name={[name, "modifier"]}
//                     className="!mb-0 !p-0"
//                   >
//                     <Checkbox.Group
//                       className="w-full"
//                       onChange={(checkedValues) => {
//                         selectedMenuItem?.modifiers.forEach((modify) => {
//                           const uuid = modify.uuid;

//                           const currentQuantity =
//                             form.getFieldValue([
//                               "items",
//                               name,
//                               "modifierQuantities",
//                               uuid,
//                             ]) ?? 0;

//                           const newQuantity = checkedValues.includes(uuid)
//                             ? currentQuantity > 0
//                               ? currentQuantity
//                               : 1
//                             : 0;

//                           form.setFieldValue(
//                             ["items", name, "modifierQuantities", uuid],
//                             newQuantity
//                           );
//                         });
//                       }}

//                     >
//                       <div className="space-y-2">
//                         {selectedMenuItem?.modifiers?.map((modify, index) => {
//                           const selectedModifiers = itemsValue?.[name]?.modifier || [];
//                           const isModifierChecked = selectedModifiers.includes(modify.uuid);
//                           const lastestRow = index === selectedMenuItem?.modifiers?.length - 1;
//                           return (
//                             <div
//                               key={modify.uuid}
//                               className={`grid grid-cols-3 gap-3 items-center py-2  !border-gray-50 hover:bg-gray-50 dark:!border-gray-700 dark:hover:bg-gray-900/50 transition-colors ${lastestRow ? "" : "border-b"}`}
//                             >
//                               <div className="flex items-center">
//                                 <Checkbox
//                                   value={modify.uuid}
//                                   disabled={isAdd ? false : !isCurrentCardEditable}
//                                   classNames={{
//                                     icon:
//                                       (isView && itemsValue?.[name]?.modifier?.includes(modify.uuid))
//                                         ? "custom-checkbox-icon"
//                                         : isEdit && itemsValue?.[name]?.modifier?.includes(modify.uuid)
//                                           ? "custom-checkbox-icon"
//                                           : "",
//                                   }}
//                                 >
//                                   <span className="ml-2 text-sm">
//                                     {modify.name}
//                                   </span>
//                                 </Checkbox>
//                               </div>

//                               <Form.Item
//                                 name={[name, "modifierQuantities", modify.uuid]}
//                                 className="!m-0"
//                               >
//                                 <InputNumber
//                                   {...sharedProps}
//                                   min={isModifierChecked ? 1 : 0}
//                                   disabled={!isModifierChecked ? true : !isCurrentCardEditable}

//                                 />
//                               </Form.Item>

//                               <Form.Item className="!m-0">
//                                 <InputNumber
//                                   className="!w-full"
//                                   min={0}
//                                   suffix={<div className="dark:!text-gray-200">MMK</div>}
//                                   disabled={true}
//                                   value={modify.unitPrice.toLocaleString()}
//                                 />
//                               </Form.Item>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </Checkbox.Group>
//                   </Form.Item>
//                 </div>
//               }
//             </>
//           ),
//         },
//       ]}
//     />
//   )
//   :
//   null
// }