import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Form, Input, Button, Drawer, Row, Col, Select, Space, DatePicker, InputNumber } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from './../../../../component/Toast/Toast';
import usePermission from './../../../../hooks/usePermission';
import { upsertPartnerContract, partnerContractDetails } from "../../../../api/partnerContractApi";
import { queryClient } from '../../../../app/queryClient';
import { getFormattedDate } from "../../../../utils";
import dayjs from "dayjs";
import { capitalizeFirstLetter } from "../../../../utils/Utils";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { fetchAgencyUpload } from "../../../../api/partnerApi";


const AgencyContractForm = ({
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

  const { state } = useLocation();

  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const chargeType = initData?.statuses.charge_type;

  const chargeTypeValue = Form.useWatch(["chargeType", "uuid"], form);

  const propertyName = initData?.property;

  const upsertPartnerContracts = useApiMutation({
    mutationFn: upsertPartnerContract,
    invalidateKeys: [["partner-contracts"]],
    options: {
      partnerType: "Agency",
    },
    shouldInvalidate: isEdit ? true : page === 1

  });

  const { data: partnerContractDetailData } = useApiQuery({
    fetchQueryName: "partner-contract-details",
    fetchQueryFunction: partnerContractDetails,
    params: {
      uuid: selectedData?.uuid,
      partnerType: "Agency",
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && partnerContractDetailData) {
      form.setFieldsValue({
        ...partnerContractDetailData,
        contractStart: dayjs(partnerContractDetailData?.contractStart),
        contractEnd: dayjs(partnerContractDetailData?.contractEnd),
      });
      setSelectedData(partnerContractDetailData);
    }
  }, [partnerContractDetailData]);


  const onFinish = (values) => {
    const createValues = {
      ...values,
      property: {
        uuid: propertyName?.uuid,
      },
      partner: {
        uuid: state?.agencyRecord?.uuid
      },
      partnerType: "Agency",
      contractStart: getFormattedDate(values?.contractStart),
      contractEnd: getFormattedDate(values?.contractEnd),
    };
    if (isAdd) {
      upsertPartnerContracts.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Agency Contract Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        property: {
          uuid: propertyName?.uuid,
        },
        partner: {
          uuid: state?.agencyRecord?.uuid
        },
        partnerType: "Agency",
        contractStart: getFormattedDate(values?.contractStart),
        contractEnd: getFormattedDate(values?.contractEnd),
        uuid: partnerContractDetailData?.uuid,
      };

      upsertPartnerContracts.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Agency Contract Updated Successfully!");
        },
      });
    }
  };

  const partnerUpload = useApiMutation({
    mutationFn: fetchAgencyUpload,
    invalidateKeys: [["partner-contract-details", { uuid: partnerContractDetailData?.uuid }]],
  });

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {capitalizeFirstLetter(state?.agencyRecord?.name)}
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
            agency: {
              name: state?.agencyRecord?.name
            }
          }}
        >
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
                  style={{ width: "100%" }}
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label=" Start Contract Date"
                name="contractStart"
                rules={[{ required: true, message: "Start Contract Date is Required" }]}

              >
                <DatePicker style={{ width: "100%" }} disabled={isView} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="End Contract Date"
                name="contractEnd"
                rules={[{ required: true, message: "End Contract Date is Required" }]}
              >
                <DatePicker style={{ width: "100%" }} disabled={isView} />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Drawer>

      <ImageUpload
        agencyContractuuid={partnerContractDetailData?.uuid}
        agencyFileList={partnerContractDetailData?.agencyContractFiles}
        handleUploadMutation={partnerUpload}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
      />
    </div>
  );
};

export default AgencyContractForm;
