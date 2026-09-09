import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from "./../../../../component/Toast/Toast";
import usePermission from "./../../../../hooks/usePermission";
import { upsertRoomRate, roomRateDetails } from "../../../../api/roomRateApi";
import { ratePlanMeta } from "../../../../api/ratePlanApi";
import PriceInput from "../../../../component/PriceInput/PriceInput";

const RoomRateForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
  ratePlan,
  roomRateUuid,
}) => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);

  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { state } = useLocation();
  const activePricingType =
    ratePlan?.pricingType?.code ?? state?.ratePlan?.pricingType?.code;
  const activeRatePlanUuid = ratePlan?.uuid ?? state?.ratePlan?.uuid;

  const { data: ratePlanMetas } = useApiQuery({
    fetchQueryName: "rate-plan-meta",
    fetchQueryFunction: ratePlanMeta,
  });

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const roomTypeOptions = ratePlanMetas?.room_types?.map((item) => ({
    label: item.name,
    value: item.uuid,
  }));

  const statuses = initData?.statuses?.status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const days = [
    { key: "mon", label: "Monday" },
    { key: "tue", label: "Tuesday" },
    { key: "wed", label: "Wednesday" },
    { key: "thu", label: "Thursday" },
    { key: "fri", label: "Friday" },
    { key: "sat", label: "Saturday" },
    { key: "sun", label: "Sunday" },
  ];

  const upsertRoomRates = useApiMutation({
    mutationFn: upsertRoomRate,
    invalidateKeys: [["room-rates"], ["ratePlan"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data: roomRateDetailData } = useApiQuery({
    fetchQueryName: "room-rate-details",
    fetchQueryFunction: roomRateDetails,
    params: { uuid: roomRateUuid },
    options: {
      enabled: !!roomRateUuid && !isAdd && drawerOpen,
    },
  });

  // useEffect(() => {
  //   if (!isAdd && roomRateDetailData) {
  //     form.setFieldsValue({
  //       ...roomRateDetailData,
  //       uuid: roomRateDetailData?.uuid,
  //       roomType: {
  //         uuid: roomRateDetailData?.roomType?.uuid,
  //       },
  //       price: roomRateDetailData?.price,
  //       durationHours: roomRateDetailData?.durationHours,
  //       status: roomRateDetailData?.status?.uuid,
  //       ...roomRateDetailData?.weekdays,
  //       ...Object.keys(roomRateDetailData?.weekdays || {}).reduce(
  //         (acc, day) => {
  //           acc[`enable_${day}`] = roomRateDetailData?.weekdays[day] !== null;
  //           return acc;
  //         },
  //         {},
  //       ),
  //     });
  //     setSelectedData(roomRateDetailData);
  //   } else if (isAdd) {
  //     form.resetFields();
  //     if (roomRateUuid) {
  //       form.setFieldsValue({ roomType: { uuid: roomRateUuid } });
  //     }
  //   }
  // }, [roomRateDetailData, isAdd, form, roomRateUuid]);
  //   const onFinish = (values) => {
  //   const payload = {
  //     ...values,
  //     ...(isEdit && { uuid: roomRateDetailData?.uuid }),
  //     ratePlan: { uuid: activeRatePlanUuid },
  //     roomType: values?.roomType,
  //     status: { uuid: values?.status },
  //     weekdays: {
  //       mon: values?.mon ? values?.mon : null,
  //       tue: values?.tue ? values?.tue : null,
  //       wed: values?.wed ? values?.wed : null,
  //       thu: values?.thu ? values?.thu : null,
  //       fri: values?.fri ? values?.fri : null,
  //       sat: values?.sat ? values?.sat : null,
  //       sun: values?.sun ? values?.sun : null,
  //     },
  //   };

  //   days.forEach((day) => {
  //     delete payload[day];
  //     delete payload[`enable_${day}`];
  //   });

  //   if (isAdd) {
  //     upsertRoomRates.mutate(payload, {
  //       onSuccess: () => {
  //         form.resetFields();
  //         setDrawerOpen(false);
  //         setPage(1);
  //         Toast.success("Room Rate Created Successfully!");
  //       },
  //     });
  //   }
  //   if (isEdit) {
  //     upsertRoomRates.mutate(payload, {
  //       onSuccess: () => {
  //         setDrawerOpen(false);
  //         Toast.success("Room Rate Updated Successfully!");
  //       },
  //     });
  //   }
  // };

  useEffect(() => {
    if (!isAdd && roomRateDetailData) {
      const weekdayValues = {};
      const enableFlags = {};

      days.forEach(({ key }) => {
        const dayPrice = roomRateDetailData?.weekdays?.[key] ?? null;
        weekdayValues[key] = dayPrice;
        enableFlags[`enable_${key}`] = dayPrice !== null;
      });

      form.setFieldsValue({
        ...roomRateDetailData,
        uuid: roomRateDetailData?.uuid,
        roomType: {
          uuid: roomRateDetailData?.roomType?.uuid,
        },
        price: roomRateDetailData?.price,
        durationHours: roomRateDetailData?.durationHours,
        status: roomRateDetailData?.status?.uuid,
        ...weekdayValues,
        ...enableFlags,
      });

      setSelectedData(roomRateDetailData);
    } else if (isAdd) {
      form.resetFields();
      if (roomRateUuid) {
        form.setFieldsValue({ roomType: { uuid: roomRateUuid } });
      }
    }
  }, [roomRateDetailData, isAdd, form, roomRateUuid]);

    const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const weekdaysObj = days.reduce((acc, { key }) => {
      const isEnabled = values[`enable_${key}`];
      acc[key] =
        isEnabled && values[key] !== undefined && values[key] !== null
          ? Number(values[key])
          : null;
      return acc;
    }, {});

    const payload = {
      ...values,
      ...(isEdit && { uuid: roomRateDetailData?.uuid }),
      ratePlan: { uuid: activeRatePlanUuid },
      roomType: values?.roomType,
      status: { uuid: values?.status },
      price: Number(values?.price),
      weekdays: weekdaysObj,
    };

    days.forEach(({ key }) => {
      delete payload[key];
      delete payload[`enable_${key}`];
    });

    if (isAdd) {
      upsertRoomRates.mutate(payload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Rate Created Successfully!");
        },
      });
    }

    if (isEdit) {
      upsertRoomRates.mutate(payload, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("Room Rate Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        // onClose={() => {
        //   setDrawerOpen(false);
        // }}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Rate Details"
                : mode === "edit"
                  ? "Edit Room Rate"
                  : "Create Room Rate"}
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
                isPending={upsertRoomRates.isPending}
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
            durationHours: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Room Type"
                name={["roomType", "uuid"]}
                rules={[{ required: true, message: "Room Type is Required" }]}
                getValueProps={(value) => {
                  return {
                    value: isView
                      ? ratePlanMetas?.room_types?.find(
                          (item) => item.uuid === value,
                        )?.name
                      : value,
                  };
                }}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select options={roomTypeOptions} />
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Price is Required" }]}
                getValueProps={(value) => ({
                  value: value !== null && value !== undefined ? String(value) : "",
                })}
              >
                <PriceInput readOnly={isView} suffix="MMK" />
              </Form.Item>
            </Col>

            <Col span={12}>
              {activePricingType !== "daily" && (
                <Form.Item
                  label="Duration Hours"
                  name="durationHours"
                  rules={[
                    { required: true, message: "Duration Hours is Required" },
                  ]}
                >
                  <Input readOnly={isView} suffix="hrs" />
                </Form.Item>
              )}
            </Col>
          </Row>

          {/* <Status isView={isView}/> */}
          <Row gutter={16}>
            <Col span={24}>
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Days of Week"
                className={`mb-4 ${isView ? "pointer-events-none" : ""}`}
              >
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
                    getValueProps={(value) => ({
                      value: value !== null && value !== undefined ? String(value) : "",
                    })}
                  >
                    <PriceInput
                      placeholder="Enter Price"
                      min={0}
                      readOnly={!isEnabled || isView}
                      suffix="MMK"
                    />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomRateForm;
