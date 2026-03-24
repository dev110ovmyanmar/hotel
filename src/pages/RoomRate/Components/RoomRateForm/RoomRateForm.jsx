import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import Toast from './../../../../component/Toast/Toast';
import usePermission from './../../../../hooks/usePermission';
import { upsertRoomRate, roomRateDetails } from "../../../../api/roomRateApi";
import {ratePlanMeta} from "../../../../api/ratePlanApi";

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

  const {data: ratePlanMetas} = useApiQuery({
    fetchQueryName: "rate-plan-meta",
    fetchQueryFunction: ratePlanMeta
  })

  const ratePlanOptions = ratePlanMetas?.rate_plans?.map(item => ({
    label: item.name,
    value: item.uuid
  }));

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
    console.log(values,"ValuesOnFinish");
    if (isAdd) {
      const createValues = {
        ...values,
        ratePlan: values?.ratePlan,
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
        ...values, // merge new form values
        ratePlan: values?.ratePlan,
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
        >
          <Form.Item
            label="Rate Plan"
            name={["ratePlan", "uuid"]}
            rules={[{ required: true, message: "Rate Plan is Required" }]}
            getValueProps={(value) => {
              return ({
                value: isView
                  ? fetchRatePlanList?.data?.find((item) => item.uuid === value)?.name
                  : value,
              })
            }}
          >
            {
              isView ?
                <Input readOnly={isView} /> :
                <Select options={ratePlanOptions} />
            }
          </Form.Item>


          <Form.Item
            label="Room Type"
            name={["roomType", "uuid"]}
            rules={[{ required: true, message: "Room Type is Required" }]}
            getValueProps={(value) => {
              return ({
                value: isView
                  ? fetchRoomTypeList?.data?.find((item) => item.uuid === value)?.name
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

          <Form.Item
            label="Duration Hours"
            name="durationHours"
            rules={[{ required: true, message: "Duration Hours is Required" }]}
          >
            <InputNumber readOnly={isView} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomRateForm;
