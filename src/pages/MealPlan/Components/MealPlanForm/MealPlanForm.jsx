import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Checkbox,
  Row,
  Col,
  InputNumber,
} from "antd";

import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { upsertMealPlan, mealPlanDetails } from "../../../../api/mealPlanApi";
import { queryClient } from "../../../../app/queryClient";
import Loader from "../../../../component/Loader/Loader";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import Status from "../../../../component/Status/Status";

import PriceInput from "../../../../component/PriceInput/PriceInput";

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

  const mealChecked = Array.isArray(includeMeals) && includeMeals.length > 0;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();

  const canEdit = hasPermission(PERMISSIONS.MEAL_PLAN_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statuses = initData?.statuses?.status || [];

  const upsertMealPlans = useApiMutation({
    mutationFn: upsertMealPlan,
    invalidateKeys: [["mealPlans"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "meal-plan-details",
    fetchQueryFunction: mealPlanDetails,
    params: {
      uuid: selectedData?.uuid,
    },
    options: {
      enabled: drawerOpen && !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd) return;
    const activeStatus = statuses.find((item) => item?.code === "active");

    form.setFieldsValue({
      name: undefined,
      code: undefined,
      includes: [],
      adultPrice: 0,
      childPrice: 0,
      childFreeAgeBelow: 5,
      status: {
        uuid: activeStatus?.uuid,
      },
      description: undefined,
    });
  }, [isAdd, form, statuses]);

  useEffect(() => {
    if ((!isEdit && !isView) || !data) return;

    const includes = [];

    if (data?.includesBreakfast) {
      includes.push("breakfast");
    }

    if (data?.includesLunch) {
      includes.push("lunch");
    }

    if (data?.includesDinner) {
      includes.push("dinner");
    }

    form.setFieldsValue({
      ...data,
      includes,
      status: {
        uuid: data?.status?.uuid,
      },
    });
  }, [data, isEdit, isView, form]);

  const onFinish = (values) => {
    console.log("Form Values:", values);

    const includes = Array.isArray(values?.includes) ? values.includes : [];

    const payload = {
      ...values,
      adultPrice: values.adultPrice ? Number(values.adultPrice) : values.adultPrice,
      childPrice: values.childPrice ? Number(values.childPrice) : values.childPrice,
      includesBreakfast: includes.includes("breakfast"),
      includesLunch: includes.includes("lunch"),
      includesDinner: includes.includes("dinner"),
      includes: undefined,
    };

    if (isAdd) {
      upsertMealPlans.mutate(payload, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          setSelectedData(null);
          setMode(null);
          form.resetFields();

          Toast.success("Meal Plan Created Successfully!");
        },
      });

      return;
    }
    if (isEdit) {
      const editValues = {
        ...payload,
        uuid: selectedData?.uuid,
      };

      upsertMealPlans.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          setSelectedData(null);
          setMode(null);
          form.resetFields();

          Toast.success("Meal Plan Updated Successfully!");
        },
      });
    }
  };

  const onChange = (checkedValues) => {
    console.log("Meal Includes:", checkedValues);
  };

  const options = [
    {
      label: "Breakfast",
      value: "breakfast",
      className: "label-1",
    },
    {
      label: "Lunch",
      value: "lunch",
      className: "label-2",
    },
    {
      label: "Dinner",
      value: "dinner",
      className: "label-3",
    },
  ];

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    setMode(null);
    form.resetFields();
  };

  return (
    <div className="flex justify-center">
      <Drawer
        size={550}
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={
          <div className="flex justify-between items-center">
            <span>
              {isView
                ? "Meal Plan Details"
                : isEdit
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
              includes: [],
              childFreeAgeBelow: 5,
              adultPrice: 0,
              childPrice: 0,
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Meal Plan Name is Required",
                    },
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
                    {
                      required: true,
                      message: "Meal Plan Code is Required",
                    },
                  ]}
                >
                  <Input readOnly={isView} placeholder="Enter Meal Plan Code" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Meal Includes" name="includes" initialValue={[]}>
              <Checkbox.Group
                options={options}
                onChange={onChange}
                disabled={isView}
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
                  getValueProps={(value) => ({
                    value: value !== null && value !== undefined ? String(value) : "",
                  })}
                >
                  <PriceInput
                    min={0}
                    readOnly={isView}
                    placeholder="Enter Adult Price"
                    disabled={!mealChecked}
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
                  getValueProps={(value) => ({
                    value: value !== null && value !== undefined ? String(value) : "",
                  })}
                >
                  <PriceInput
                    min={0}
                    readOnly={isView}
                    placeholder="Enter Child Price"
                    disabled={!mealChecked}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Child Free Age Below"
                  name="childFreeAgeBelow"
                  className="minus-icon"
                >
                  <InputNumber
                    mode="spinner"
                    className="w-full rounded-lg"
                    min={0}
                    max={18}
                    readOnly={isView}
                    placeholder="Enter Child Free Age Below"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Status isView={isView} statusValue={statuses} />
            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={2}
                readOnly={isView}
                style={{
                  cursor: isView ? "default" : "text",
                }}
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
