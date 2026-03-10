import React, { useEffect } from "react";
import { Form, Input, Button, Drawer, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  createPolicyFun,
  editPolicyFun,
  policyDetailsFun,
} from "../../../../api/policyFunctionApi";
import { queryClient } from "../../../../app/queryClient";
import FormButtons from "../../../../component/FormButtons/FormButtons";

const PolicyForm = ({
  mode,
  setMode,
  selectedData,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", {}]);
  const policyType = initData?.statuses?.policy_type;

  const createPolicyFunction = useApiMutation({
    mutationFn: createPolicyFun,
    invalidateKeys: [["policies"]],
  });

  const editPolicyFunction = useApiMutation({
    mutationFn: editPolicyFun,
    invalidateKeys: [["policies"]],
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "policies",
    fetchQueryFunction: policyDetailsFun,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  if (data) {
    console.log(data, "DataDetailsinPolicyForm");
  }

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
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
      createPolicyFunction.mutate(values, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Policy Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid,
      };

      editPolicyFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Policy Updated Successfully!");
        },
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Policy Details"
                : mode === "edit"
                  ? "Edit Policy"
                  : "Add New Policy"}
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
                  createPolicyFunction.isLoading || editPolicyFunction.isLoading
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
          // labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
          // wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
          validateTrigger="onSubmit"
          onFinish={onFinish}
          disabled={isView}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Policy Name is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Link To"
            name="linkTo"
            rules={[{ required: true, message: "Link To is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Type"
            name={["policyType", "uuid"]}
            rules={[{ required: true, message: "Policy Name is Required" }]}
          >
            <Select
              options={policyType.map((item) => ({
                label: item.name,
                value: item.uuid,
              }))}
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>

          <Form.Item
            label="Is Active"
            name="isActive"
            rules={[{ required: true, message: "Is Active  is Required" }]}
          >
            <Select
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default PolicyForm;
