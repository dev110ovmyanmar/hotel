import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  Switch,
  Row,
  Col,
  Card,
  InputNumber,
} from "antd";
import { Checkbox } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../../hooks/useApiQuery";
import { menuDetails, menuMeta, upsertMenu } from "../../../../api/menuApi";
import { queryClient } from "../../../../app/queryClient";

const MenuItemForm = ({
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

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const status = initData?.statuses?.status;

  const statusList = status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const { data: menuMetaData } = useApiQuery({
    fetchQueryName: "menuMetaData",
    fetchQueryFunction: menuMeta,
  });

  const menuCategory = menuMetaData?.menu_categories?.map((menu) => ({
    value: menu.uuid,
    label: menu.name,
  }));

  const createMenuItems = useApiMutation({
    mutationFn: upsertMenu,
    invalidateKeys: [["menuItem"]],
    shouldInvalidate: page === 1,
  });

  const editMenuItems = useApiMutation({
    mutationFn: upsertMenu,
    invalidateKeys: [["menuItem"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "menuItem-details",
    fetchQueryFunction: menuDetails,
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
        status: data?.status?.uuid,
        menuCategoryUuid: data?.menuCategory?.uuid,
        menuModifier: data?.menuModifiers
          ?.filter((m) => m.selected)
          .map((m) => m.id),
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
        status: { uuid: values.status },
        menuCategory: { uuid: values.menuCategoryUuid },
        menuModifier: { ids: values.menuModifier },
      };

      createMenuItems.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Menu Item Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        status: { uuid: values.status },
        menuCategory: { uuid: values.menuCategoryUuid },
        menuModifier: { ids: values.menuModifier },
        uuid: data?.uuid,
      };

      editMenuItems.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("Menu Item Updated Successfully!");
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
            const defaultStatus = statusList?.find((s) => s.label.toLowerCase() === 'active')?.value;
            form.setFieldsValue({ status: defaultStatus });
          }
        }}
        onClose={handleClose}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Menu Item Details"
                : mode === "edit"
                  ? "Edit Menu Item"
                  : "Create Menu Item"}
            </span>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={createMenuItems.isPending || editMenuItems.isPending}
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Menu Category"
            name="menuCategoryUuid"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: isView
                ? menuCategory.find((item) => item.value === value)?.label
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
                options={menuCategory}
                placeholder="Select Menu Item"
              />
            )}
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Selling Price"
                name="price"
                rules={[
                  { required: true, message: "Selling Price is Required" },
                ]}
              >
                <InputNumber
                  readOnly={isView}
                  suffix="MMK"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Purchase Price"
                name="cost"
                rules={[
                  { required: true, message: "Purchase Price is Required" },
                ]}
              >
                <InputNumber
                  readOnly={isView}
                  suffix="MMK"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Is Taxable"
            name="isTaxable"
            valuePropName="checked"
            normalize={(value) => (value ? 1 : 0)}
          >
            <Switch
              checkedChildren="True"
              unCheckedChildren="False"
              disabled={isView}
            />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is Required" }]}
            getValueProps={(value) => ({
              value: isView
                ? statusList.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select options={statusList} open={isView ? false : undefined} />
            )}
          </Form.Item>

          {!isAdd && (
            <Card className="mt-5 shadow-sm border border-gray-100 bg-gray-100!">
              <div className="flex justify-between items-center mb-5">
                <span className="text-base font-semibold">Add On</span>
              </div>

              <Form.Item name="menuModifier">
                <Checkbox.Group
                  value={selectedData?.menuModifiers?.map(
                    (modifier) => modifier.id,
                  )}
                  onChange={(checkedValues) => {
                    console.log(checkedValues, "id");
                  }}
                >
                  <Row gutter={[12, 12]}>
                    {selectedData?.menuModifiers?.map((modifier) => (
                      <Col span={12} key={modifier.id}>
                        <Checkbox value={modifier.id} disabled={isView}>
                          {modifier.name}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Card>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default MenuItemForm;
