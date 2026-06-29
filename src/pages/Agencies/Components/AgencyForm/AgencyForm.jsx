import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select,
  InputNumber,
  Row,
  Col,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  upsertPartner,
  partnerDetails,
  fetchAgencyUpload,
} from "../../../../api/partnerApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from "./../../../../app/queryClient";
import Status from "./../../../../component/Status/Status";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { deleteImageUpload } from "../../../../api/deleteImageApi";
import { validatePhoneNumber } from "../../../../utils";
import { priceFormatter, priceParser } from "../../../../component/PriceTag/PriceTag";

const { TextArea } = Input;

const AgencyForm = ({
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

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataStatus = initData?.status;
  const chargeType = initData?.charge_type;

  const chargeTypeValue = Form.useWatch(["chargeType", "uuid"], form);

  const upsertPartners = useApiMutation({
    mutationFn: upsertPartner,
    invalidateKeys: [["agencies"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "agency-details",
    fetchQueryFunction: partnerDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Agency",
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }

    if (isAdd && initDataStatus) {
      form.setFieldsValue({
        status: {
          uuid: initDataStatus?.find((item) => item?.code === "active")?.uuid,
        },
      });
    }
    const AgencyFormDataView = isView || isEdit;
    if (AgencyFormDataView && data) {
      form.setFieldsValue({
        ...data,
        status: {
          uuid: data?.status?.uuid,
        },
      });
    }
  }, [data, isEdit, isAdd]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      partnerType: "Agency",
    };
    if (isAdd) {
      upsertPartners.mutate(modifiedValues, {
        onSuccess: () => {
          form.resetFields();
          setPage(1);
          setDrawerOpen(false);
          handleClose();
          Toast.success("Agency Created Successfully!");
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
          handleClose();
          Toast.success("Agency Updated Successfully!");
        },
      });
    }
  };

  const agencyUpload = useApiMutation({
    mutationFn: fetchAgencyUpload,
    invalidateKeys: [["agency-details", { uuid: selectedData?.uuid }]],
  });

  const deleteAgencyUpload = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [["agency-details", { uuid: selectedData?.uuid }]],
  });

  if (data) {
    console.log(
      data?.agencyFiles.map((i) => i),
      "DataForAgencyFiles",
    );
  }

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
            rules={[{ required: true, message: "Agency Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Agency Name" />
          </Form.Item>

          <Form.Item
            label="Contact Person Name"
            name="contactPerson"
            rules={[
              { required: true, message: "Contact Person's Name is Required" },
            ]}
          >
            <Input readOnly={isView} placeholder="Enter Contact Person Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Email Address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            validateTrigger="onChange"
            rules={[{ required: true }]}
          >
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
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  suffix={(() => {
                    const selected = chargeType?.find(
                      (item) => item.uuid === chargeTypeValue,
                    );
                    return selected?.code === "percentage" ? "%" : "MMK";
                  })()}
                  readOnly={isView}
                  placeholder="Enter Charge Value"
                  formatter={priceFormatter}
                  parser={priceParser}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Address is Required" }]}
          >
            <TextArea readOnly={isView} placeholder="Enter Address" />
          </Form.Item>

          <Form.Item label="Remark" name="remark">
            <TextArea readOnly={isView} placeholder="Enter Remark" />
          </Form.Item>

          <Status isView={isView} statusValue={initDataStatus} />
        </Form>
      </Drawer>

      <ImageUpload
        partneruuid={selectedData?.uuid}
        agencyFileList={data?.agencyFiles}
        handleUploadMutation={agencyUpload}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        title={selectedData?.name}
        fileCategoryName="agency"
        deleteMutation={deleteAgencyUpload}
      />
    </div>
  );
};

export default AgencyForm;
