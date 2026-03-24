import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from './../../../../component/Toast/Toast';
import usePermission from './../../../../hooks/usePermission';
import { upsertMenuModifier, menuModifierDetails } from "../../../../api/menuModifierApi";

const MenuModifierForm = ({
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

  const upsertMenuModifiers = useApiMutation({
    mutationFn: upsertMenuModifier,
    invalidateKeys: [["menu-modifiers"]],
    shouldInvalidate: isEdit ? true : page === 1
  });

  const { data: menuModifierDetailData } = useApiQuery({
    fetchQueryName: "menu-modifier-details",
    fetchQueryFunction: menuModifierDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && menuModifierDetailData) {
      form.setFieldsValue({
        ...menuModifierDetailData,
      });
      setSelectedData(menuModifierDetailData);
    }
  }, [menuModifierDetailData]);

  if (menuModifierDetailData) {
    console.log(menuModifierDetailData, "menuModifierDetailData")
  }

  const onFinish = (values) => {
    if (isAdd) {
      upsertMenuModifiers.mutate(values, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Menu Modifier Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values, 
        uuid: menuModifierDetailData?.uuid,
      };

      upsertMenuModifiers.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Menu Modifier Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Menu Modifier Details"
                : mode === "edit"
                  ? "Edit Menu Modifier"
                  : "Create Menu Modifier"}
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
              <FormButton
                onClick={() => form.submit()}
                isPending={upsertMenuModifiers.isPending}
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
            <Input
              readOnly={isView}
            />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is Required" }]}
          >
            <Input
              readOnly={isView}
              suffix="MMK"
            />
          </Form.Item>


        </Form>
      </Drawer>
    </div>
  );
};

export default MenuModifierForm;
