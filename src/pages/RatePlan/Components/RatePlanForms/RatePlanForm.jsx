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
  InputNumber,
  Tooltip,
  Divider,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import TextArea from "antd/es/input/TextArea";
import { InfoCircleOutlined } from "@ant-design/icons";
import { queryClient } from "../../../../app/queryClient";
import {
  createRatePlan,
  editRatePlan,
  ratePlanDetails,
  ratePlanMeta,
} from "../../../../api/ratePlanApi";
import Loader from "../../../../component/Loader/Loader";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";

const RatePlanForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
  page,
  ratePlanList,
}) => {
  const [form] = Form.useForm();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.RATE_PLAN_EDIT);

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
    label: `${policy.name} (${policy?.policyType.name} Policy)`,
  }));

  const channelOptions = ratePlanMetaData?.channel_visibility_options?.map(
    (channel) => ({
      label: channel.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: channel,
    }),
  );

  const roomTypes = ratePlanMetaData?.room_types?.map((roomType) => ({
    label: roomType.name,
    value: roomType.uuid,
  }));

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
      const apiRoomTypes = data.roomTypes || [];

      const roomTypePrices = apiRoomTypes.reduce((acc, item) => {
        acc[item.uuid] = item.price;
        return acc;
      }, {});

      form.setFieldsValue({
        ...data,
        ...roomTypePrices,
        mealPlan: data?.mealPlan?.uuid,
        policy: data?.policy?.uuid,
        currency: data?.currency?.uuid,
        pricingType: data?.pricingType?.uuid,
        status: data?.status?.uuid,
        channels: selectedChannels,
        isDefault: data?.isDefault,
        description: data?.description,
      });
    }
  }, [data]);

  const isDisableDefault = ratePlanList?.data?.length <= 0 ? true : false;

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    console.log("Values", values);
    const channelVisibility = {};
    channelOptions.forEach((channel) => {
      channelVisibility[channel.value] = values.channels?.includes(
        channel.value,
      );
    });

    const formattedRoomTypes = roomTypes.map((rt) => ({
      uuid: rt.value,
      price: String(values[rt.value]),
    }));

    const createValues = {
      name: values.name,
      code: values.code,
      mealPlan: { uuid: values.mealPlan },
      policy: { uuid: values.policy },
      currency: { uuid: values.currency },
      pricingType: { uuid: values.pricingType },
      status: { uuid: values.status },
      roomTypes: formattedRoomTypes,
      channelVisibility: channelVisibility,
      isDefault: values.isDefault === true ? 1 : 0,
      description: values.description,
    };

    roomTypes.forEach((rt) => delete createValues[rt.value]);

    if (isAdd) {
      createRatePlans.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          handleClose();
          Toast.success("Rate plan Created Successfully!");
        },
      });
    }

    if (isEdit) {
      editRatePlans.mutate(
        {
          mealPlan: { uuid: values.mealPlan },
          policy: { uuid: values.policy },
          currency: { uuid: values.currency },
          pricingType: { uuid: values.pricingType },
          status: { uuid: values.status },
          // roomTypes: formattedRoomTypes,
          channelVisibility: channelVisibility,
          isDefault: values.isDefault === true ? 1 : 0,
          description: values.description,
          name: values.name,
          code: values.code,
          uuid: data?.uuid,
        },
        {
          onSuccess: () => {
            setDrawerOpen(false);
            handleClose();
            Toast.success("Rate Plan Updated Successfully!");
          },
        },
      );

      roomTypes.forEach((rt) => delete editValues[rt.value]);
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={550}
        afterOpenChange={(open) => {
          if (open && isAdd) {
            form.resetFields();
            form.setFieldValue(
              "status",
              statuses?.find((item) => item.label === "Active")?.value,
            );
            if (!ratePlanList) {
              form.setFieldValue("isDefault", true);
            }
          }
        }}
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Meal Plan"
                  name="mealPlan"
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
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Policy"
                  name="policy"
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
              </Col>

              <Col span={12}>
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
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Pricing Type"
                  name="pricingType"
                  rules={[
                    { required: true, message: "Pricing Type is Required" },
                  ]}
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
              </Col>
            </Row>

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

            <Form.Item
              label="Channels"
              name="channels"
              rules={[
                {
                  required: true,
                  message: "Please select at least one channel",
                },
              ]}
              className={isView ? "pointer-events-none" : ""}
            >
              <Checkbox.Group options={channelOptions}  />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea
                rows={3}
                readOnly={isView}
                placeholder="Enter Description"
              />
            </Form.Item>

            <Form.Item
              label="Is Default"
              name="isDefault"
              valuePropName="checked"
              initialValue={false}
              rules={[{ required: true, message: "Please select Is Default!" }]}
              tooltip={{
                title: "If no date-specific base rate exists, the default room type pricing will be used automatically. The default rate cannot be inactivated, as it acts as the system fallback rate for room pricing.",
                icon: <InfoCircleOutlined style={{ color: "#1677ff" }} />,
              }}
            >
              <Switch
                disabled={isView || isDisableDefault}
                checkedChildren="True"
                unCheckedChildren="False"
              />
            </Form.Item>

            {isAdd && (
              <div className="border-2 px-4  py-4 rounded mb-2">
                {isAdd && (
                  <div className="mb-3">
                    <div className="mb-2">
                      <span className="text-gray-900 text-[16px] font-semibold">
                        Let's map room types to this rate plan
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-900 text-[15px] italic">
                        Map the following rate plans
                      </span>
                    </div>
                  </div>
                )}

                {roomTypes?.map(
                  (roomType) =>
                    isAdd && (
                      <Row
                        key={roomType?.value}
                        align="middle"
                        style={{ marginBottom: 16 }}
                      >
                        <Col span={1}>
                          <span className="text-red-500">*</span>
                        </Col>
                        <Col span={9}>
                          <span style={{ fontWeight: 500 }}>
                            {roomType?.label}
                          </span>
                        </Col>

                        <Col span={1} style={{ textAlign: "center" }}>
                          :
                        </Col>

                        <Col span={13}>
                          <Form.Item
                            name={roomType?.value}
                            noStyle
                            rules={[
                              { required: true, message: "Rate is required!" },
                            ]}
                          >
                            <InputNumber
                              min={0}
                              style={{ width: "100%" }}
                              placeholder="Enter Rate"
                              suffix="MMK"
                              formatter={priceFormatter}
                              parser={priceParser}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ),
                )}
              </div>
            )}
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default RatePlanForm;

