import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer, Switch, Row, Col } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { createTax, editTax, TaxDetails } from "../../../../api/TaxApi";

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

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const chargeTypeValue = Form.useWatch("charge_type", form);

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

  const statuses = initData?.statuses?.status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const createTaxs = useApiMutation({
    mutationFn: createTax,
    invalidateKeys: [["taxData"]],
    page: page,
  });

  const editTaxs = useApiMutation({
    mutationFn: editTax,
    invalidateKeys: [["taxData"]],
    page: page,
  });

  const { data } = useApiQuery({
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
        status: data?.status?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        chargeCategory: { uuid: values.charge_category },
        chargeType: { uuid: values.charge_type },
        chargeApplyType: { uuid: values.charge_apply_type },
        perUnit: { uuid: values.per_unit },
        status: { uuid: values.status },
      };

      createTaxs.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Tax Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        chargeCategory: { uuid: values.charge_category },
        chargeType: { uuid: values.charge_type },
        chargeApplyType: { uuid: values.charge_apply_type },
        perUnit: { uuid: values.per_unit },
        status: { uuid: values.status },
        uuid: data?.uuid,
      };
      editTaxs.mutate(editValues, {
        onSuccess: () => {
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
        onClose={() => setDrawerOpen(false)}
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
                isPending={createTaxs.isPending || editTaxs.isPending}
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
          disabled={isView}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Tax Name is Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Charge Category"
            name="charge_category"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              showSearch
              options={chargeCategory}
              placeholder="Select Status"
            />
          </Form.Item>

          <Form.Item label="Per Unit" name="per_unit">
            <Select showSearch options={perUnit} placeholder="Select perUnit" />
          </Form.Item>

          <Form.Item
            label="Is Inclusive"
            name="isInclusive"
            valuePropName="checked"
            normalize={(value) => (value ? 1 : 0)}
          >
            <Switch checkedChildren="True" unCheckedChildren="False" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Charge Type"
                name="charge_type"
                rules={[
                  { required: true, message: "Please select charge type" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select charge type"
                  options={chargeType}
                  // Add this onChange handler:
                  onChange={() => {
                    form.setFieldValue("chargeValue", undefined);
                    // Use undefined or "" depending on your preference
                  }}
                />
              </Form.Item>
            </Col>

            {/* <Col span={12}>
              <Form.Item
                label="Charge Value"
                name="chargeValue"
                rules={[
                  { required: true, message: "Charge value is required" },
                ]}
              >
                <Input
                  addonAfter={(() => {
                    const selected = initData?.statuses?.charge_type?.find(
                      (ct) => ct.uuid === chargeTypeValue,
                    );
                    return selected?.code === "percentage" ? "%" : "MMK";
                  })()}
                />
              </Form.Item>
            </Col> */}
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
                <Input
                  type="number"
                  min={1}
                  // max={chargeTypeValue === "percentage" ? 100 : undefined}
                  addonAfter={(() => {
                    const selected = initData?.statuses?.charge_type?.find(
                      (ct) => ct.uuid === chargeTypeValue,
                    );
                    return selected?.code === "percentage" ? "%" : "MMK";
                  })()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Charge Apply Type"
                name="charge_apply_type"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  showSearch
                  options={chargeApplyType}
                  placeholder="Select Status"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  showSearch
                  options={statuses}
                  placeholder="Select Status"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Remark" name="remark">
            <Input />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default TaxForm;
