import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select,
  DatePicker,
  InputNumber,
  Row,
  Col,
  Checkbox,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { ratePlanMeta } from "../../../../api/ratePlanApi";
import {
  createSeasonlRate,
  editSeasonlRate,
  seasonlRateDetails,
} from "../../../../api/seasonalRateApi";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../utils";
import Loader from "../../../../component/Loader/Loader";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";
import { queryClient } from "../../../../app/queryClient";
import {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";

const SeasonalRateForm = ({
  mode,
  setMode,
  selectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { RangePicker } = DatePicker;

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.SEASONAL_RATE_EDIT);

  const { data: ratePlanMetaData } = useApiQuery({
    fetchQueryName: "ratePlanMetaData",
    fetchQueryFunction: ratePlanMeta,
  });

  const roomTypes = ratePlanMetaData?.room_types?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const ratePlans = ratePlanMetaData?.rate_plans?.map((rate) => ({
    value: rate.uuid,
    label: rate.name,
  }));

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const mapOptions = (data) =>
    data?.map((item) => ({ value: item.uuid, label: item.name })) || [];
  const rateCategoryOptions = mapOptions(initData?.statuses?.rate_category);

  const createSeasonlRates = useApiMutation({
    mutationFn: createSeasonlRate,
    invalidateKeys: [["SeasonlRate"]],
    shouldInvalidate: page === 1,
  });

  const editSeasonlRates = useApiMutation({
    mutationFn: editSeasonlRate,
    invalidateKeys: [["SeasonlRate"]],
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "SeasonlRate-details",
    fetchQueryFunction: seasonlRateDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: drawerOpen && !isAdd && !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (data && drawerOpen) {
      const weekdays = data.weekdays || {};

      form.setFieldsValue({
        ...data,
        ...weekdays,
        ...Object.keys(weekdays).reduce((acc, day) => {
          acc[`enable_${day}`] = weekdays[day] !== null;
          return acc;
        }, {}),
        dateRange: [
          data.startDate ? dayjs(data.startDate) : null,
          data.endDate ? dayjs(data.endDate) : null,
        ],
        ratePlanUuid: data?.ratePlan?.uuid,
        rateCategory: data?.rateCategory?.uuid,
        roomTypeUuid: data?.roomType?.uuid,
      });
    }
  }, [data, drawerOpen]);

  const days = [
    { key: "mon", label: "Monday" },
    { key: "tue", label: "Tuesday" },
    { key: "wed", label: "Wednesday" },
    { key: "thu", label: "Thursday" },
    { key: "fri", label: "Friday" },
    { key: "sat", label: "Saturday" },
    { key: "sun", label: "Sunday" },
  ];

  const onFinish = (values) => {
    const [start, end] = values.dateRange || [];

    const formattedValues = {
      uuid: values.uuid || "",
      rateCategory: {
        uuid: values?.rateCategory,
      },
      ratePlan: {
        uuid: values?.ratePlanUuid,
      },
      roomType: {
        uuid: values?.roomTypeUuid,
      },
      startDate: start ? getFormattedDate(start, false) : null,
      endDate: end ? getFormattedDate(end, false) : null,
      price: Number(values.price),
      weekdays: {
        mon: values?.mon ? values?.mon : null,
        tue: values?.tue ? values?.tue : null,
        wed: values?.wed ? values?.wed : null,
        thu: values?.thu ? values?.thu : null,
        fri: values?.fri ? values?.fri : null,
        sat: values?.sat ? values?.sat : null,
        sun: values?.sun ? values?.sun : null,
      },
    };

    if (isAdd) {
      const createValues = {
        ...formattedValues,
        rateCategory: { uuid: values.rateCategory },
        ratePlan: { uuid: values.ratePlanUuid },
        roomType: { uuid: values.roomTypeUuid },
      };

      createSeasonlRates.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Type Rate Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...formattedValues,
        rateCategory: { uuid: values.rateCategory },
        ratePlan: { uuid: values.ratePlanUuid },
        roomType: { uuid: values.roomTypeUuid },
        uuid: data?.uuid,
      };

      editSeasonlRates.mutate(editValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          Toast.success("Room Type Rate Updated Successfully!");
        },
      });
    }
  };

  const handleClose = () => {
    setDrawerOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Type Rate Details"
                : mode === "edit"
                  ? "Edit Room Type Rate"
                  : "Create Room Type Rate"}
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
                isPending={
                  createSeasonlRates.isPending || editSeasonlRates.isPending
                }
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
            onValuesChange={(changedValues) => {
              const changedField = Object.keys(changedValues)[0];
              // Check if the changed field is one of our "enable" checkboxes
              if (changedField?.startsWith("enable_")) {
                const isEnabled = changedValues[changedField];
                // If the checkbox is unchecked, set the corresponding input to null
                if (!isEnabled) {
                  const dayKey = changedField.replace("enable_", "");
                  form.setFieldsValue({ [dayKey]: null });
                }
              }
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Room Type"
                  name="roomTypeUuid"
                  rules={[{ required: true }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? roomTypes?.find((item) => item.value === value)?.label
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
                      options={roomTypes}
                      placeholder="Select Room Type Rate"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Rate Plan"
                  name="ratePlanUuid"
                  rules={[{ required: true }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? ratePlans?.find((item) => item.value === value)?.label
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
                      options={ratePlans}
                      placeholder="Select Rate Plan"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Rate Category"
                  name="rateCategory"
                  rules={[{ required: true }]}
                  getValueProps={(value) => ({
                    value: isView
                      ? rateCategoryOptions?.find((item) => item.value == value)
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
                      options={rateCategoryOptions}
                      placeholder="Select Rate Category"
                    />
                  )}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Base Price"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    className="!w-full"
                    min={0}
                    readOnly={isView}
                    placeholder="Price"
                    suffix="MMK"
                    formatter={priceFormatter}
                    parser={priceParser}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24} align="bottom">
              <Col span={12}>
                <Form.Item
                  name="dateRange"
                  label="Date Range"
                  rules={[
                    { required: true, message: "Please select Date Range" },
                  ]}
                >
                  <RangePicker
                    disabledDate={disabledDate}
                    open={isView? !isView : undefined}
                    inputReadOnly={isView}
                    suffixIcon={isView ? null : undefined}
                    allowClear={!isView}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Week Days"className={`mb-4 ${isView? "pointer-events-none": ""}`}>
                  <div className="flex flex-wrap gap-x-3 gap-y-2 p-0.5">
                    {days.map((day) => (
                      <div
                        key={`group-${day.key}`}
                        className="flex flex-col items-center"
                      >
                        <span className="text-[10px] uppercase mb-1">
                          {day.key}
                        </span>

                        <Form.Item
                          name={`enable_${day.key}`}
                          valuePropName="checked"
                          noStyle
                          
                        >
                          <Checkbox
                            className="ant-checkbox-small"
                            style={{ margin: 0 }}
                            inputReadOnly={isView}
                          />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {days.map((day) => {
                const isEnabled = formValues?.[`enable_${day.key}`];

                return (
                  <Col span={8} key={`input-${day.key}`}>
                    <Form.Item
                      name={day.key}
                      label={`${day.label}`}
                      rules={[
                        { required: isEnabled, message: "Price is required" },
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter Price"
                        style={{ width: "100%" }}
                        min={0}
                        readOnly={!isEnabled || isView}
                        suffix="MMK"
                        formatter={priceFormatter}
                        parser={priceParser}
                      />
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default SeasonalRateForm;
