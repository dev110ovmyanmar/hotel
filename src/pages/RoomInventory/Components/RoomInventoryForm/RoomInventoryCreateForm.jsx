import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Drawer,
  DatePicker,
  Col,
  Row,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import useApiQuery from "../../../../hooks/useApiQuery";
import { roomMeta } from "../../../../api/exteraBedRateApi";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../utils";
import {
  createAvailabilityCalendar,
  getAvailabilityCalendarDetails,
  updateAvailabilityCalendar,
} from "../../../../api/availabilityCalendarApi";

const RoomInventoryCreateForm = ({
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

  const { RangePicker } = DatePicker;
  const disabledDate = current => {
    return current && current < dayjs().startOf('day');
  };

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomType = roomMetaData?.room_types?.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  const createAvailabilityCalendars = useApiMutation({
    mutationFn: createAvailabilityCalendar,
    invalidateKeys: [["availabilty-calendars"]],
    shouldInvalidate: page === 1,
  });

  const updateAvailabilityCalendars = useApiMutation({
    mutationFn: updateAvailabilityCalendar,
    invalidateKeys: [["availabilty-calendars"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "availabilty-calendars-details",
    fetchQueryFunction: getAvailabilityCalendarDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        dateRange: [
          data.startDate ? dayjs(data.startDate) : null,
          data.endDate ? dayjs(data.endDate) : null
        ],
        roomType: data?.roomType?.filter((r) => r.selected).map((r) => r.id),
      });

      setSelectedData(data);
    }
  }, [data]);

    const onFinish = (values) => {
      const [start, end] = values.dateRange || [];
      if (isAdd) {
        const createValues = {
          startDate: start ? getFormattedDate(start, false) : null,
          endDate: end ? getFormattedDate(end, false) : null,
          roomType: { ids: values.roomTypeId ?? [] },
        };

      createAvailabilityCalendars.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Availabilty Calendars Created Successfully!");
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
            <span>Create Room Inventory Rate</span>
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
                  createAvailabilityCalendars.isPending ||
                  updateAvailabilityCalendars.isPending
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Room Type"
                name="roomTypeId"
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
                    mode="multiple"
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                    options={roomType}
                    placeholder="Select Room Type"
                    maxTagCount="responsive"
                  />
                )}
              </Form.Item>
            </Col>



            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Date Range"
                rules={[{ required: true, message: "Please select Date Range" }]}>
                <RangePicker disabledDate={disabledDate} disabled={isView} suffixIcon={isView ? null : undefined} />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[
                  { required: true, message: "Please select Start Date" },
                ]}
              >
                <DatePicker
                  className="w-full"
                  disabled={isView}
                  disabledDate={(current) => {
                    return current && current < dayjs().startOf("day");
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
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
            </Col>
          </Row> */}
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomInventoryCreateForm;
