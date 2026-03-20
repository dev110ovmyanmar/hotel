import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select, InputNumber, Switch, Radio, Segmented } from "antd";
import { ShopOutlined, MinusCircleOutlined, StopOutlined } from "@ant-design/icons";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../hooks/useApiQuery";
import { getServiceInventoryDetail, upsertInventory } from "../../../api/serviceInventoryApi";
import { useApiMutation } from "../../../hooks/useApiMutation";

const InventoryForm = ({
  mode,
  loading = false,
  switchToEdit,
  page,
  setPage,
  selectedRow,
  setSelectedRow,
  drawerOpen,
  setDrawerOpen,
  categoryOptions,
  unitOptions,

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

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else if (data) {
      form.setFieldsValue({
        ...data,
        categoryUuid: data?.category?.uuid,
        unitUuid: data?.unit?.uuid,
      });
    }
  }, [data, mode]);

  const createServiceInventory = useApiMutation({
    mutationFn: upsertInventory,
    invalidateKeys: [["service_inventories"]],
    shouldInvalidate: page === 1,
  });

  const editServieInventory = useApiMutation({
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
      createServiceInventory.mutate(editValues, {
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
    ? "Service-Inventory View"
    : isEdit
      ? "Service-Inventory Edit"
      : "Service-Inventory Create";

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
              isPending={loading}
            />
          )}
        </div>
      }
      size={500}
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
              <Input placeholder="e.g. Shampoo" readOnly={isView} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-x-5 gap-y-0">
              <Form.Item
                label={<span className="text-xs">Unit Price</span>}
                name="unitPrice"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  precision={2}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Unit Cost</span>}
                name="unitCost"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  precision={2}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Stock Qty</span>}
                name="stockQuantity"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-xs">Reorder</span>}
                name="reorderLevel"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                />
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
            </div>

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
                        {/* <span className="text-lg opacity-60">🚫</span> */}
                        <span className="text-lg opacity-100 text-red-600"><StopOutlined /></span>
                        {/* <span className="font-bold">Standard</span> */}
                        {/* <span className="text-[10px] uppercase tracking-wider text-gray-400 leading-none">
            No Laundry
          </span> */}
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

export default InventoryForm;