
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Space, Select ,Switch } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { loadState } from './../../../../utils/Utils';
import { LOCAL_STORAGE_KEYS } from './../../../../variables/constants';
import FormButtons from './../../../../component/FormButtons/FormButtons';
import {createPayment , editPayment , paymentDetails} from "../../../../api/paymentApi";
import { queryClient } from './../../../../app/queryClient';


const PaymentForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage
}) => {

  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  // const initData = loadState(LOCAL_STORAGE_KEYS.initData)?.statuses;
  const initData = queryClient.getQueryData(["initData"]);
  const status = initData?.statuses.status;
  const provider = initData?.statuses.provider;
  const providerType = initData?.statuses.provider_type;

  const createPaymentFunction = useApiMutation({
    mutationFn: createPayment,
    invalidateKeys: [["payments"]],
    page: page
  });

  const editPaymentFunction = useApiMutation({
    mutationFn: editPayment,
    invalidateKeys: [["payments"]],
    page:page
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "payments",
    fetchQueryFunction: paymentDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,        
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
      createPaymentFunction.mutate(values, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Payment Created Successfully!");
          form.resetFields()
        }
      })
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid
      };


      editPaymentFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Payment Updated Successfully!");
        }
      })
    }
  };

  return (
    <div className="flex justify-center" >
      <Drawer
        size={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Payment Details"
                : mode === "edit"
                  ? "Edit Payment"
                  : "Add Payment"}
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
                  isAdd ? createPaymentFunction.isPending : editPaymentFunction.isPending
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
          style={{ width: "100%" }}
          onFinish={onFinish}
          initialValues = {{
            isOnline: false
          }}

        >
          <Form.Item label=" Name" name="name" rules={[{ required: true, message: " Name is Required" }]}>
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item label="Provider Type" name={["type","uuid"]} rules={[{ required: true, message: "Provider Type is Required" }]}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options = {
                providerType?.map(item=>(
                  {label:item?.name , value : item?.uuid}
                ))
              }
              open = {isView? false : undefined}
            >

            </Select>
          </Form.Item>

          <Form.Item label="Provider" name={["provider","uuid"]} rules={[{ required: true, message: "Provider is Required" }]}>
            <Select
              showSearch={{ optionFilterProp: 'label' }}
              options = {
                provider?.map(item=>(
                  {label:item?.name , value : item?.uuid}
                ))
              }
              open = {isView? false : undefined}
            >
            </Select>
          </Form.Item>

          <Form.Item label="Is Online" name="isOnline" valuePropName="checked" rules={[{ required: true, message: "is Online is Required" }]}>
            <Switch disabled={isView}/>
          </Form.Item>

          <Form.Item label="Status" name={["status", "uuid"]} rules={[{ required: true, message: "Status  is Required" }]}>
            <Select
              options={
                status?.map((item) => ({
                  label: item.name,
                  value: item.uuid
                }))
              }
              open={isView ? false : undefined}
            >
            </Select>
          </Form.Item>

        </Form>
      </Drawer >
    </div >
  )
};


export default PaymentForm
