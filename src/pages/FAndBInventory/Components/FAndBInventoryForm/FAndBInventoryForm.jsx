import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  fnbMeta,
  getFAndBInventoryDetails,
  upsertFAndBInventory,
} from "../../../../api/fnbInventoryApi";
import Status from "../../../../component/Status/Status";
import Loader from "../../../../component/Loader/Loader";
import { queryClient } from "../../../../app/queryClient";
import { sellingPriceValidator } from "../../../../variables/constants";
import PriceInput from "../../../../component/PriceInput/PriceInput";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

const FAndBInventoryForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();
  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const canEdit = hasPermission(PERMISSIONS.FOOD_AND_BEVERAGE_INVENTORY_EDIT);

  const statuses = initData?.statuses?.status;
  // ?.filter((item) => item.code !== "blocked")
  // ?.map((status) => ({
  //   value: status.uuid,
  //   label: status.name,
  // }));

  const { data: fnbMetaData } = useApiQuery({
    fetchQueryName: "fnbMetaData",
    fetchQueryFunction: fnbMeta,
  });

  const categoryList = fnbMetaData?.categories?.map((category) => ({
    value: category.uuid,
    label: category.name,
  }));

  const unitList = fnbMetaData?.units?.map((unit) => ({
    value: unit.uuid,
    label: unit.name,
  }));

  const supplierList = fnbMetaData?.suppliers?.map((supplier) => ({
    value: supplier.uuid,
    label: supplier.name,
  }));

  const createFacility = useApiMutation({
    mutationFn: upsertFAndBInventory,
    invalidateKeys: [["fnb-inventories"]],
    shouldInvalidate: page === 1,
  });

  const editFacility = useApiMutation({
    mutationFn: upsertFAndBInventory,
    invalidateKeys: [["fnb-inventories"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "fnb-inventory",
    fetchQueryFunction: getFAndBInventoryDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      console.log(data, "data");
      form.setFieldsValue({
        ...data,
        supplier: data?.supplier?.uuid,
        category: data?.category?.uuid,
        unit: data?.unit?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        unitPrice: Number(values.unitPrice),
        unitCost: Number(values.unitCost),
        category: { uuid: values.category },
        unit: { uuid: values.unit },
        supplier: { uuid: values.supplier },
      };

      createFacility.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("F & B Inventory Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        unitPrice: Number(values.unitPrice),
        unitCost: Number(values.unitCost),
        category: { uuid: values.category },
        unit: { uuid: values.unit },
        supplier: { uuid: values.supplier },
        uuid: data?.uuid,
      };

      editFacility.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("F & B Inventory Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            const activeStatus = statuses?.find(
              (s) => s.name.toLowerCase() === "active",
            );
            if (activeStatus) {
              form.setFieldsValue({
                status: {
                  uuid: activeStatus.uuid,
                },
              });
            }
          }
        }}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "F & B Inventory Details"
                : mode === "edit"
                  ? "Edit F & B Inventory"
                  : "Create F & B Inventory"}
            </span>
            {isView ? (
              canEdit && (
                <Button type="primary" onClick={() => setMode("edit")}>
                  Edit
                </Button>
              )
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={createFacility.isPending || editFacility.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Name" />
            </Form.Item>

            <Form.Item
              label="Category Name"
              name="category"
              rules={[{ required: true, message: "Category Name is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? categoryList.find((item) => item.value === value)?.label
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
                  options={categoryList}
                  placeholder="Select Category"
                />
              )}
            </Form.Item>
            <div className="grid grid-cols-2 gap-4">
              {" "}
              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: "Unit is Required" }]}
                getValueProps={(value) => ({
                  value: isView
                    ? unitList.find((item) => item.value === value)?.label
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
                    options={unitList}
                    placeholder="Select Unit"
                  />
                )}
              </Form.Item>
              <Form.Item
                label="Stock Quantity"
                name="stockQuantity"
                className="minus-icon"
                rules={[
                  { required: true, message: "Stock Quantity is Required" },
                ]}
              >
                <InputNumber
                  className="w-full!"
                  mode={"spinner"}
                  defaultValue={1}
                  min={1}
                  placeholder="Stock Quantity"
                  readOnly={isView}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Selling Price"
                name="unitPrice"
                dependencies={["unitCost"]}
                rules={[
                  { required: true, message: "Selling Price is Required" },
                  sellingPriceValidator("unitCost"),
                ]}
                getValueProps={(value) => ({
                  value: value !== null && value !== undefined ? String(value) : "",
                })}
              >
                <PriceInput
                  min={0}
                  placeholder="Selling Price"
                  readOnly={isView}
                  suffix="MMK"
                />
              </Form.Item>

              <Form.Item
                label="Purchase Price"
                name="unitCost"
                rules={[
                  { required: true, message: "Purchase Price is Required" },
                ]}
                getValueProps={(value) => ({
                  value: value !== null && value !== undefined ? String(value) : "",
                })}
              >
                <PriceInput
                  min={0}
                  placeholder="Purchase Price"
                  readOnly={isView}
                  suffix="MMK"
                />
              </Form.Item>
            </div>

            <Status isView={isView} statusValue={statuses} />
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Supplier"
                name="supplier"
                rules={[{ required: true, message: "Supplier is Required" }]}
                getValueProps={(value) => ({
                  value: isView
                    ? supplierList.find((item) => item.value === value)?.label
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
                    options={supplierList}
                    placeholder="Select Supplier"
                  />
                )}
              </Form.Item>

              {/* <Form.Item
                label="Minimun Stock Reorder"
                name="reorderLevel"
                className="minus-icon"
                rules={[
                  { required: true, message: "Reorder Level is Required" },
                ]}
              >
                <InputNumber
                  className="w-full!"
                  mode={"spinner"}
                  min={1}
                  defaultValue={1}
                  placeholder="Reorder Level"
                  readOnly={isView}
                />
              </Form.Item> */}
            </div>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default FAndBInventoryForm;
