import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  DatePicker,
  InputNumber,
  Row,
  Col,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import {
  extraBedRateDetails,
  ratePlanMeta,
  upsertExtraBedRate,
} from "../../../../api/exteraBedRateApi";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../utils";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";
import {
  priceFormatter,
  priceParser,
} from "../../../../component/PriceTag/PriceTag";

const sharedProps = {
  mode: "spinner",
  min: 1,
  style: { width: 150 },
};

const sharedProp = {
  mode: "spinner",
  min: 2,
  style: { width: 150 },
};

const ExtraBedRateForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();
  const selectedExtraTypeUuid = Form.useWatch("extraType", form);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { RangePicker } = DatePicker;

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.EXTRA_RATE_EDIT);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const extraList = initData?.statuses?.extra_type?.map((extraType) => ({
    value: extraType.uuid,
    label: extraType.name,
  }));

  const selectedExtraTypeObj = extraList?.find(
    (item) => item.value === selectedExtraTypeUuid,
  );
  const isExtraPerson = selectedExtraTypeObj?.label
    ?.toLowerCase()
    .includes("extra person");

  const { data: ratePlanMetaData } = useApiQuery({
    fetchQueryName: "ratePlanMetaData",
    fetchQueryFunction: ratePlanMeta,
  });

  const ratePlan = ratePlanMetaData?.rate_plans?.map((rate) => ({
    value: rate.uuid,
    label: rate.name,
  }));

  const roomType = ratePlanMetaData?.room_types?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const createExtraBedRates = useApiMutation({
    mutationFn: upsertExtraBedRate,
    invalidateKeys: [["extraBedRate"]],
    shouldInvalidate: page === 1,
  });

  const editExtraBedRates = useApiMutation({
    mutationFn: upsertExtraBedRate,
    invalidateKeys: [["extraBedRate"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "extraBedRate-details",
    fetchQueryFunction: extraBedRateDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });
  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        roomTypeUuid: data?.roomType?.uuid,
        ratePlanUuid: data?.ratePlan?.uuid,
        extraType: data?.extraType?.uuid,        
        minAge: data?.minAge ?? null,
        maxAge: data?.maxAge ?? null,
        dateRange: [
          data.startDate ? dayjs(data.startDate) : null,
          data.endDate ? dayjs(data.endDate) : null,
        ],
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
    const [start, end] = values.dateRange || [];

    if (isAdd) {
      const createValues = {
        ...values,
        extraType: { uuid: values.extraType },
        roomType: { uuid: values.roomTypeUuid },
        ratePlan: { uuid: values.ratePlanUuid },       
        startDate: start ? getFormattedDate(start, false) : null,
        endDate: end ? getFormattedDate(end, false) : null,
      };

      createExtraBedRates.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("ExtraBed Rate Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        extraType: { uuid: values?.extraType },
        roomType: { uuid: values.roomTypeUuid },
        ratePlan: { uuid: values.ratePlanUuid },       
        startDate: start ? getFormattedDate(start, false) : null,
        endDate: end ? getFormattedDate(end, false) : null,
        uuid: data?.uuid,
      };

      editExtraBedRates.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("ExtraBed Rate Updated Successfully!");
        },
      });
    }
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
                ? "Extra Rate Details"
                : mode === "edit"
                  ? "Edit Extra Rate"
                  : "Create Extra Rate"}
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
                isPending={
                  createExtraBedRates.isPending || editExtraBedRates.isPending
                }
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
            minAge: 1,
            maxAge: 2,
          }}
        >
          <Form.Item
            label="Room Type"
            name="roomTypeUuid"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: isView
                ? roomType.find((item) => item.value === value)?.label
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
                options={roomType}
                placeholder="Select Room Type"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Rate Plan"
            name="ratePlanUuid"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: isView
                ? ratePlan.find((item) => item.value === value)?.label
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
                options={ratePlan}
                placeholder="Select rate Plan"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Extra Type"
            name="extraType"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: isView
                ? extraList?.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select
                options={extraList}
                open={isView ? false : undefined}
                placeholder="Select age type"
              />
            )}
          </Form.Item>

          {isExtraPerson && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Min Age"
                  name="minAge"
                  dependencies={["maxAge"]}
                  rules={[
                    { required: true, message: "Please enter min age" },
                    {
                      type: "number",
                      min: 0,
                      message: "Age must be 0 or greater",
                    },
                  ]}
                >
                  <InputNumber
                    {...sharedProps}
                    readOnly={isView}
                    placeholder="Min age"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Max Age"
                  name="maxAge"
                  dependencies={["minAge"]}
                  rules={[
                    { required: true, message: "Please enter max age" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const minAge = getFieldValue("minAge");

                        if (
                          value === undefined ||
                          value === null ||
                          minAge === undefined ||
                          minAge === null ||
                          value > minAge
                        ) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "Max age must be strictly greater than Min age",
                          ),
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    {...sharedProp}
                    readOnly={isView}
                    placeholder="Max age"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is Required" }]}
          >
            <InputNumber
              readOnly={isView}
              suffix="MMK"
              placeholder="Enter price"
              style={{ width: "100%" }}
              formatter={priceFormatter}
              parser={priceParser}
            />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: "Please select Date Range" }]}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <RangePicker
              disabledDate={disabledDate}
              open={isView ? !isView : undefined}
              inputReadOnly={isView}
              suffixIcon={isView ? null : undefined}
              className="w-full flex"
              style={{ width: "100%" }}
              allowClear={!isView}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ExtraBedRateForm;
