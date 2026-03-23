import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  upsertPartner,
  partnerDetails
} from "../../../../api/partnerApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from './../../../../app/queryClient';
import Status from './../../../../component/Status/Status';

const { TextArea } = Input;

const AgencyForm = ({
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

  const initData = queryClient.getQueryData(["initData", "authenticated"])?.statuses;
  const chargeType = initData?.charge_type;
  const status = initData?.status;

  const upsertPartners = useApiMutation({
    mutationFn: upsertPartner,
    invalidateKeys: [["agencies"]],
    shouldInvalidate: isEdit ? true : page === 1

  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "agency-details",
    fetchQueryFunction: partnerDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Agency"
    },
    options: {
      enabled: !!selectedData?.uuid,
    },

  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data
      });
    }
  }, [data, isEdit]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }
  }, [isAdd]);

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      partnerType: "Agency"
    }
    if (isAdd) {
      upsertPartners.mutate(modifiedValues, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Agency Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        partnerType: "Agency",
        uuid: selectedData?.uuid,
      };

      upsertPartners.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Agency Updated Successfully!");
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
                ? "Agency Details"
                : mode === "edit"
                  ? "Edit Agency"
                  : "Add New Agency"}
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
                isPending={upsertPartners.isPending}
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Amenity Name is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Contact Person Name"
            name="contactPerson"
            rules={[{ required: true, message: "Contact Person's Name is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>


          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>


          <Form.Item
            label="Charge Type"
            name={["chargeType", "uuid"]}
            rules={[{ required: true, message: "Charge Type is Required" }]}
          >
            <Select
              options={
                chargeType?.map(item => (
                  {
                    label: item.name,
                    value: item.uuid
                  }
                ))
              }
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>

          <Form.Item
            label="Charge Value "
            name="chargeValue"
            rules={[{ required: true, message: "Charge Value is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is Required" }]}
          >
            <TextArea readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Remark"
            name="remark"
          >
            <TextArea readOnly={isView} />
          </Form.Item>

          <Status/>
        </Form>
      </Drawer>
    </div>
  );
};

export default AgencyForm;
