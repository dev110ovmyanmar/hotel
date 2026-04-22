import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select,
  Row,
  Col,
  InputNumber
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  upsertPartner,
  partnerDetails,
  fetchReferralFormUpload
} from "../../../../api/partnerApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from './../../../../app/queryClient';
import Status from './../../../../component/Status/Status';
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { deleteImageUpload } from "../../../../api/deleteImageApi";

const { TextArea } = Input;

const ReferralForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  imageDrawerOpen,
  setImageDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"])?.statuses;
  const chargeType = initData?.charge_type;

  const chargeTypeValue = Form.useWatch(["chargeType", "uuid"], form);

  const upsertPartners = useApiMutation({
    mutationFn: upsertPartner,
    invalidateKeys: [["referral-agents"]],
    shouldInvalidate: isEdit ? true : page === 1

  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "referral-agents-details",
    fetchQueryFunction: partnerDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Referral Agent"
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
      partnerType: "Referral Agent"
    }
    if (isAdd) {
      upsertPartners.mutate(modifiedValues, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Referral Agent Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        partnerType: "Referral Agent",
        uuid: selectedData?.uuid,
      };

      upsertPartners.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Referral Agent Updated Successfully!");
        },
      });
    }
  };
""
  const fetchReferralFormUploads = useApiMutation({
    mutationFn : fetchReferralFormUpload,
    invalidateKeys : [["referral-agents-details",{uuid: selectedData?.uuid}]],
  });

  const deleteReferralAgentUpload = useApiMutation({
      mutationFn: deleteImageUpload,
      invalidateKeys: [["referral-agents-details", { uuid: selectedData?.uuid }]],
    });

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Referral Agent Details"
                : mode === "edit"
                  ? "Edit Referral Agent"
                  : "Add New Referral Agent"}
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
            rules={[{ required: true, message: "Referral Agent Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Referral Agent Name" />
          </Form.Item>

          <Form.Item
            label="Card No"
            name="cardNo"
            rules={[{ required: true, message: "Card No is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Card Number" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input readOnly={isView} placeholder="Enter Email Address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Phone is Required" }]}

          >
            <Input readOnly={isView} placeholder="Enter Phone Number" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Charge Type"
                name={["chargeType", "uuid"]}
                rules={[{ required: true, message: "Charge Type is Required" }]}
                getValueProps={(value) => ({
                  value: isView
                    ? chargeType.find((item) => item.value === value)?.label
                    : value,
                })}
              >
                {
                  isView ?
                    <Input readOnly={isView} /> :
                    <Select
                      options={
                        chargeType?.map(item => (
                          {
                            label: item.name,
                            value: item.uuid
                          }
                        ))
                      }
                      placeholder="Select Charge Type"

                    ></Select>
                }
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Charge Value "
                name="chargeValue"
                rules={[
                  { required: true, message: "Charge Value is Required" },
                  {
                    validator: (_, value) => {
                      const selectedType =
                        chargeType?.find(
                          (item) => item.uuid === chargeTypeValue,
                        );

                      if (selectedType?.code === "percentage") {
                        const numValue = Number(value);
                        if (isNaN(numValue) || numValue < 1 || numValue > 100) {
                          return Promise.reject(
                            new Error("Percentage must be between 1 and 100"),
                          );
                        }
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  className="!w-full"
                  min={1}
                  suffix={(() => {
                    const selected = chargeType?.find(
                      (item) => item.uuid === chargeTypeValue,
                    );
                    return selected?.code === "percentage" ? "%" : "MMK";
                  })()}
                  readOnly={isView}
                  placeholder="Enter Charge Value" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address"
            name="address"
          >
            <TextArea readOnly={isView} placeholder="Enter Address" />
          </Form.Item>

          <Form.Item
            label="Remark"
            name="remark"
          >
            <TextArea readOnly={isView} placeholder="Enter Remark" />
          </Form.Item>

          <Status isView={isView} />
        </Form>
      </Drawer>

      <ImageUpload
        partneruuid={selectedData?.uuid}
        agencyFileList={data?.referralAgentFiles}
        handleUploadMutation={fetchReferralFormUploads}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        title={selectedData?.name}
        fileCategoryName="referral_agent"
        deleteMutation={deleteReferralAgentUpload}

      />
    </div>
  );
};

export default ReferralForm;
