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
  Switch,
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
import {
  roomRestrictionDetails,
  upsertRoomRestriction,
} from "../../../../api/roomrestriction";

const RoomRestrictionForm = ({
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

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

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

  const createRoomRestriction = useApiMutation({
    mutationFn: upsertRoomRestriction,
    invalidateKeys: [["roomRestriction"]],
    shouldInvalidate: page === 1,
  });

  const editRoomRestriction = useApiMutation({
    mutationFn: upsertRoomRestriction,
    invalidateKeys: [["roomRestriction"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "roomRestriction-details",
    fetchQueryFunction: roomRestrictionDetails,
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
        date: data?.date ? dayjs(data.date) : null,
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
    if (isAdd) {
      const createValues = {
        ...values,
        roomType: { uuid: values.roomTypeUuid },
        ratePlan: { uuid: values.ratePlanUuid },
        date: getFormattedDate(values.date, false),
      };

      createRoomRestriction.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          handleClose();
          Toast.success("ExtraBed Rate Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,

        roomType: { uuid: values.roomTypeUuid },
        ratePlan: { uuid: values.ratePlanUuid },
        date: getFormattedDate(values.date, false),
        uuid: data?.uuid,
      };

      editRoomRestriction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("ExtraBed Rate Updated Successfully!");
        },
      });
    }
  };
  const onChange = (value) => {
    console.log("changed", value);
  };

  // const sharedProps = {
  //   mode: "spinner",
  //   min: 1,
  //   max: 10,
  //   defaultValue: 1,
  //   onChange,
  //   style: { width: 150 },
  // };

  const childSharedProps = {
    mode: "spinner",
    min: 0,
    max: 10,
    defaultValue: 0,
    onChange,
    style: { width: 150 },
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
                ? "Room Restriction Details"
                : mode === "edit"
                  ? "Edit Room Restriction"
                  : "Create Room Restriction"}
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
              <FormButtons
                onClick={() => form.submit()}
                isPending={
                  createRoomRestriction.isPending ||
                  editRoomRestriction.isPending
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
            closedToArrival: false,
            closedToDeparture: false,
            minStay: 0,
            maxStay: 0,
          }}
        >
          <div className="grid grid-cols-2 gap-6">
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
          </div>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select Date" }]}
          >
            <DatePicker
              className="w-60"
              open={isView? !isView : undefined}
              inputReadOnly={isView}
              suffixIcon={isView ? null : undefined}
              allowClear={!isView}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Min Stay"
              name="minStay"
              rules={[{ required: true }]}
              className="minus-icon"
            >
              <InputNumber
                {...childSharedProps}
                placeholder="Outlined"
                readOnly={isView}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Max Stay"
              name="maxStay"
              rules={[{ required: true }]}
              className="minus-icon"
            >
              <InputNumber
                {...childSharedProps}
                placeholder="Outlined"
                readOnly={isView}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Close to Arrivel"
              name="closedToArrival"
              valuePropName="checked"
              rules={[{ required: true }]}
              normalize={(value) => (value ? 1 : 0)}
            >
              <Switch
                checkedChildren="True"
                unCheckedChildren="False"
                disabled={isView}
              />
            </Form.Item>

            <Form.Item
              label="Close to Departure"
              name="closedToDeparture"
              valuePropName="checked"
              rules={[{ required: true }]}
              normalize={(value) => (value ? 1 : 0)}
            >
              <Switch
                checkedChildren="True"
                unCheckedChildren="False"
                disabled={isView}
              />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomRestrictionForm;
