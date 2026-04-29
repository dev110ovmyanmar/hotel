import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Form, Input, Button, Select, Drawer, Row, Col, InputNumber, Checkbox } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from './../../../../component/Toast/Toast';
import usePermission from './../../../../hooks/usePermission';
import { upsertRoomRate, roomRateDetails } from "../../../../api/roomRateApi";
import { ratePlanMeta } from "../../../../api/ratePlanApi";

const RoomRateForm = ({
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
  const formValues = Form.useWatch([], form);

  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { state } = useLocation();
  const pricingType = state?.ratePlan?.pricingType?.code;

  const { data: ratePlanMetas } = useApiQuery({
    fetchQueryName: "rate-plan-meta",
    fetchQueryFunction: ratePlanMeta
  })

  const roomTypeOptions = ratePlanMetas?.room_types?.map(item => ({
    label: item.name,
    value: item.uuid
  }))

  const days = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' },
  ];

  const upsertRoomRates = useApiMutation({
    mutationFn: upsertRoomRate,
    invalidateKeys: [["room-rates"]],
    shouldInvalidate: isEdit ? true : page === 1
  });

  const { data: roomRateDetailData } = useApiQuery({
    fetchQueryName: "room-rate-details",
    fetchQueryFunction: roomRateDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid && !isAdd && drawerOpen,
    },
  });

  useEffect(() => {
    if (!isAdd && roomRateDetailData) {
      form.setFieldsValue({
        uuid: roomRateDetailData?.uuid,
        roomType: {
          uuid: roomRateDetailData?.roomType?.uuid
        },
        price: roomRateDetailData?.price,
        durationHours: roomRateDetailData?.durationHours,
        ...roomRateDetailData?.weekdays,
        ...Object.keys(roomRateDetailData?.weekdays).reduce((acc, day) => {
          acc[`enable_${day}`] = roomRateDetailData?.weekdays[day] !== null;
          return acc;
        }, {}),
      });

      setSelectedData(roomRateDetailData);
    } else if (isAdd) {
      form.resetFields();
    }
  }, [roomRateDetailData, isAdd, form]);

  const onFinish = (values) => {
    const payload = {
      ...values,
      uuid: isEdit ? roomRateDetailData?.uuid : null,
      ratePlan: { uuid: state?.ratePlan?.uuid },
      roomType: values?.roomType,
      weekdays: {
        mon: values?.mon ? values?.mon : null,
        tue: values?.tue ? values?.tue : null,
        wed: values?.wed ? values?.wed : null,
        thu: values?.thu ? values?.thu : null,
        fri: values?.fri ? values?.fri : null,
        sat: values?.sat ? values?.sat : null,
        sun: values?.sun ? values?.sun : null,
      }
    };

    days.forEach(day => {
      delete payload[day];
      delete payload[`enable_${day}`];
    });

    if (isAdd) {
      upsertRoomRates.mutate(payload, {
        onSuccess: () => {
          form.resetFields();
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
          Toast.success("Room Rate Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
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
            durationHours: 0
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Room Type"
                name={["roomType", "uuid"]}
                rules={[{ required: true, message: "Room Type is Required" }]}
                getValueProps={(value) => {
                  return ({
                    value: isView
                      ? ratePlanMetas?.room_types?.find((item) => item.uuid === value)?.name
                      : value,
                  })
                }}
              >
                {
                  isView ?
                    <Input readOnly={isView} /> :
                    <Select options={roomTypeOptions} />
                }
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Price is Required" }]}
              >
                <InputNumber
                  readOnly={isView}
                  suffix="MMK"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              {
                pricingType !== "daily" &&
                <Form.Item
                  label="Duration Hours"
                  name="durationHours"
                  rules={[{ required: true, message: "Duration Hours is Required" }]}
                >
                  <Input
                    readOnly={isView}
                    suffix="hrs"
                  />
                </Form.Item>
              }
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Days of Week" className="mb-4">
                <div className="flex flex-wrap gap-x-3 gap-y-2 p-0.5">
                  {days.map((day) => (
                    <div key={`group-${day.key}`} className="flex flex-col items-center">
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
                          disabled={isView}
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
                    rules={[{ required: isEnabled, message: 'Price is required' }]}
                  >
                    <InputNumber
                      placeholder="Enter Price"
                      style={{ width: "100%" }}
                      min={0}
                      disabled={!isEnabled || isView}
                      suffix="MMK"
                    />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        </Form>
      </Drawer>
    </div >
  );
};

export default RoomRateForm;
