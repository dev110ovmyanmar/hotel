import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  Switch,
  Row,
  Col,
  InputNumber,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { createTax, editTax, TaxDetails } from "../../../../api/TaxApi";
import TextArea from "antd/es/input/TextArea";
import Loader from "../../../../component/Loader/Loader";
import Status from "../../../../component/Status/Status";
import {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

const TaxForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();
  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const chargeTypeValue = Form.useWatch("charge_type", form);

  const canEdit = hasPermission(PERMISSIONS.TAX_EDIT);

  const chargeCategory = initData?.statuses?.charge_category?.map(
    (category) => ({
      value: category.uuid,
      label: category.name,
    }),
  );

  const chargeType = initData?.statuses?.charge_type?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const chargeApplyType = initData?.statuses?.charge_apply_type?.map(
    (applyType) => ({
      value: applyType.uuid,
      label: applyType.name,
    }),
  );

  const perUnit = initData?.statuses?.per_unit?.map((unit) => ({
    value: unit.uuid,
    label: unit.name,
  }));

  const statuses = initData?.statuses?.status;

  const createTaxs = useApiMutation({
    mutationFn: createTax,
    invalidateKeys: [["taxListData"]],
    page: page,
  });

  const editTaxs = useApiMutation({
    mutationFn: editTax,
    invalidateKeys: [["taxListData"]],
    page: page,
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "taxData",
    fetchQueryFunction: TaxDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        charge_category: data?.chargeCategory?.uuid,
        charge_type: data?.chargeType?.uuid,
        charge_apply_type: data?.chargeApplyType?.uuid,
        per_unit: data?.perUnit?.uuid,
        // status: data?.status?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        isInclusive: values.isInclusive === true ? 1 : 0,
        chargeCategory: { uuid: values.charge_category },
        chargeType: { uuid: values.charge_type },
        chargeApplyType: { uuid: values.charge_apply_type },
        perUnit: { uuid: values.per_unit },
      };

      createTaxs.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Tax Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        isInclusive: values.isInclusive === true ? 1 : 0,
        chargeCategory: { uuid: values.charge_category },
        chargeType: { uuid: values.charge_type },
        chargeApplyType: { uuid: values.charge_apply_type },
        perUnit: { uuid: values.per_unit },
        uuid: data?.uuid,
      };
      editTaxs.mutate(editValues, {
        onSuccess: () => {
          handleClose();
          setDrawerOpen(false);
          Toast.success("Tax Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            const activeStatus = statuses?.find(
              (s) => s.name.toLowerCase() === "active",
            );
            if (activeStatus) {
              form.setFieldsValue({
                status: {
                  uuid: activeStatus.uuid,
                },
              });
            }
          }
        }}
        onClose={handleClose}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Tax Details"
                : mode === "edit"
                  ? "Edit Tax"
                  : "Create Tax"}
            </span>
            {isView ? (
              canEdit && (
                <Button type="primary" onClick={() => setMode("edit")}>
                  Edit
                </Button>
              )
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={createTaxs.isPending || editTaxs.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Tax Name is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Tax Name" />
            </Form.Item>

            <Form.Item
              label="Charge Category"
              name="charge_category"
              rules={[
                { required: true, message: "Charge Category is Required" },
              ]}
              getValueProps={(value) => ({
                value: isView
                  ? chargeCategory.find((item) => item.value === value)?.label
                  : value,
              })}
            >
              {isView ? (
                <Input readOnly={isView} />
              ) : (
                <Select
                  showSearch={{
                    filterOption: (input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase()),
                  }}
                  options={chargeCategory}
                  placeholder="Select Charge Category"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Per Unit"
              name="per_unit"
              rules={[{ required: true, message: "Per Unit is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? perUnit.find((item) => item.value === value)?.label
                  : value,
              })}
            >
              {isView ? (
                <Input readOnly={isView} />
              ) : (
                <Select
                  showSearch={{
                    filterOption: (input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase()),
                  }}
                  options={perUnit}
                  placeholder="Select Per Unit"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Is Inclusive"
              name="isInclusive"
              valuePropName="checked"
              // normalize={(value) => (value ? 1 : 0)}
              initialValue={0}
              rules={[{ required: true, message: "Is Inclusive is Required" }]}
            >
              <Switch
                checkedChildren="True"
                unCheckedChildren="False"
                disabled={isView}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Charge Type"
                  name="charge_type"
                  rules={[{ required: true }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? chargeType.find((item) => item.value === value)?.label
                      : value,
                  })}
                >
                  {isView ? (
                    <Input readOnly={isView} />
                  ) : (
                    <Select
                      showSearch={{
                        filterOption: (input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase()),
                      }}
                      options={chargeType}
                      placeholder="Select Charge Type"
                      onChange={() => {
                        form.setFieldValue("chargeValue", undefined);
                      }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Charge Value"
                  name="chargeValue"
                  rules={[
                    { required: true, message: "Charge value is required" },
                    {
                      validator: (_, value) => {
                        const selectedType =
                          initData?.statuses?.charge_type?.find(
                            (ct) => ct.uuid === chargeTypeValue,
                          );

                        if (selectedType?.code === "percentage") {
                          const numValue = Number(value);
                          if (
                            isNaN(numValue) ||
                            numValue < 1 ||
                            numValue > 100
                          ) {
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
                      const selected = initData?.statuses?.charge_type?.find(
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Charge Apply Type"
                  name="charge_apply_type"
                  rules={[
                    {
                      required: true,
                      message: "Charge Apply Type is Required",
                    },
                  ]}
                  getValueProps={(value) => ({
                    value: isView
                      ? chargeApplyType.find((item) => item.value === value)
                          ?.label
                      : value,
                  })}
                >
                  {isView ? (
                    <Input readOnly={isView} />
                  ) : (
                    <Select
                      showSearch={{
                        filterOption: (input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase()),
                      }}
                      options={chargeApplyType}
                      placeholder="Select Charge Apply Type"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Status isView={isView} statusValue={statuses} />
              </Col>
            </Row>

            <Form.Item label="Remark" name="remark">
              <TextArea readOnly={isView} placeholder="Enter Remark" />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default TaxForm;
