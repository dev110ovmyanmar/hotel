import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  Row,
  Col,
} from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from "./../../../../component/Toast/Toast";
import usePermission from "./../../../../hooks/usePermission";
import {
  upsertMenuModifier,
  menuModifierDetails,
} from "../../../../api/menuModifierApi";
import Loader from "../../../../component/Loader/Loader";
import { sellingPriceValidator } from "../../../../variables/constants";
import PriceInput from "../../../../component/PriceInput/PriceInput";
import { PERMISSIONS } from "../../../../variables/permission";

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

  const canEditMenuModifier = hasPermission(PERMISSIONS.MENU_MODIFIER_EDIT);

  const upsertMenuModifiers = useApiMutation({
    mutationFn: upsertMenuModifier,
    invalidateKeys: [["menu-modifiers"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data: menuModifierDetailData, isFetching } = useApiQuery({
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

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      unitPrice: Number(values.unitPrice),
      unitCost: Number(values.unitCost),
    };

    if (isAdd) {
      upsertMenuModifiers.mutate(formattedValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Menu Modifier Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...formattedValues,
        uuid: menuModifierDetailData?.uuid,
      };

      upsertMenuModifiers.mutate(editValues, {
        onSuccess: () => {
          handleClose();
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
        onClose={handleClose}
        size={550}
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
              canEditMenuModifier && (
                <Button type="primary" onClick={() => setMode("edit")}>
                  Edit
                </Button>
              )
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
        {isFetching ? (
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
              <Input readOnly={isView} placeholder="Enter Menu Modifier Name" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Selling Price"
                  dependencies={["unitCost"]}
                  name="unitPrice"
                  rules={[
                    { required: true, message: "Please enter selling price" },
                    sellingPriceValidator("unitCost", "unitPrice", true),
                  ]}
                  getValueProps={(value) => ({
                    value: value !== null && value !== undefined ? String(value) : "",
                  })}
                >
                  <PriceInput
                    readOnly={isView}
                    min={1}
                    placeholder="Enter Price"
                    suffix="MMK"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                    readOnly={isView}
                    min={1}
                    placeholder="Enter Price"
                    suffix="MMK"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default MenuModifierForm;
