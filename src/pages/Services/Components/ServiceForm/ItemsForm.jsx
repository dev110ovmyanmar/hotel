import { Button, Drawer, Form, Input, InputNumber, Select } from "antd";
import React, { useEffect } from "react";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../../hooks/useApiQuery";
import { getServiceMeta } from "../../../../api/serviceInventoryApi";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import {
  getServiceInventoryMappingDetails,
  upsertServiceInventoryMapping,
} from "../../../../api/serviceInventoryMappingApi";

const ItemsForm = ({
  selectedItem,
  setSelectedItem,
  drawerOpen,
  setDrawerOpen,
  mode,
  setMode,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "item-view";
  const isEdit = mode === "item-edit";
  const isAdd = mode === "item-add";

  const { data: serviceMetaData } = useApiQuery({
    fetchQueryName: "serviceInventory_metaData",
    fetchQueryFunction: getServiceMeta,
  });

  const serviceInventoryOptions = serviceMetaData?.service_inventory_items?.map(
    (item) => ({
      value: item.uuid,
      label: item.name,
    }),
  );

  const unitOptions = serviceMetaData?.units?.map((unit) => ({
    value: unit.uuid,
    label: unit.name,
  }));

  const createItem = useApiMutation({
    mutationFn: upsertServiceInventoryMapping,
    invalidateKeys: [["services"]],
  });

  const editItem = useApiMutation({
    mutationFn: upsertServiceInventoryMapping,
    invalidateKeys: [["services"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "item-details",
    fetchQueryFunction: getServiceInventoryMappingDetails,
    params: { uuid: selectedItem?.uuid },
    options: {
      enabled: !!selectedItem?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        serviceInventoryItem: data.serviceInventoryItem?.uuid,
        unit: data?.unit?.uuid,
      });
      setSelectedItem(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        service: { uuid: selectedItem?.serviceUuid },
        serviceInventoryItem: { uuid: values.serviceInventoryItem },
        unit: { uuid: values.unit },
      };

      createItem.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          // setPage(1);
          Toast.success("Item Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values, // merge new form values
        service: { uuid: selectedItem?.service?.uuid },
        serviceInventoryItem: { uuid: values?.serviceInventoryItem },
        unit: { uuid: values.unit },
        uuid: data?.uuid,
      };

      editItem.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Item Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "item-view"
                ? "Item Details"
                : mode === "item-edit"
                  ? "Edit Item"
                  : "Create Item"}
            </span>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  setMode("item-edit");
                }}
              >
                Edit
              </Button>
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={createItem.isPending || editItem.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Item"
            name="serviceInventoryItem"
            rules={[{ required: true, message: "Item is Required" }]}
            getValueProps={(value) => ({
              value: isView
                ? serviceInventoryOptions.find((item) => item.value === value)
                    ?.label
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
                options={serviceInventoryOptions}
                placeholder="Select Item"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Unit"
            name="unit"
            rules={[{ required: true, message: "Units is Required" }]}
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
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                }}
                options={unitOptions}
                placeholder="Select Unit"
                open={isView ? false : undefined}
              />
            )}
          </Form.Item>

          <Form.Item label="Quantity" name="quantityPerService">
            <InputNumber
              className="w-full!"
              mode="spinner"
              min={1}
              readOnly={isView}
              placeholder="Enter Quantity"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ItemsForm;
