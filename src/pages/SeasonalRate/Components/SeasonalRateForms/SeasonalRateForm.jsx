import React, { useEffect } from "react";
import { Form, Input, Button, Drawer, Select, DatePicker, InputNumber } from "antd";
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

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

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
    fetchQueryName: "SeasonlRate",
    fetchQueryFunction: seasonlRateDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data && ratePlanMetaData) {
      form.setFieldsValue({
        ...data,
        startDate: data?.startDate ? dayjs(data.startDate) : null,
        endDate: data?.endDate ? dayjs(data.endDate) : null,
        ratePlanUuid: data?.ratePlan?.uuid,
        roomTypeUuid: data?.roomType?.uuid,
      });
    }
  }, [data, ratePlanMetaData]);

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      startDate: getFormattedDate(values.startDate, false),
      endDate: getFormattedDate(values.endDate, false),
    };

    if (isAdd) {
      const createValues = {
        ...formattedValues,
        ratePlan: { uuid: values.ratePlanUuid },
        roomType: { uuid: values.roomTypeUuid },
      };

      createSeasonlRates.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Seasonal Rate Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...formattedValues,
        ratePlan: { uuid: values.ratePlanUuid },
        roomType: { uuid: values.roomTypeUuid },
        uuid: data?.uuid,
      };

      editSeasonlRates.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Seasonal Rate Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Seasonal Rate Details"
                : mode === "edit"
                  ? "Edit Seasonal Rate"
                  : "Create Seasonal Rate"}
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
                isPending={
                  createSeasonlRates.isPending || editSeasonlRates.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
        {
          isLoading ? (
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
                label="Room Type"
                name="roomTypeUuid"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: isView
                    ? roomTypes.find((item) => item.value === value)?.label
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
                    placeholder="Select Seasonal Rate"
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Rate Plan"
                name="ratePlanUuid"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: isView
                    ? ratePlans.find((item) => item.value === value)?.label
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

              <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                <InputNumber
                  className="!w-full"
                  min={0}
                  readOnly={isView}
                  placeholder="Enter Price"
                  suffix="MMK"
                />
              </Form.Item>

              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select Start Date" }]}
              >
                <DatePicker
                  className="w-full"
                  disabled={isView}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>

              <Form.Item
                label="End date"
                name="endDate"
                rules={[{ required: true, message: "Please select End Date" }]}
              >
                <DatePicker
                  className="w-full"
                  disabled={isView}
                  disabledDate={(current) => {
                    return (
                      current && current < dayjs().add(1, "day").startOf("day")
                    );
                  }}
                />
              </Form.Item>
            </Form>
          )
        }
      </Drawer>
    </div >
  );
};

export default SeasonalRateForm;
