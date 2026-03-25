import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Form, Input, Button, Select, Drawer, Row, Col } from "antd";
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

  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { ratePlanId } = useParams();

  const { state } = useLocation();
  const pricingType = state?.ratePlan?.pricingType?.code;

  console.log(pricingType, "StateInLocationRoomRateForm");


  const { data: ratePlanMetas } = useApiQuery({
    fetchQueryName: "rate-plan-meta",
    fetchQueryFunction: ratePlanMeta
  })

  const roomTypeOptions = ratePlanMetas?.room_types?.map(item => ({
    label: item.name,
    value: item.uuid
  }))

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
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && roomRateDetailData) {
      form.setFieldsValue({
        ...roomRateDetailData,
      });
      setSelectedData(roomRateDetailData);
    }
  }, [roomRateDetailData]);

  if (roomRateDetailData) {
    console.log(roomRateDetailData, "roomRateDetailData")
  }
  const onFinish = (values) => {
    console.log(values, "ValuesInOnFinish")
    if (isAdd) {
      const createValues = {
        ...values,
        ratePlan: {
          uuid: ratePlanId
        },
        roomType: values?.roomType
      };

      upsertRoomRates.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Rate Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        ratePlan: {
          uuid: ratePlanId
        },
        roomType: values?.roomType,
        uuid: roomRateDetailData?.uuid,
      };

      upsertRoomRates.mutate(editValues, {
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
        onClose={() => setDrawerOpen(false)}
        size={500}
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

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Price is Required" }]}
          >
            <Input
              readOnly={isView}
              suffix="MMK"
            />
          </Form.Item>

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

          <Form.Item label="Daily Room Prices" name="weekdays">
            <div style={{ display: "flex", flexDirection: "column" }}>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Mon" name={["weekdays", "mon"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Tue" name={["weekdays", "tue"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Wed" name={["weekdays", "wed"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thur" name={["weekdays", "thu"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Fri" name={["weekdays", "fri"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Sat" name={["weekdays", "sat"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Sun" name={["weekdays", "sun"]} style={{ marginBottom: 1 }}>
                    <Input readOnly={isView} />
                  </Form.Item>
                </Col>
              </Row>







            </div>
          </Form.Item>

        </Form>
      </Drawer>
    </div>
  );
};

export default RoomRateForm;
