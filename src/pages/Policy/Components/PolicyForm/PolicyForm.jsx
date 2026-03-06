
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Space, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { createPolicyFun, editPolicyFun, policyDetailsFun } from "../../../../api/policyFunctionApi";
import { queryClient } from "../../../../app/queryClient";

const PolicyForm = ({
  mode,
  selectedData,
  setSelectedData,
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
    invalidateKeys: [["policies"]]
  });

  const editPolicyFunction = useApiMutation({
    mutationFn: editPolicyFun,
    invalidateKeys: [["policies"]]
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "policies",
    fetchQueryFunction: policyDetailsFun,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  if(data){
    console.log(data,"DataDetailsinPolicyForm");
  };

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data
      });
    }
  }, [data, isAdd]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields()
    }
  }, [isAdd])

  const onFinish = (values) => {
    if (isAdd) {
      createPolicyFunction.mutate(values, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Policy Created Successfully!");
          form.resetFields()
        }
      })
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid
      };

      editPolicyFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Policy Updated Successfully!");
        }
      })
    }
  };

  return (
    <div className="flex justify-center" >
      <Drawer
        destroyOnClose
        size={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closable={false}
        extra={
          < CloseOutlined
            onClick={() => setDrawerOpen(false)}
            style={{ fontSize: 18, cursor: "pointer" }}
          />
        }
        title={
          isAdd ? "Create Policy" :
            isEdit ? "Edit Policy" :
              "Policy Details"
        }
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
          className="w-full px-4 max-w-lg md:max-w-2xl"
          validateTrigger="onSubmit"
          onFinish={onFinish}

        >
          <Form.Item label="Policy Name" name="name" rules={[{ required: true, message: "Policy Name is Required" }]}>
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is Required" }]}>
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item label="Link To" name="linkTo" rules={[{ required: true, message: "Link To is Required" }]}>
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item label="Policy Type" name={["policyType","uuid"]} rules={[{ required: true, message: "Policy Name is Required" }]}>
            {/* <Input readOnly={isView} /> */}
            <Select
              options = {policyType.map(item=>(
                {label:item.name, value : item.uuid}
              ))}
              open={isView ? false : undefined}
            >
            </Select>
          </Form.Item>


          <Form.Item label="Is Active" name="isActive" rules={[{ required: true, message: "Is Active  is Required" }]}>
            <Select
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
              open={isView ? false : undefined}
            >
            </Select>
          </Form.Item>

          {!isView && (
            <div className="flex justify-end sm:mb-2 md:mb-3" >
              <Button
                type="default"
                onClick={() => setDrawerOpen(false)}
                className="me-2"
              >
                Cancel
              </Button>
              {/*  */}
              <Button type="primary" htmlType="submit" loading={isAdd ? createPolicyFunction.isPending : editPolicyFunction.isPending} >
                {isAdd ? "Create" : "Save"}
              </Button>
            </div>
          )}
        </Form>
      </Drawer >
    </div >
  )
};


export default PolicyForm
