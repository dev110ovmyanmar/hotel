import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Drawer,
  Select,
  InputNumber,
  Switch,
  Radio,
  Segmented,
  Divider,
  Checkbox,
} from "antd";
import {
  ShopOutlined,
  MinusCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../hooks/useApiQuery";
import {
  getServiceInventoryDetail,
  upsertInventory,
} from "../../../api/serviceInventoryApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getServiceMeta } from "../../../api/serviceInventoryApi";
import Toast from "../../../component/Toast/Toast";
import {
  MIN_REORDER_LEVEL,
  MAX_REORDER_LEVEL,
  MIN_STOCK_QUANTITY,
  MAX_STOCK_QUANTITY,
  sellingPriceValidator,
} from "../../../variables/constants";
import {
  priceFormatter,
  priceParser,
} from "../../../component/PriceTag/PriceTag";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const ServiceInventoryForm = ({
  mode,
  switchToEdit,
  page,
  setPage,
  selectedRow,
  setSelectedRow,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.SERVICE_INVENTORY_EDIT);

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "serviceInventory_detail",
    fetchQueryFunction: getServiceInventoryDetail,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen,
    },
  });

  const { data: serviceMetaData } = useApiQuery({
    fetchQueryName: "serviceInventory_metaData",
    fetchQueryFunction: getServiceMeta,
  });

  const categoryOptions = serviceMetaData?.categories?.map((category) => ({
    value: category.uuid,
    label: category.name,
  }));

  const unitOptions = serviceMetaData?.units?.map((unit) => ({
    value: unit.uuid,
    label: unit.name,
  }));

  const supplierOptions = serviceMetaData?.suppliers?.map((supplier) => ({
    value: supplier.uuid,
    label: supplier.name,
  }));

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else if (data) {
      form.setFieldsValue({
        ...data,
        categoryUuid: data?.category?.uuid,
        unitUuid: data?.unit?.uuid,
        supplierUuid: data?.supplier?.uuid,
      });
    }
  }, [data, mode, isAdd]);

  const createServiceInventory = useApiMutation({
    mutationFn: upsertInventory,
    invalidateKeys: [["service_inventories"]],
    shouldInvalidate: page === 1,
  });

  const editServiceInventory = useApiMutation({
    mutationFn: upsertInventory,
    invalidateKeys: [["service_inventories"]],
  });

  const handleSubmit = (values) => {
    const basePayload = {
      name: values.name,
      reorderLevel: values.reorderLevel,
      unitPrice: values.unitPrice,
      unitCost: values.unitCost,
      stockQuantity: values.stockQuantity,
      laundryStatus: values.laundryStatus ? 1 : 0,
      isFree: values.isFree ? 1 : 0,
      category: {
        uuid: values.categoryUuid,
      },
      unit: {
        uuid: values.unitUuid,
      },
      supplier: {
        uuid: values.supplierUuid,
      },
    };

    if (isAdd) {
      createServiceInventory.mutate(basePayload, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Service Inventories Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...basePayload,
        uuid: data?.uuid,
      };
      editServiceInventory.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Service Inventories Updated Successfully!");
        },
      });
    }
  };

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Details Inventory "
    : isEdit
      ? "Edit Inventory "
      : "Create Inventory ";

  const sharedPropsforStock = {
    mode: "spinner",
    min: MIN_STOCK_QUANTITY,
    max: MAX_STOCK_QUANTITY,
    style: { width: "100%" },
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>{DrawerTitle}</span>

          {isView ? (
            canEdit && (
              <Button type="primary" onClick={switchToEdit}>
                Edit
              </Button>
            )

          ) : (
            <FormButtons
              onClick={() => form.submit()}
              mode={mode}
              isPending={
                createServiceInventory.isPending ||
                editServiceInventory.isPending
              }
            />
          )}
        </div>
      }
      size={550}
      onClose={onClose}
      open={drawerOpen}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input item name!" }]}
            >
              <Input placeholder="Enter Item Name" readOnly={isView} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-x-5 gap-y-0">
              <Form.Item
                label={<span className="text-xs">Selling Price</span>}
                name="unitPrice"
                dependencies={["unitCost"]}
                rules={[
                  { required: true, message: "Please enter selling price" },
                  sellingPriceValidator("unitCost"),
                ]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Selling Price"
                  suffix="MMK"
                  formatter={priceFormatter}
                  parser={priceParser}
                />
              </Form.Item>

              {
                <Form.Item
                  label="Purchase Price"
                  name="unitCost"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    className="!w-full"
                    min={0}
                    readOnly={isView}
                    placeholder="Enter Purchase Price"
                    suffix="MMK"
                    formatter={priceFormatter}
                    parser={priceParser}
                  />
                </Form.Item>
              }

              <Form.Item
                label={<span className="text-xs">Stock Quantity</span>}
                name="stockQuantity"
                rules={[{ required: true }]}
              >
                <InputNumber
                  mode="spinner"
                  min={MIN_STOCK_QUANTITY}
                  max={MAX_STOCK_QUANTITY}
                  className="!w-full"
                  placeholder="Enter Stock Quantity"
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label="Unit"
                name="unitUuid"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: isView
                    ? unitOptions.find((item) => item.value === value)?.label
                    : value,
                })}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select
                    options={unitOptions}
                    placeholder="Select Unit"
                    disabled={isView}
                    className="!w-full"
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryUuid"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: isView
                    ? categoryOptions.find((item) => item.value === value)
                      ?.label
                    : value,
                })}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select
                    options={categoryOptions}
                    placeholder="Select Category"
                    disabled={isView}
                    className="!w-full"
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Supplier"
                name="supplierUuid"
                getValueProps={(value) => ({
                  value: isView
                    ? supplierOptions.find((item) => item.value === value)
                      ?.label
                    : value,
                })}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select
                    options={supplierOptions}
                    placeholder="Select Supplier"
                    disabled={isView}
                    className="!w-full"
                  />
                )}
              </Form.Item>
            </div>

            <Form.Item
              label={<span className="text-xs">Reorder</span>}
              name="reorderLevel"
            >
              <InputNumber
                placeholder="Enter Reorder Level"
                readOnly={isView}
                mode="spinner"
                min={MIN_REORDER_LEVEL}
                max={MAX_REORDER_LEVEL}
                style={{ width: 240 }}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Laundry Status"
                name="laundryStatus"
                initialValue={false}
                valuePropName="checked"
                rules={[
                  { required: true, message: "Please check laundry status!" },
                ]}
                className={isView? "pointer-events-none" : ""}
              >
                <Checkbox  className="text-xs">Laundry Requirement</Checkbox>
              </Form.Item>

              <Form.Item
                label="Is Free"
                name="isFree"
                initialValue={false}
                valuePropName="checked"
                rules={[
                  { required: true, message: "Please select billing type!" },
                ]}
                className={isView? "pointer-events-none" : ""}
              >
                <Checkbox>
                  This item is free
                </Checkbox>
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </Drawer>
  );
};

export default ServiceInventoryForm;
