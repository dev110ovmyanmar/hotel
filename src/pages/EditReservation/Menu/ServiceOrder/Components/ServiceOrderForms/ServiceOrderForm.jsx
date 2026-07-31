import React, { useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Radio,
  Space,
  Popover,
  List,
} from "antd";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import {
  reservationRoomMeta,
  serviceOrderCreate,
  serviceOrderDetails,
  updateServiceOrder,
} from "../../../../../../api/reservationSectionApi";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { queryClient } from "../../../../../../app/queryClient";
import Toast from "../../../../../../component/Toast/Toast";
import { EyeOutlined } from "@ant-design/icons";
import {
  getFormattedDate,
  textWhiteInDarkStyle,
} from "../../../../../../utils";

const sharedProps = {
  mode: "spinner",
  min: 1,
  max: 10,
  style: { width: 150 },
};

const ServiceOrderForm = ({
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
    fetchQueryName: "service-orders",
    fetchQueryFunction: serviceOrderDetails,
    params: { uuid: serviceOrderUuid },
    options: { enabled: !!serviceOrderUuid && !isAdd },
  });

  const createServiceOrder = useApiMutation({
    mutationFn: serviceOrderCreate,
  });

  const updateServiceOrders = useApiMutation({
    mutationFn: updateServiceOrder,
    invalidateKeys: [["service-order"]],
  });

  const orderType = Form.useWatch("orderType", form);
  const selectedServiceUuid = Form.useWatch("selectService", form);
  const quantities = Form.useWatch("inventoryQuantities", form);
  const orderStatusValue = Form.useWatch("orderStatus", form);

  const consumptionType = initData?.statuses?.consumption_type?.map((item) => ({
    value: item.uuid,
    label: item.name,
  }));

  const currentStatusCode = orderDetails?.orderStatus?.code;
  const orderStatus =
    initData?.statuses?.order_status
      ?.filter((status) => {
        if (isEdit) {
          if (currentStatusCode === "completed") {
            return status.code === "completed";
          }
          if (currentStatusCode === "cancelled") {
            return status.code === "cancelled";
          }
          if (currentStatusCode === "in_progress") {
            return (
              status.code === "in_progress" ||
              status.code === "completed" ||
              status.code === "cancelled"
            );
          }
          return true;
        }

        return status.code === "pending" || status.code === "in_progress";
      })
      ?.map((status) => ({
        value: status.uuid,
        label: status.name,
      })) || [];

  const defaultStatus = initData?.statuses?.order_status?.find(
    (status) => status.code === "pending",
  );

  const rooms =
    reservationRoom?.rooms
      ?.filter((room) => room?.roomStatus?.code === "checked_in")
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
      ?.filter((service) =>
        service?.serviceStages?.some((stage) =>
          ["in_house", "pre_departure", "anytime"].includes(stage),
        ),
      )
      ?.map((service) => ({
        value: service?.uuid,
        label: service?.name,
      })) || [];

  const servicesPackage =
    reservationRoom?.service_packages?.map((pkg) => ({
      value: pkg?.uuid,
      label: pkg?.name,
      packageItems: pkg?.servicePackageItems || [],
      basePrice: pkg?.basePrice,
    })) || [];

  const currentServiceObj = React.useMemo(() => {
    return reservationRoom?.services?.find(
      (service) => service.uuid === selectedServiceUuid,
    );
  }, [reservationRoom, selectedServiceUuid]);

  const serviceInventories = React.useMemo(() => {
    if (!currentServiceObj?.serviceInventories) return [];

    return currentServiceObj.serviceInventories
      .filter((inv) => inv?.serviceInventoryItem?.uuid)
      .map((inv) => ({
        value: inv.serviceInventoryItem.uuid,
        label: inv.serviceInventoryItem.name,
        maxLimit: inv.quantityPerService,
      }));
  }, [currentServiceObj]);

  useEffect(() => {
    if (!isEdit && defaultStatus?.uuid) {
      form.setFieldsValue({
        orderStatus: defaultStatus.uuid,
      });
    }
  }, [defaultStatus, isEdit]);

  useEffect(() => {
    if (orderDetails && (isView || isEdit)) {
      const hasPackage = !!orderDetails?.servicePackage?.uuid;

      form.setFieldsValue({
        orderType: hasPackage ? "package" : "service",
        roomNo: orderDetails?.reservationRoom?.uuid,
        selectService: orderDetails?.service?.uuid,
        servicePackage: orderDetails?.servicePackage?.uuid,
        consumptionType: orderDetails?.consumptionType?.uuid,
        orderStatus: orderDetails?.orderStatus?.uuid,
        inventoryItems:
          orderDetails?.serviceOrderItems?.map((item) => ({
            value: item?.serviceInventoryItem?.uuid,
            label: item?.serviceInventoryItem?.name,
            quantity: item?.quantity,
          })) || [],

        quantity: orderDetails?.serviceOrderItem?.quantity ?? 1,
      });
    }
  }, [orderDetails, isView, isEdit]);

  const handleSubmit = (values) => {
    let calculatedServiceUuid = values.selectService;
    if (values.orderType === "package" && values.servicePackage) {
      const selectedPkg = servicesPackage.find(
        (p) => p.value === values.servicePackage,
      );
      if (selectedPkg) {
        calculatedServiceUuid = selectedPkg.parentServiceUuid;
      }
    }
    const inventoryItems =
      values.inventoryItems?.map((item, index) => ({
        uuid: serviceInventories[index].value,
        quantity: item.quantity,
      })) || [];

    const payload = {
      reservation: { uuid: reservationUuid },
      reservationRoom: values.roomNo ? { uuid: values.roomNo } : null,
      service: calculatedServiceUuid ? { uuid: calculatedServiceUuid } : null,
      servicePackage:
        values.orderType === "package" && values.servicePackage
          ? { uuid: values.servicePackage }
          : null,
      quantity: values.quantity,

      inventoryItems: values.orderType === "service" ? inventoryItems : [],
      consumptionType: values.consumptionType
        ? { uuid: values.consumptionType }
        : null,
      orderStatus: values.orderStatus ? { uuid: values.orderStatus } : null,
    };

    if (isAdd) {
      createServiceOrder.mutate(payload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          if (onSuccess) onSuccess();
          Toast.success("Service Order Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...payload,
        uuid: serviceOrderUuid,
      };

      updateServiceOrders.mutate(editValues, {
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
      size={600}
      open={open}
      onClose={handleClose}
      title={
        <div className="flex justify-between items-center">
          <span>
            {isView
              ? "Service Order Details"
              : isEdit
                ? "Edit Service Order"
                : "Add Service Order"}
          </span>
          {isView ? (
            serviceData?.orderStatus?.code !== "completed" && (
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            )
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              isPending={
                createServiceOrder.isPending || updateServiceOrders.isPending
              }
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
          orderType: "service",
          quantity: 1,
          orderStatus: !isEdit ? defaultStatus?.uuid : undefined,
        }}
      >
        {/* <Form.Item label="Room No" name="roomNo" rules={[{ required: true }]}>
          <Select
            placeholder="Select a Room"
            options={rooms}
            allowClear={isView ? !isView : undefined}
            open={isView ? !isView : undefined}
          />
        </Form.Item> */}
        <Form.Item
          label="Room No"
          name="roomNo"
          rules={[{ required: true }]}
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
              allowClear={isView ? !isView : undefined}
              open={isView ? !isView : undefined}
            />
          )}
        </Form.Item>

        <Form.Item label="Selection Type" name="orderType">
          <Radio.Group
            disabled={isView}
            onChange={(e) => {
              const currentSelection = e.target.value;

              const targetStatus = isEdit
                ? orderDetails?.orderStatus?.uuid
                : defaultStatus?.uuid;

              if (currentSelection === "service") {
                form.setFieldsValue({
                  // Clear package specific field completely
                  servicePackage: undefined,
                  // Explicitly clear the service selection input text
                  selectService: undefined,
                  inventoryItems: undefined,
                  quantity: 1,
                  consumptionType: undefined,
                  orderStatus: targetStatus,
                });
              } else if (currentSelection === "package") {
                form.setFieldsValue({
                  // Clear service specific fields completely
                  selectService: undefined,
                  inventoryItems: undefined,
                  // Explicitly clear the package selection field text
                  servicePackage: undefined,
                  quantity: 1,
                  consumptionType: undefined,
                  orderStatus: targetStatus,
                });
              }
            }}
          >
            {/* <Radio value="service">Service</Radio> */}
            {/* <Radio value="package">Package</Radio> */}
            <Radio value="service">
              <span className={isView ? textWhiteInDarkStyle : ""}>
                Service
              </span>
            </Radio>
            <Radio value="package">
              <span className={isView ? textWhiteInDarkStyle : ""}>
                Package
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>

        {orderType === "service" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {/* <Form.Item
                name="selectService"
                label="Select Service"
                className="w-67"
                rules={[{ required: true }]}
              >
                <Select
                  options={services}
                  placeholder="Select a Service"
                  onChange={(v) =>
                    form.setFieldsValue({
                      selectService: v,
                      inventoryQuantities: {},
                    })
                  }
                  open={isView ? !isView : undefined}
                />
              </Form.Item> */}
              <Form.Item
                label="Select Service"
                name="selectService"
                rules={[{ required: true }]}
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
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                    options={services}
                    placeholder="Select a Service"
                    open={isView ? !isView : undefined}
                    onChange={(v) =>
                      form.setFieldsValue({
                        selectService: v,
                        inventoryQuantities: {},
                      })
                    }
                  />
                )}
              </Form.Item>
              {serviceInventories.length === 0 && (
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{ required: true }, { type: "number" }]}
                  className="minus-icon"
                >
                  <InputNumber
                    {...sharedProps}
                    style={{ width: "100%" }}
                    readOnly={isView}
                  />
                </Form.Item>
              )}
            </div>

            {selectedServiceUuid && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block">
                  {serviceInventories.length > 0
                    ? "Service Inventory Items"
                    : ""}
                </label>

                {serviceInventories.length > 0 && (
                  <div className="mb-5 mt-3 py-3 px-1 border border-gray-200 border-2 rounded-xl overflow-hidden bg-white">
                    {serviceInventories?.map((item, index) => (
                      <div
                        key={item.value}
                        className="flex items-center justify-between py-1 px-3.5 hover:bg-gray-50/70 transition-colors duration-150 dark:hover:bg-gray-900 dark:hover:backdrop-filter-lg"
                      >
                        <Form.Item
                          name={["inventoryItems", index, "value"]}
                          initialValue={item.value}
                          hidden
                        >
                          <input type="hidden" />
                        </Form.Item>
                        <Form.Item
                          name={["inventoryItems", index, "label"]}
                          initialValue={item.label}
                          hidden
                        >
                          <input type="hidden" />
                        </Form.Item>

                        <div className="flex items-center space-x-3 min-w-0 flex-1 pr-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                          <span
                            className={`font-medium text-gray-700 truncate  ${textWhiteInDarkStyle}`}
                            title={item.label}
                          >
                            {item.label}
                          </span>
                          <span className="inline-flex items-center  text-xs font-medium  text-gray-500  flex-shrink-0">
                            ( Max: {item.maxLimit ?? "N/A"} )
                          </span>
                        </div>

                        <div className="flex-shrink-0">
                          <Form.Item
                            name={["inventoryItems", index, "quantity"]}
                            initialValue={0}
                            className="!mb-0 minus-icon"
                            rules={[
                              { required: true, message: "Required" },
                              {
                                type: "number",
                                min: 0,
                              },
                              ...(item.maxLimit
                                ? [
                                    {
                                      type: "number",
                                      max: item.maxLimit,
                                      message: `Max is ${item.maxLimit}`,
                                    },
                                  ]
                                : []),
                            ]}
                          >
                            <InputNumber
                              {...sharedProps}
                              min={0}
                              max={item.maxLimit}
                              placeholder="Qty:"
                              className="w-24 h-8 rounded-lg text-center"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          {orderType === "package" && (
            <>
              {/* <Form.Item
                name="servicePackage"
                label="Select Package"
                rules={[
                  { required: true, message: "Please select a package!" },
                ]}
              >
                <Select
                  placeholder="Select a package"
                  options={servicesPackage}
                  optionRender={(option) => {
                    const pkgData = servicesPackage.find(
                      (p) => p.value === option.value,
                    );
                    const items = pkgData?.packageItems || [];

                    const popoverContent = (
                      <div style={{ minWidth: 250, maxWidth: 280 }}>
                        {items.length === 0 ? (
                          <span style={{ color: "#999" }}>
                            No internal items configured
                          </span>
                        ) : (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                paddingBottom: 4,
                                borderBottom: "1px solid #f0f0f0",
                                fontSize: "12px",
                                color: "#8c8c8c",
                                fontWeight: "500",
                              }}
                            >
                              <span>Item Name</span>
                              <span>Quantity</span>
                            </div>

                            <List
                              size="small"
                              bordered={false}
                              dataSource={items}
                              renderItem={(item) => (
                                <List.Item style={{ padding: "6px 0" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <span>
                                      • {item?.itemType?.name || "Unknown Item"}
                                    </span>
                                    <span
                                      style={{
                                        fontWeight: "500",
                                        paddingRight: 4,
                                      }}
                                    >
                                      {item?.quantity}
                                    </span>
                                  </div>
                                </List.Item>
                              )}
                            />
                          </>
                        )}
                      </div>
                    );

                    return (
                      <Popover
                        placement="right"
                        content={popoverContent}
                        title={<strong>{option.label} Overview</strong>}
                        mouseEnterDelay={0.3}
                        destroyOnClose
                      >
                        <div style={{ width: "100%", padding: "4px 0" }}>
                          {option.label}
                        </div>
                      </Popover>
                    );
                  }}
                />
              </Form.Item> */}

              <Form.Item
                name="servicePackage"
                label="Select Package"
                rules={[
                  { required: true, message: "Please select a package!" },
                ]}
                getValueProps={(value) => ({
                  value: isView
                    ? servicesPackage.find((item) => item.value === value)?.label
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
                    placeholder="Select a package"
                    options={servicesPackage}
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true }, { type: "number" }]}
                className="minus-icon"
              >
                <InputNumber
                  {...sharedProps}
                  style={{ width: "100%" }}
                  // readOnly={isView}
                />
              </Form.Item>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Consumption Type"
            name="consumptionType"
            className="col-span-1"
            rules={[
              { required: true, message: "Please select a Consumption Type" },
            ]}
            getValueProps={(value) => ({
              value: isView
                ? consumptionType.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly />
            ) : (
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={consumptionType}
                placeholder="Select a Consumption Type"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Order Status"
            name="orderStatus"
            className="col-span-1"
            rules={[
              { required: true, message: "Please select an Order Status" },
            ]}
            getValueProps={(value) => {
              if (isView) {
                const label =
                  orderDetails?.orderStatus?.name ||
                  initData?.statuses?.order_status?.find(
                    (item) => item.uuid === value,
                  )?.name;
                return { value: label || value };
              }
              return { value };
            }}
          >
            {isView ? (
              <Input readOnly className="bg-gray-50" />
            ) : (
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={orderStatus}
                placeholder="Select an Order Status"
              />
            )}
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default ServiceOrderForm;