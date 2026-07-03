import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Space, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButtons from "./../../../../component/FormButtons/FormButtons";
import {
  upsertMealPlan,
  mealPlanDetails,
} from "../../../../api/mealPlanApi";
import { queryClient } from "./../../../../app/queryClient";
import Loader from "../../../../component/Loader/Loader";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";

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

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.MEAL_PLAN_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statuses = initData?.statuses?.status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const upsertMealPlans = useApiMutation({
    mutationFn: upsertMealPlan,
    invalidateKeys: [["mealPlans"]],
    shouldInvalidate: isEdit ? true : page === 1
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "meal-plan-details",
    fetchQueryFunction: mealPlanDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        status: data?.status?.uuid,
      });
    }
  }, [data]);

  const onFinish = (values) => {
    const payload = {
      ...values,
      status: { uuid: values?.status },
    }

    if (isAdd) {
      upsertMealPlans.mutate(payload, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Meal Plan Created Successfully!");
          // form.resetFields();
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
          // form.resetFields();
        },
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Drawer
        size={550}
        open={drawerOpen}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            const defaultStatus = statuses?.find((s) => s.label.toLowerCase() === 'active')?.value;
            form.setFieldsValue({ status: defaultStatus });
          }
        }}
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
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Meal Plan Name is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Meal Plan Name" />
            </Form.Item>


            {/* <Status isView={isView} /> */}
            <Form.Item
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
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={2}
                readOnly={isView}
                style={{ cursor: isView ? "default" : "text" }}
                placeholder="Enter Description"
              />
            </Form.Item>
          </Form>
        )
        }
      </Drawer >
    </div >
  );
};

export default MeanPlanForm;
