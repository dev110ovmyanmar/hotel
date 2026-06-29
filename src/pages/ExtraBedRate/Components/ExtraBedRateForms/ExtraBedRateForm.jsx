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

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { RangePicker } = DatePicker;

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.EXTRA_BED_RATE_EDIT);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const ageList = initData?.statuses?.age_type?.map((ageType) => ({
    value: ageType.uuid,
    label: ageType.name,
  }));

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
        ageType: data?.ageType?.uuid,
        // startDate: data?.startDate ? dayjs(data.startDate) : null,
        // endDate: data?.endDate ? dayjs(data.endDate) : null,
        dateRange: [
          data.startDate ? dayjs(data.startDate) : null,
          data.endDate ? dayjs(data.endDate) : null,
        ],
      });

      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    const [start, end] = values.dateRange || [];

    if (isAdd) {
      const createValues = {
        ...values,
        ageType: { uuid: values.ageType },
        roomType: { uuid: values.roomTypeUuid },
        ratePlan: { uuid: values.ratePlanUuid },
        // startDate: getFormattedDate(values.startDate, false),
        // endDate: getFormattedDate(values.endDate, false),
        startDate: start ? getFormattedDate(start, false) : null,
        endDate: end ? getFormattedDate(end, false) : null,
      };

      createExtraBedRates.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Extra Bed Rate Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        ageType: { uuid: values?.ageType },
        roomType: { uuid: values.roomTypeUuid },
        ratePlan: { uuid: values.ratePlanUuid },
        // startDate: getFormattedDate(values.startDate, false),
        // endDate: getFormattedDate(values.endDate, false),
        startDate: start ? getFormattedDate(start, false) : null,
        endDate: end ? getFormattedDate(end, false) : null,
        uuid: data?.uuid,
      };

      editExtraBedRates.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Extra Bed Rate Updated Successfully!");
        },
      });
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
                ? "Extra Bed Rate Details"
                : mode === "edit"
                  ? "Edit Extra Bed Rate"
                  : "Create Extra Bed Rate"}
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
            label="Age Type"
            name="ageType"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: isView
                ? ageList.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select
                options={ageList}
                open={isView ? false : undefined}
                placeholder="Select age type"
              />
            )}
          </Form.Item>
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
              disabled={isView}
              suffixIcon={isView ? null : undefined}
              className="w-full flex"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ExtraBedRateForm;
