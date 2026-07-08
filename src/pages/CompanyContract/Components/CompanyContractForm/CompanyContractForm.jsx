import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Drawer,
  Row,
  Col,
  Select,
  Space,
  DatePicker,
  InputNumber,
} from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from "./../../../../component/Toast/Toast";
import usePermission from "./../../../../hooks/usePermission";
import {
  upsertPartnerContract,
  partnerContractDetails,
} from "../../../../api/partnerContractApi";
import { queryClient } from "../../../../app/queryClient";
import { getFormattedDate } from "../../../../utils";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../../../../utils/Utils";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { fetchCompanyUpload } from "../../../../api/partnerApi";
import { deleteImageUpload } from "../../../../api/deleteImageApi";
import { PERMISSIONS } from "../../../../variables/permission";

const CompanyContractForm = ({
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

  const { RangePicker } = DatePicker;
  const disabledDate = current => {
    return current && current < dayjs().startOf('day');
  };

  const { state } = useLocation();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.PARTNER_EDIT);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const chargeType = initData?.statuses.charge_type;

  const chargeTypeValue = Form.useWatch(["chargeType", "uuid"], form);

  const propertyName = initData?.property;

  const upsertPartnerContracts = useApiMutation({
    mutationFn: upsertPartnerContract,
    invalidateKeys: [["partner-contracts"]],
    options: {
      partnerType: "Company",
    },
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data: partnerContractDetailData } = useApiQuery({
    fetchQueryName: "partner-contract-details",
    fetchQueryFunction: partnerContractDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Company",
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && partnerContractDetailData) {
      form.setFieldsValue({
        ...partnerContractDetailData,
        dateRange: [
          partnerContractDetailData.contractStart ? dayjs(partnerContractDetailData.contractStart) : null,
          partnerContractDetailData.contractEnd ? dayjs(partnerContractDetailData.contractEnd) : null
        ],
      });
      setSelectedData(partnerContractDetailData);
    }
  }, [partnerContractDetailData]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const [startDate, endDate] = values.dateRange || [];
    const createValues = {
      // ...values,
      chargeType: {
        uuid: values?.chargeType?.uuid
      },
      chargeValue: values?.chargeValue,
      property: {
        uuid: propertyName?.uuid,
      },
      partner: {
        uuid: state?.companyRecord?.uuid,
      },
      partnerType: "Company",
      contractStart: startDate ? getFormattedDate(startDate, false) : null,
      contractEnd: endDate ? getFormattedDate(endDate, false) : null,
    };
    if (isAdd) {
      upsertPartnerContracts.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          handleClose();
          setPage(1);
          Toast.success("Company Contract Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        // ...values,
        chargeType: {
          uuid: values?.chargeType?.uuid
        },
        chargeValue: values?.chargeValue,
        property: {
          uuid: propertyName?.uuid,
        },
        partner: {
          uuid: state?.companyRecord?.uuid,
        },
        partnerType: "Company",
        contractStart: startDate ? getFormattedDate(startDate, false) : null,
        contractEnd: endDate ? getFormattedDate(endDate, false) : null,
        uuid: partnerContractDetailData?.uuid,
      };

      upsertPartnerContracts.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("Company Contract Updated Successfully!");
        },
      });
    }
  };

  const companyUpload = useApiMutation({
    mutationFn: fetchCompanyUpload,
    invalidateKeys: [
      ["partner-contract-details", { uuid: partnerContractDetailData?.uuid }],
    ],
  });

  const deleteCompanyContractUpload = useApiMutation({
    mutationFn: deleteImageUpload,
    invalidateKeys: [
      ["partner-contract-details", { uuid: selectedData?.uuid }],
    ],
  });

  const darkModeStyle = `
    dark:border dark:border-gray-600 dark:!bg-gray-900 
    dark:text-gray-100
  `;

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>{capitalizeFirstLetter(state?.companyRecord?.name)}</span>
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
              <FormButton
                onClick={() => form.submit()}
                isPending={upsertPartnerContracts.isPending}
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
            property: {
              name: propertyName?.name,
            },
            company: {
              name: state?.companyRecord?.name,
            },
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <div className={`mb-4 p-5 shadow-sm  border border-gray-200 bg-gray-100! ${darkModeStyle}`}>
                <span className="text-red-500">* </span>
                Selected Charge Type and Value effected on Selected Date Range.
                <span className="text-red-500">* </span>
              </div>
            </Col>

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
                  className="!w-full"
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


          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dateRange"
                label="Date Range"
                rules={[{ required: true, message: "Please select Date Range" }]}
              >
                <RangePicker
                  disabledDate={disabledDate}
                  open={isView? !isView : undefined}
                  inputReadOnly={isView}
                  suffixIcon={isView ? null : undefined}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Contract Date"
                name="contractStart"
                rules={[
                  {
                    required: true,
                    message: "Start Contract Date is Required",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} disabled={isView} />
              </Form.Item>
            </Col> */}

          {/* <Col span={12}>
              <Form.Item
                label="End Contract Date"
                name="contractEnd"
                rules={[
                  { required: true, message: "End Contract Date is Required" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} disabled={isView} />
              </Form.Item>
            </Col> */}
          {/* </Row> */}
        </Form>
      </Drawer>

      <ImageUpload
        companyContractuuid={partnerContractDetailData?.uuid}
        agencyFileList={partnerContractDetailData?.companyContractFiles}
        handleUploadMutation={companyUpload}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        title={`${selectedData?.contractStart} to ${selectedData?.contractEnd}`}
        fileCategoryName="company_contract"
        deleteMutation={deleteCompanyContractUpload}
      />
    </div>
  );
};

export default CompanyContractForm;
