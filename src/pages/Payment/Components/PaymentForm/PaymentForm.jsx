import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Space,
  Select,
  Switch,
  Upload,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { loadState } from "./../../../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "./../../../../variables/constants";
import FormButtons from "./../../../../component/FormButtons/FormButtons";
import {
  upsertPayment,
  paymentDetails,
  paymentUpload,
} from "../../../../api/paymentApi";
import { queryClient } from "./../../../../app/queryClient";
import Status from "./../../../../component/Status/Status";
import ImageUploadCard from "../../../../component/ImageUploadCard/ImageUploadCard";

// Add PaymentForm
const PaymentForm = ({
  mode,
  setMode,
  selectedData,
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
  const status = initData?.statuses.status;
  const provider = initData?.statuses.provider;
  const providerType = initData?.statuses.provider_type;
  const cashName = providerType.find((item) => item?.name === "Cash")?.name;

  const upsertPayments = useApiMutation({
    mutationFn: upsertPayment,
    invalidateKeys: [["payments"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "payment-details",
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
      form.resetFields();
    }
  }, [isAdd]);

  const onFinish = (values) => {
    if (isAdd) {
      upsertPayments.mutate(values, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Payment Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid,
      };

      upsertPayments.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Payment Updated Successfully!");
        },
      });
    }
  };

  const selectedType = Form.useWatch(["type", "uuid"], form);

  const selectedTypeName = providerType?.find(
    (item) => item.uuid === selectedType,
  )?.name;

  const uploadMutation = useApiMutation({
    mutationFn: paymentUpload,
    // invalidateKeys: [["payment-details", selectedData?.uuid]],
  });

  return (
    <div className="flex justify-center">
      <Drawer
        size={550}
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
                isPending={upsertPayments?.isPending}
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
          initialValues={{
            isOnline: false,
          }}
        >
          {!isAdd && (
            <div className="left-container mb-5">
              <ImageUploadCard
                type="payment_img"
                property={selectedData}
                uploadMutation={uploadMutation}
                imageUrl={data?.file}
                size="small"
              />
            </div>
          )}

          <Form.Item
            label=" Name"
            name="name"
            rules={[{ required: true, message: " Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Payment Name" />
          </Form.Item>
          <Form.Item
            label="Provider Type"
            name={["type", "uuid"]}
            rules={[{ required: true, message: "Provider Type is Required" }]}
          >
            <Select
              showSearch={{ optionFilterProp: "label" }}
              options={providerType?.map((item) => ({
                label: item?.name,
                value: item?.uuid,
              }))}
              open={isView ? false : undefined}
              placeholder="Select Provider Type"
            ></Select>
          </Form.Item>
          {selectedType && selectedTypeName !== "Cash" && (
            <Form.Item
              label="Provider"
              name={["provider", "uuid"]}
              rules={[{ required: true, message: "Provider is Required" }]}
            >
              <Select
                showSearch={{ optionFilterProp: "label" }}
                options={provider?.map((item) => ({
                  label: item?.name,
                  value: item?.uuid,
                }))}
                open={isView ? false : undefined}
                placeholder="Select Provider Name"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Is Online"
            name="isOnline"
            valuePropName="checked"
            rules={[{ required: true, message: "is Online is Required" }]}
          >
            <Switch
              disabled={isView}
              checkedChildren="True"
              unCheckedChildren="False"
            />
          </Form.Item>
          <Status isView={isView} />
        </Form>
      </Drawer>
    </div>
  );
};

export default PaymentForm;
