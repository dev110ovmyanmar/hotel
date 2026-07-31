import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
} from "antd";
import React, { useEffect } from "react";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../../hooks/useApiQuery";
import { getServiceMeta } from "../../../../api/serviceInventoryApi";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import {
  getServiceInventoryMappingDetails,
  upsertServiceInventoryMapping,
} from "../../../../api/serviceInventoryMappingApi";
import Toast from "../../../../component/Toast/Toast";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

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

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.SERVICE_INVENTORY_EDIT);

  const { data: serviceMetaData } = useApiQuery({
    fetchQueryName: "serviceInventory_metaData",
    fetchQueryFunction: getServiceMeta,
  });

  // const serviceInventoryOptions = serviceMetaData?.service_inventory_items?.map(
  //   (item) => ({
  //     value: item.uuid,
  //     label: <span>
  //       {item?.name}
  //       {item?.unit?.shortName && ` (${item.unit.shortName})`}
  //     </span>,
  //   }),
  // );

  const serviceInventoryOptions = serviceMetaData?.service_inventory_items?.map(
    (item) => {
      const unitText = item?.unit?.shortName ? ` (${item.unit.shortName})` : "";

      return {
        value: item.uuid,
        label: `${item?.name || ""}${unitText}`,
      };
    },
  );

  const onServiceItemChange = (selectedUuid) => {
    // Find the selected item from your original metadata list
    const selectedItem = serviceMetaData?.service_inventory_items?.find(
      (item) => item.uuid === selectedUuid,
    );

    // Update the 'unit' field in the form with the unit's uuid
    if (selectedItem?.unit?.uuid) {
      form.setFieldsValue({
        unit: selectedItem.unit.uuid,
      });
    }
  };

  // const unitOptions = serviceMetaData?.units?.map((unit) => ({
  //   value: unit.uuid,
  //   label: unit.name,
  // }));

  const createItem = useApiMutation({
    mutationFn: upsertServiceInventoryMapping,
    invalidateKeys: [["services"]],
  });

  const editItem = useApiMutation({
    mutationFn: upsertServiceInventoryMapping,
    invalidateKeys: [["services"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "service-inventory-mapping-details",
    fetchQueryFunction: getServiceInventoryMappingDetails,
    params: { uuid: selectedItem?.uuid },
    options: {
      enabled: !!selectedItem?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data && drawerOpen) {
      form.setFieldsValue({
        ...data,
        serviceInventoryItem: data.serviceInventoryItem?.uuid,
        unit: data?.unit?.uuid,
      });
      setSelectedItem(data);
    }
  }, [data, !isAdd, drawerOpen]);

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
          form.resetFields();
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
        onClose={() => {
          setDrawerOpen(false);
          form.resetFields();
          setSelectedItem(null);
        }}
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
              canEdit && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMode("item-edit");
                  }}
                >
                  Edit
                </Button>
              )
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
          initialValues={{
            quantityPerService: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Item"
                name="serviceInventoryItem"
                rules={[{ required: true, message: "Item is Required" }]}
                getValueProps={(value) => ({
                  value: isView
                    ? serviceInventoryOptions.find(
                        (item) => item.value === value,
                      )?.label
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
                    onChange={onServiceItemChange} // Trigger the unit update
                    placeholder="Select Item"
                  />
                )}
              </Form.Item>
              <Form.Item name="unit" hidden>
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Quantity" name="quantityPerService">
                <InputNumber
                  className="w-full!"
                  mode="spinner"
                  min={1}
                  readOnly={isView}
                  placeholder="Enter Quantity"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default ItemsForm;
