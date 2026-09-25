import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select,
  Row,
  Col,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  upsertPartner,
  partnerDetails,
  fetchReferralFormUpload,
} from "../../../../api/partnerApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from "./../../../../app/queryClient";
import Status from "./../../../../component/Status/Status";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { deleteImageUpload } from "../../../../api/deleteImageApi";
import { validatePhoneNumber } from "../../../../utils";
import { emailValidator } from "../../../../variables/constants";
import PriceInput from "../../../../component/PriceInput/PriceInput";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";
import Loader from "../../../../component/Loader/Loader";

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
  const phoneValue = Form.useWatch("phone", form);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.PARTNER_EDIT);

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataStatus = initData?.status;
  const chargeType = initData?.charge_type;

  const chargeTypeValue = Form.useWatch(["chargeType", "uuid"], form);

  const upsertPartners = useApiMutation({
    mutationFn: upsertPartner,
    invalidateKeys: [["referral-agents"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isFetching: referralAgentDetailsFetching, error } = useApiQuery({
    fetchQueryName: "referral-agents-details",
    fetchQueryFunction: partnerDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Referral Agent",
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (drawerOpen && isAdd && initDataStatus) {
      form.resetFields();

      form.setFieldsValue({
        status: {
          uuid: initDataStatus.find(
            item => item.code === "active"
          )?.uuid,
        },
      });
    }
  }, [drawerOpen, isAdd, initDataStatus]);

  useEffect(() => {
    const isViewReferralFormData = isView || isEdit;
    if (isViewReferralFormData && data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [isEdit, isView, data]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      chargeValue: Number(values.chargeValue),
      partnerType: "Referral Agent",
    };
    if (isAdd) {
      upsertPartners.mutate(modifiedValues, {
        onSuccess: () => {
          handleClose();
          setPage(1);
          Toast.success("Referral Agent Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        chargeValue: Number(values.chargeValue),
        partnerType: "Referral Agent",
        uuid: selectedData?.uuid,
      };

      upsertPartners.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("Referral Agent Updated Successfully!");
        },
      });
    }
  };
  ("");
  const fetchReferralFormUploads = useApiMutation({
    mutationFn: fetchReferralFormUpload,
    invalidateKeys: [["referral-agents-details", { uuid: selectedData?.uuid }]],
  });

  const deleteReferralAgentUpload = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [["referral-agents-details", { uuid: selectedData?.uuid }]],
  });

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
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
                isPending={upsertPartners.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {
          !isAdd && referralAgentDetailsFetching
            ?
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Loader />
            </div>
            :
            <Form
              form={form}
              layout="vertical"
              validateTrigger="onSubmit"
              onFinish={onFinish}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true }]}
              >
                <Input readOnly={isView} placeholder="Enter Referral Agent Name" />
              </Form.Item>
              <Form.Item
                label="Code"
                name="code"
              >
                <Input readOnly={isView} placeholder="Enter  Code" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    validator: emailValidator,
                  },
                ]}
              >
                <Input readOnly={isView} placeholder="Enter Email Address" />
              </Form.Item>

              <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                <Input
                  readOnly={isView}
                  placeholder="Enter Phone Number"
                  onKeyPress={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      !(e.key === "+" && value.length === 0)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={20}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Charge Type"
                    name={["chargeType", "uuid"]}
                    rules={[{ required: true, message: "Charge Type is Required" }]}
                    getValueProps={(value) => ({
                      value: isView
                        ? chargeType.find((item) => item.uuid === value)?.name
                        : value,
                    })}
                  >
                    {isView ? (
                      <Input readOnly={isView} />
                    ) : (
                      <Select
                        options={chargeType?.map((item) => ({
                          label: item.name,
                          value: item.uuid,
                        }))}
                        placeholder="Select Charge Type"
                      ></Select>
                    )}
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
                          const selectedType = chargeType?.find(
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
                    getValueProps={(value) => ({
                      value: value !== null && value !== undefined ? String(value) : "",
                    })}
                  >
                    <PriceInput
                      min={1}
                      suffix={(() => {
                        const selected = chargeType?.find(
                          (item) => item.uuid === chargeTypeValue,
                        );
                        return selected?.code === "percentage" ? "%" : "MMK";
                      })()}
                      readOnly={isView}
                      placeholder="Enter Charge Value"
                      maxLength={15}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Address" name="address">
                <TextArea readOnly={isView} placeholder="Enter Address" />
              </Form.Item>

              <Form.Item label="Remark" name="remark">
                <TextArea readOnly={isView} placeholder="Enter Remark" />
              </Form.Item>

              <Status isView={isView} statusValue={initDataStatus} />
            </Form>
        }

      </Drawer>

      <ImageUpload
        isFetching={referralAgentDetailsFetching}
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
