import React, { useEffect, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  DatePicker,
  Button,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import {
  availabilitySearch,
  createReservationRoom,
} from "../../../../../../api/reservationSectionApi";

const { RangePicker } = DatePicker;

const RoomInformationForm = ({
  data,
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  setSelectedData,
  page,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  const isInitializing = useRef(false);

  const selectedDates = Form.useWatch("dates", form);
  const selectedRoomUuid = Form.useWatch("roomTypeUuid", form);

  const sharedProps = {
    mode: "spinner",
    min: 1,
    defaultValue: 1,
    style: { width: 150 },
  };

  let totalNight = 0;
  if (selectedDates && selectedDates[0] && selectedDates[1]) {
    const diff = selectedDates[1].diff(selectedDates[0], "day");
    totalNight = diff > 0 ? diff : 0;
  }

  const roomAvailabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
  });

  const createReservationRooms = useApiMutation({
    mutationFn: createReservationRoom,
  });

  const availableRoomsData = roomAvailabilitySearchs.data?.rooms || [];

  // initial  form value
  useEffect(() => {
    if (drawerOpen && data) {
      isInitializing.current = true;

      const today = dayjs();
      const Day = today.format("YYYY-MM-DD");

      const checkinDateObj = data?.actualCheckin
        ? dayjs(data?.actualCheckin)
        : null;
      let finalCheckin = null;

      if (checkinDateObj) {
        if (checkinDateObj.isBefore(today, "day")) {
          finalCheckin = Day;
        } else {
          finalCheckin = checkinDateObj.format("YYYY-MM-DD");
        }
      }

      const finalCheckout = data?.actualCheckout?.[1]
        ? dayjs(data?.actualCheckout).format("YYYY-MM-DD")
        : null;

      form.setFieldsValue({
        dates: [
          finalCheckin ? dayjs(finalCheckin) : null,
          finalCheckout ? dayjs(finalCheckout) : null,
        ],
        roomTypeUuid: data?.roomType?.uuid || null,
        ratePlanId: data?.roomRate?.id || null,
        totalRooms: 1,
      });

      setTimeout(() => {
        isInitializing.current = false;
      }, 100);
    }
  }, [drawerOpen, data, form]);

  // date change / api
  useEffect(() => {
    if (drawerOpen && selectedDates?.[0] && selectedDates?.[1]) {
      if (!isInitializing.current) {
        form.setFieldsValue({
          roomTypeUuid: null,
          ratePlanId: null,
          totalRooms: 1,
        });
      }

      const checkin = selectedDates[0].format("YYYY-MM-DD");
      const checkout = selectedDates[1].format("YYYY-MM-DD");

      const diffNights = selectedDates[1].diff(selectedDates[0], "day");
      const payloadTotalNight = diffNights > 0 ? diffNights : 0;

      const payload = {
        filter: {
          checkinDate: checkin,
          checkoutDate: checkout,
        },
        bookedVia: { uuid: data?.bookedVia?.uuid },
        sourceType: { uuid: data?.sourceType?.uuid },
        source: { uuid: data?.source?.uuid },
        totalNight: payloadTotalNight,
        reservation: { uuid: data?.uuid },
      };

      roomAvailabilitySearchs.mutate(payload);
    }
  }, [drawerOpen, selectedDates, data]);

  // date boundary filter
  const disabledDate = (current) => {
    if (!current || !data) return false;

    const today = dayjs().startOf("day");

    let arrivalLimit = data.actualCheckin
      ? dayjs(data.actualCheckin).startOf("day")
      : today;
    if (arrivalLimit.isBefore(today, "day")) {
      arrivalLimit = today;
    }

    const departureLimit = data.actualCheckout
      ? dayjs(data.actualCheckout).endOf("day")
      : null;

    //date disable
    const isBeforeArrival = current.isBefore(arrivalLimit, "day");
    const isAfterDeparture = departureLimit
      ? current.isAfter(departureLimit, "day")
      : false;

    return isBeforeArrival || isAfterDeparture;
  };

  const roomTypeOptions = availableRoomsData.map((item) => ({
    label: `${item.roomType?.name} (${item.totalRooms} available)`,
    value: item.roomType?.uuid,
  }));

  const targetRoomDetails = availableRoomsData.find(
    (item) => item.roomType?.uuid === selectedRoomUuid,
  );

  const ratePlanOptions = targetRoomDetails?.ratePlans
    ? targetRoomDetails.ratePlans.map((rate) => ({
        label: `${rate.name}`,
        value: rate.id,
      }))
    : [];

  const handleRoomTypeChange = () => {
    form.setFieldsValue({ ratePlanId: null, totalRooms: 1 });
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const [checkin, checkout] = values.dates || [];

    const formattedPayload = {
      filter: {
        checkinDate: checkin ? checkin.format("YYYY-MM-DD") : null,
        checkoutDate: checkout ? checkout.format("YYYY-MM-DD") : null,
      },
      reservation: { uuid: data?.uuid },
      totalNight: totalNight,
      rooms: [
        {
          roomType: {
            uuid: values.roomTypeUuid,
          },
          ratePlans: [
            {
              id: values.ratePlanId,
              totalRooms: values.totalRooms,
            },
          ],
        },
      ],
    };

    createReservationRooms.mutate(formattedPayload, {
      onSuccess: () => {
        form.resetFields();
        handleClose();
        if (onSuccess) onSuccess();
        Toast.success("Room Created Successfully!");
      },
    });
  };

  const maxAvailableRooms = targetRoomDetails?.totalRooms ?? 10;

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      size={650}
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "view"
              ? "Room Information Details"
              : mode === "edit"
                ? "Edit Room Information"
                : "Create Room Information"}
          </span>

          {isView ? (
            <Button type="primary" onClick={() => setMode("edit")}>
              Edit
            </Button>
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              mode={mode}
              isPending={createReservationRooms.isPending}
            />
          )}
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} disabled={isView}>
        <div className="border border-gray-200 rounded px-4 py-2">
          <div className="flex items-end gap-6 w-full ">
            <Form.Item
              label="Stay Duration (Arrival - Departure)"
              name="dates"
              className="w-3/4 mb-0"
              rules={[
                { required: true, message: "Please pick duration dates" },
              ]}
            >
              <RangePicker
                className="w-full"
                format="DD/MM/YYYY"
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item className="w-1/5 mb-0 bg-gray-300 rounded">
              <Input
                value={`${totalNight} ${totalNight === 1 ? "Night" : "Nights"}`}
                disabled
                className="bg-gray-50 text-black font-medium disabled:text-black text-center h-[32px]"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Room"
              name="roomTypeUuid"
              rules={[{ required: true, message: "Please select a room type" }]}
            >
              <Select
                placeholder="Select Room Type"
                options={roomTypeOptions}
                onChange={handleRoomTypeChange}
                loading={roomAvailabilitySearchs.isPending}
              />
            </Form.Item>

            <Form.Item
              label="Rate Plan"
              name="ratePlanId"
              rules={[{ required: true, message: "Please select a room rate" }]}
            >
              <Select
                placeholder={
                  selectedRoomUuid
                    ? "Select Room Rate Plan"
                    : "Choose Room Type First"
                }
                options={ratePlanOptions}
                disabled={!selectedRoomUuid}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Total Room"
              name="totalRooms"
              rules={[
                { required: true, message: "Please input total rooms" },
                {
                  type: "number",
                  max: maxAvailableRooms,
                  message: `Cannot exceed available rooms (${maxAvailableRooms})`,
                },
              ]}
            >
              <InputNumber
                {...sharedProps}
                min={1}
                max={maxAvailableRooms}
                placeholder="Quantity"
                readOnly={isView}
                style={{ width: "100%" }}
                disabled={!selectedRoomUuid}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default RoomInformationForm;
