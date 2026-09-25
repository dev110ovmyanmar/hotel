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
  fetchCompanyUpload,
} from "../../../../api/partnerApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from "./../../../../app/queryClient";
import Status from "./../../../../component/Status/Status";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { deleteImageUpload } from "../../../../api/deleteImageApi";
import { validatePhoneNumber } from "../../../../utils";
import PriceInput from "../../../../component/PriceInput/PriceInput";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";
import Loader from "../../../../component/Loader/Loader";

const { TextArea } = Input;

const CompanyForm = ({
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
    invalidateKeys: [["companys"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isFetching: companyDetailsFetching, error } = useApiQuery({
    fetchQueryName: "company-details",
    fetchQueryFunction: partnerDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Company",
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
    const isViewCompanyFormData = isView || isEdit;
    if (isViewCompanyFormData && data) {
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
      chargeValue: values.chargeValue ? Number(values.chargeValue) : values.chargeValue,
      partnerType: "Company",
    };
    if (isAdd) {
      upsertPartners.mutate(modifiedValues, {
        onSuccess: () => {
          handleClose();
          setPage(1);
          Toast.success("Companies or Corporates Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        chargeValue: values.chargeValue ? Number(values.chargeValue) : values.chargeValue,
        partnerType: "Company",
        uuid: selectedData?.uuid,
      };

      upsertPartners.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("Companies or Corporates Updated Successfully!");
        },
      });
    }
  };

  const companyUpload = useApiMutation({
    mutationFn: fetchCompanyUpload,
    invalidateKeys: [["company-details", { uuid: selectedData?.uuid }]],
  });

  const deleteCompanyUpload = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [["company-details", { uuid: selectedData?.uuid }]],
  });

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Companies / Corporates Details"
                : mode === "edit"
                  ? "Edit Companies / Corporates"
                  : "Add New Companies / Corporates"}
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
          !isAdd && companyDetailsFetching
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
              <Row gutter={24}>
                <Col span={16}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true }]}
                  >
                    <Input readOnly={isView} placeholder="Enter Company Name" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Code"
                    name="code"
                  >
                    <Input readOnly={isView} placeholder="Enter Commpany Code" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Contact Person Name"
                name="contactPerson"
                rules={[
                  { required: true, message: "Contact Person Name is Required" },
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
        }
      </Drawer>

      <ImageUpload
        isFetching={companyDetailsFetching}
        partneruuid={selectedData?.uuid}
        agencyFileList={data?.companyFiles}
        handleUploadMutation={companyUpload}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        title={selectedData?.name}
        fileCategoryName="company"
        deleteMutation={deleteCompanyUpload}
      />
    </div>
  );
};

export default CompanyForm;
