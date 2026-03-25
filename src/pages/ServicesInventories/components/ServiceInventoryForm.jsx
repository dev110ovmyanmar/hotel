import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select, InputNumber, Switch, Radio, Segmented, Divider } from "antd";
import { ShopOutlined, MinusCircleOutlined, StopOutlined } from "@ant-design/icons";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../hooks/useApiQuery";
import { getServiceInventoryDetail, upsertInventory } from "../../../api/serviceInventoryApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getServiceMeta } from "../../../api/serviceInventoryApi";
import Toast from "../../../component/Toast/Toast";
import { MIN_REORDER_LEVEL, MAX_REORDER_LEVEL, MIN_STOCK_QUANTITY, MAX_STOCK_QUANTITY } from "../../../variables/constants";

const ServiceInventoryForm = ({
  mode,
  loading = false,
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

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "serviceInventory_detail",
    fetchQueryFunction: getServiceInventoryDetail,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen,
    }
  });

  const { data: serviceMetaData } = useApiQuery({
    fetchQueryName: "serviceInventory_metaData",
    fetchQueryFunction: getServiceMeta,
  })

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
  }))

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
  }, [data, mode]);

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
      }
    }


    if (isAdd) {
      createServiceInventory.mutate(basePayload, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Inventory Created Successfully!");
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
          Toast.success("Inventory Updated Successfully!");
        },
      });
    }
  }

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Inventory View"
    : isEdit
      ? "Inventory Edit"
      : "Inventory Create";

  const sharedPropsforStock = {
    mode: "spinner",
    min: MIN_STOCK_QUANTITY,
    max: MAX_STOCK_QUANTITY,
    style: { width: "100%" },
  }

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>
            {DrawerTitle}
          </span>

          {isView ? (
            <Button type="primary" onClick={switchToEdit}>
              Edit
            </Button>
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              mode={mode}
              isPending={createServiceInventory.isPending || editServiceInventory.isPending}
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
        {loading ? (
          <Loader />
        ) : (
          <>
            <Form.Item
              label="Item Name"
              name="name"
              rules={[{ required: true, message: "Please input item name!" }]}
            >
              <Input placeholder="Enter Item Name" readOnly={isView} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-x-5 gap-y-0">

              <Form.Item
                label={<span className="text-xs">Purchase Price</span>}
                name="unitCost"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Purchase Price"
                  suffix="MMK"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Selling Price</span>}
                name="unitPrice"
                dependencies={['unitCost']} // This ensures validation triggers when Purchase Price changes
                rules={[
                  { required: true, message: 'Please enter selling price' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const purchasePrice = getFieldValue('unitCost');
                      // Only validate if both values exist
                      if (!value || !purchasePrice || value > purchasePrice) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Selling price must be higher than purchase price'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  classNames="w-full"
                  readOnly={isView}
                  placeholder="Enter Selling Price"
                  suffix="MMK"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Stock Quantity</span>}
                name="stockQuantity"
                rules={[{ required: true }]}
              >
                <InputNumber
                  mode="spinner"
                  min={MIN_STOCK_QUANTITY}
                  max={MAX_STOCK_QUANTITY}
                  className="w-full"
                  placeholder="Enter Stock Quantity"
                  disabled={isView} />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Reorder</span>}
                name="reorderLevel"
                rules={[{ required: true }]}
              >
                <InputNumber
                  placeholder="Enter Reorder Level"
                  disabled={isView}
                  mode="spinner"
                  min={MIN_REORDER_LEVEL}
                  max={MAX_REORDER_LEVEL}
                  style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Category"
                name="categoryUuid"
                rules={[{ required: true }]}
              >
                <Select
                  options={categoryOptions}
                  placeholder="Select Category"
                  disabled={isView}
                  className="!w-full"
                />
              </Form.Item>

              <Form.Item
                label="Unit"
                name="unitUuid"
                rules={[{ required: true }]}
              >
                <Select
                  options={unitOptions}
                  placeholder="Select Unit"
                  disabled={isView}
                  className="!w-full"
                />
              </Form.Item>

              <Form.Item
                label="Supplier"
                name="supplierUuid"
                rules={[{ required: true }]}
              >
                <Select
                  options={supplierOptions}
                  placeholder="Select Supplier"
                  disabled={isView}
                  className="!w-full"
                />
              </Form.Item>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                label="Laundry Requirement"
                name="laundryStatus"
                rules={[{ required: true, message: "Please select a laundry status" }]}
              >
                <Radio.Group className="w-full" disabled={isView}>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Option: No / Standard */}
                    <Radio.Button
                      value={false}
                      className="h-auto py-3 px-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:border-blue-400"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg opacity-100 text-red-600"><StopOutlined /></span>
                      </div>
                    </Radio.Button>

                    {/* Option: Yes / Laundry */}
                    <Radio.Button
                      value={true}
                      className="h-auto py-3 px-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* <span className="text-lg">🧺</span> */}
                        <span className="text-lg opacity-100 text-blue-600"><ShopOutlined /></span>
                        {/* <span className="font-bold text-blue-600">Laundry</span> */}
                        {/* <span className="text-[10px] uppercase tracking-wider text-blue-400 leading-none">
            Service Item
          </span> */}
                      </div>
                    </Radio.Button>
                  </div>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="isFree" label="Is this item free?" rules={[{ required: true, message: "Please select a Item status" }]}>
                <Radio.Group className="w-full" disabled={isView}>
                  <div className="grid grid-cols-2 gap-4">
                    <Radio.Button
                      value={false}
                      className="h-16 flex items-center justify-center rounded-lg border-2"
                    >
                      <div className="text-center">
                        <div className="text-black-600">Paid</div>
                        {/* <div className="text-xs text-gray-400">Standard Billing</div> */}
                      </div>
                    </Radio.Button>

                    <Radio.Button
                      value={true}
                      className="h-16 flex items-center justify-center rounded-lg border-2"
                    >
                      <div className="text-center">
                        <div className="text-green-600">Free</div>
                        {/* <div className="text-xs text-gray-400">Complimentary</div> */}
                      </div>
                    </Radio.Button>
                  </div>
                </Radio.Group>
              </Form.Item>
            </div>

          </>
        )}
      </Form>
    </Drawer>
  );
};

export default ServiceInventoryForm;