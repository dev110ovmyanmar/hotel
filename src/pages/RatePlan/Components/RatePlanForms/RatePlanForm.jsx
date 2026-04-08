import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Row,
  Col,
  Select,
  Checkbox,
  Switch,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import TextArea from "antd/es/input/TextArea";
import { queryClient } from "../../../../app/queryClient";
import {
  createRatePlan,
  editRatePlan,
  ratePlanDetails,
  ratePlanMeta,
} from "../../../../api/ratePlanApi";
import Loader from "../../../../component/Loader/Loader";

const RatePlanForm = ({
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

  const currencies = initData?.currencies?.map((currency) => ({
    value: currency.uuid,
    label: currency.code,
  }));

  const statuses = initData?.statuses?.status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const pricingType = initData?.statuses?.pricing_type?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const { data: ratePlanMetaData, isPending } = useApiQuery({
    fetchQueryName: "ratePlanMetaData",
    fetchQueryFunction: ratePlanMeta,
  });

  const mealPlans = ratePlanMetaData?.meal_plans?.map((meal) => ({
    value: meal.uuid,
    label: meal.name,
  }));

  const policy = ratePlanMetaData?.policies?.cancellation?.map((policy) => ({
    value: policy.uuid,
    // label: policy.name,
    label: `${policy.name} (${policy?.policyType.name} Policy)`,
  }));

  const channelOptions = ratePlanMetaData?.channel_visibility_options?.map(
    (channel) => ({
      label: channel.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: channel,
    }),
  );

  const createRatePlans = useApiMutation({
    mutationFn: createRatePlan,
    invalidateKeys: [["ratePlan"]],
    shouldInvalidate: page === 1,
  });

  const editRatePlans = useApiMutation({
    mutationFn: editRatePlan,
    invalidateKeys: [["ratePlan"]],
  });

  const { data, isLoading: ratePlanDetailsLoading } = useApiQuery({
    fetchQueryName: "ratePlan",
    fetchQueryFunction: ratePlanDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      const selectedChannels = Object.keys(data.channelVisibility || {}).filter(
        (key) => data.channelVisibility[key],
      );

      form.setFieldsValue({
        ...data,
        mealUuid: data?.mealPlan?.uuid,
        policyUuid: data?.policy?.uuid,
        currency: data?.currency?.uuid,
        pricing_type: data?.pricingType?.uuid,
        status: data?.status?.uuid,
        channels: selectedChannels,
        isPublic: data?.isPublic,
        description: data?.description,
      });
    }
  }, [data]);

  const onFinish = (values) => {
    const channelVisibility = {};
    channelOptions.forEach((channel) => {
      channelVisibility[channel.value] = values.channels?.includes(
        channel.value,
      );
    });

    const createValues = {
      ...values,
      mealPlan: { uuid: values.mealUuid },
      policy: { uuid: values.policyUuid },
      currency: { uuid: values.currency },
      pricingType: { uuid: values.pricing_type },
      status: { uuid: values.status },
      channelVisibility,
    };

    if (isAdd) {
      createRatePlans.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Rate plan Created Successfully!");
        },
      });
    }

    if (isEdit) {
      editRatePlans.mutate(
        {
          ...values,
          mealPlan: { uuid: values.mealUuid },
          policy: { uuid: values.policyUuid },
          currency: { uuid: values.currency },
          pricingType: { uuid: values.pricing_type },
          status: { uuid: values.status },
          channelVisibility,
          uuid: data?.uuid,
        },
        {
          onSuccess: () => {
            setDrawerOpen(false);
            Toast.success("Rate Plan Updated Successfully!");
          },
        },
      );
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Rate Plan Details"
                : mode === "edit"
                  ? "Edit Rate Plan"
                  : "Create Rate Plan"}
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
                isPending={createRatePlans.isPending || editRatePlans.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        {ratePlanDetailsLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            style={{ width: "100%" }}
            onFinish={onFinish}
            // disabled={isView}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter rate plan name" },
                  ]}
                >
                  <Input readOnly={isView} placeholder="Enter Rate Plan Name" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[
                    { required: true, message: "Please enter rate plan code" },
                  ]}
                >
                  <Input readOnly={isView} placeholder="Enter Rate Plan Code" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Meal Plan"
              name="mealUuid"
              rules={[{ required: true, message: "Meal Plan is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? mealPlans.find((item) => item.value === value)?.label
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
                  options={mealPlans}
                  placeholder="Select Meal Plan"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Policy"
              name="policyUuid"
              rules={[{ required: true, message: "Policy is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? policy.find((item) => item.value === value)?.label
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
                  options={policy}
                  placeholder="Select Policy"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Currency"
              name="currency"
              rules={[{ required: true, message: "Currency is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? currencies.find((item) => item.value === value)?.label
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
                  options={currencies}
                  placeholder="Select Currency"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Pricing Type"
              name="pricing_type"
              rules={[{ required: true, message: "Pricing Type is Required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? pricingType.find((item) => item.value === value)?.label
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
                  options={pricingType}
                  placeholder="Select Pricing Type"
                />
              )}
            </Form.Item>

            <Form.Item
              label="Channels"
              name="channels"
              rules={[
                {
                  required: true,
                  message: "Please select at least one channel",
                },
              ]}
              className={isView ? "custom-disabled-checkbox" : ""}
            >
              <Checkbox.Group options={channelOptions} disabled={isView} />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? statuses.find((item) => item.value === value)?.label
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
                  options={statuses}
                  placeholder="Select Status"
                />
              )}
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea readOnly={isView} placeholder="Enter Description" />
            </Form.Item>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default RatePlanForm;
