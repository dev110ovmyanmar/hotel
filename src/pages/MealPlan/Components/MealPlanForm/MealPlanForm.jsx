import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Space,
  Select,
  Checkbox,
  Row,
  Col,
  InputNumber,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButtons from "./../../../../component/FormButtons/FormButtons";
import { upsertMealPlan, mealPlanDetails } from "../../../../api/mealPlanApi";
import { queryClient } from "./../../../../app/queryClient";
import Loader from "../../../../component/Loader/Loader";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import Status from "../../../../component/Status/Status";
import PriceTag, {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";

const { TextArea } = Input;

const MeanPlanForm = ({
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

  const includeMeals = Form.useWatch("includes", form);
  const mealChecked = includeMeals?.length > 0;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.MEAL_PLAN_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statuses = initData?.statuses?.status;

  const upsertMealPlans = useApiMutation({
    mutationFn: upsertMealPlan,
    invalidateKeys: [["mealPlans"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "meal-plan-details",
    fetchQueryFunction: mealPlanDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: drawerOpen && !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (isAdd) {
      form.setFieldsValue({
        adultPrice: 0,
        childPrice: 0,
        status: {
          uuid: statuses?.find((item) => item?.code === "active")?.uuid,
        },
        childFreeAgeBelow: 5,
      });
    }
  }, [isAdd]);

  useEffect(() => {
    if ((isEdit || isView) && data) {
      const includes = [];

      if (data.includesBreakfast) includes.push("breakfast");
      if (data.includesLunch) includes.push("lunch");
      if (data.includesDinner) includes.push("dinner");

      form.setFieldsValue({
        ...data,
        includes,
        status: {
          uuid: data?.status?.uuid,
        },
      });
    }
  }, [data, isEdit, isView, form]);

  const onFinish = (values) => {
    console.log(values, "ValuesOnFinsih");
    const payload = {
      ...values,
      includesBreakfast: values?.includes.includes("breakfast") || false,
      includesLunch: values?.includes.includes("lunch") || false,
      includesDinner: values?.includes.includes("dinner") || false,
    };

    if (isAdd) {
      upsertMealPlans.mutate(payload, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Meal Plan Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...payload,
        uuid: selectedData?.uuid,
      };

      upsertMealPlans.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Meal Plan Updated Successfully!");
        },
      });
    }
  };

  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  const options = [
    { label: "Breakfast", value: "breakfast", className: "label-1" },
    { label: "Lunch", value: "lunch", className: "label-2" },
    { label: "Dinner", value: "dinner", className: "label-3" },
  ];

  return (
    <div className="flex justify-center">
      <Drawer
        size={550}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedData(null);
          form.resetFields();
          setMode(null);
        }}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Meal Plan Details"
                : mode === "edit"
                  ? "Edit Meal Plan"
                  : "Add Meal Plan"}
            </span>
            {isView ? (
              canEdit && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMode("edit");
                  }}
                >
                  Edit
                </Button>
              )
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={upsertMealPlans?.isPending}
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
            validateTrigger="onSubmit"
            onFinish={onFinish}
            initialValues={{
              childFreeAgeBelow: 5,
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Meal Plan Name is Required" },
                  ]}
                >
                  <Input readOnly={isView} placeholder="Enter Meal Plan Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[
                    { required: true, message: "Meal Plan Code is Required" },
                  ]}
                >
                  <Input readOnly={isView} placeholder="Enter Meal Plan Code" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Meal Includes" name="includes">
              <Checkbox.Group
                options={options}
                onChange={onChange}
                className={isView ? "pointer-events-none" : ""}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Adult Price"
                  name="adultPrice"
                  rules={[
                    {
                      required: mealChecked,
                      message: "Enter Adult Price",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    readOnly={isView}
                    suffix="MMK"
                    placeholder="Enter Adult Price"
                    formatter={priceFormatter}
                    parser={priceParser}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Child Price"
                  name="childPrice"
                  rules={[
                    {
                      required: mealChecked,
                      message: "Enter Child Price",
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    readOnly={isView}
                    placeholder="Enter Child Price"
                    suffix="MMK"
                    formatter={priceFormatter}
                    parser={priceParser}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Child Free Age Below"
                  name="childFreeAgeBelow"
                  min={5}
                  className="minus-icon"
                >
                  <InputNumber
                    mode="spinner"
                    className="w-full rounded-lg"
                    min={0}
                    max={18}
                    defaultValue={5}
                    readOnly={isView}
                    placeholder="Enter Child Free Age Below"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Status isView={isView} statusValue={statuses} />
            {/* <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? statuses?.find((item) => item.value === value)?.label || value
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
                  options={statuses}
                  placeholder="Select Status"
                />
              )}
            </Form.Item> */}

            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={2}
                readOnly={isView}
                style={{ cursor: isView ? "default" : "text" }}
                placeholder="Enter Description"
              />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default MeanPlanForm;
