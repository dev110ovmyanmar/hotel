import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Space, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { loadState } from "./../../../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "./../../../../variables/constants";
import FormButtons from "./../../../../component/FormButtons/FormButtons";
import { queryClient } from "./../../../../app/queryClient";
import {
  createMealPlan,
  editMealPlan,
  mealPlanDetails,
} from "../../../../api/mealPlanFunctionApi";
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

  const initData = queryClient.getQueryData(["initData", "authenticated"])?.statuses?.status;

  const createMealPlanFunction = useApiMutation({
    mutationFn: createMealPlan,
    invalidateKeys: [["mealPlans"]],
    shouldInvalidate : page === 1
  });

  const editMealPlanFunction = useApiMutation({
    mutationFn: editMealPlan,
    invalidateKeys: [["mealPlans"]],
    
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "mealPlans",
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
        status: {
          uuid: data?.status.uuid,
        },
      });
    }
  }, [data, isAdd]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }
  }, [isAdd]);

  const onFinish = (values) => {
    if (isAdd) {
      createMealPlanFunction.mutate(values, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Meal Plan Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid,
      };

      editMealPlanFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Meal Plan Updated Successfully!");
        },
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Drawer
        destroyOnClose
        size={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
                isPending={
                  isAdd
                    ? createMealPlanFunction.isPending
                    : editMealPlanFunction.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          validateTrigger="onSubmit"
          onFinish={onFinish}
        >
          <Form.Item
            label="Meal Plan Name"
            name="name"
            rules={[{ required: true, message: "Meal Plan Name is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Status"
            name={["status", "uuid"]}
            rules={[{ required: true, message: "Status  is Required" }]}
          >
            <Select
              options={initData?.map((item) => ({
                label: item.name,
                value: item.uuid,
              }))}
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>
          
          <Form.Item label="Description" name="description">
            <TextArea></TextArea>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default MeanPlanForm;
