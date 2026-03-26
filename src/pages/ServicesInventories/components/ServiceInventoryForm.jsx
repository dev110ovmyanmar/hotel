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
      // form.resetFields();
      // Set default values for NEW items here
      form.setFieldsValue({
        laundryStatus: false, // Default to Standard
        isFree: false,        // Default to Paid
      });
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
              label="Name"
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
                  className="!w-full"
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

            {/* <div className="grid grid-cols-2 gap-3"> */}
            <div className="grid grid-cols-2 gap-3">
              {/* Laundry Status Section as Select */}
              <Form.Item
                label="Laundry Requirement"
                name="laundryStatus"
                rules={[{ required: true, message: "Please select laundry status!" }]}
              >
                <Select
                  disabled={isView}
                  placeholder="Select Status"
                  className="w-full"
                  options={[
                    {
                      value: false,
                      label: (
                        // <span className="flex items-center gap-2">
                        //   <StopOutlined className="!text-red-500" /> Standard / No Laundry
                        // </span>
                        <span className="font-medium">
                          {/* Standard / No Laundry */}
                          N/A
                        </span>
                      )
                    },
                    {
                      value: true,
                      label: (
                        // <span className="flex items-center gap-2">
                        //   <ShopOutlined className="!text-blue-500" /> Laundry Required
                        // </span>
                        <span className="font-medium">
                          Washable
                        </span>
                      )
                    },
                  ]}
                />
              </Form.Item>

              {/* Is Free Section as Select */}
              <Form.Item
                label="Is this item free?"
                name="isFree"
                rules={[{ required: true, message: "Please select billing type!" }]}
              >
                <Select
                  disabled={isView}
                  placeholder="Select Billing Type"
                  className="w-full"
                  options={[
                    // { value: false, label: <span className="text-blue-600 font-medium">Paid Item</span> },
                    // { value: true, label: <span className="text-green-600 font-medium">Free Item</span> },
                    {
                      value: false, label: <span className="font-medium">
                        {/* Paid Item */}
                        Sale
                      </span>
                    },
                    {
                      value: true, label: <span className="font-medium">
                        {/* Free Item */}
                        Gift
                      </span>
                    },
                  ]}
                />
              </Form.Item>
            </div>
            {/* </div> */}

          </>
        )}
      </Form>
    </Drawer >
  );
};

export default ServiceInventoryForm;

