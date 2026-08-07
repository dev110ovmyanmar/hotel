import React, { useEffect, useRef } from "react";
import { Form, Select, Drawer, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { FaMoon } from "react-icons/fa";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { availabilitySearch, createReservationRoom } from "../../../../../../api/reservationSectionApi";
import Toast from "../../../../../../component/Toast/Toast";
import { darkModeStyle, textWhiteInDarkStyle } from "../../../../../../utils";

const { RangePicker } = DatePicker;

const RoomInformationForm = ({
  data,
  mode,
  drawerOpen,
  setDrawerOpen,
  setSelectedData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isInitializing = useRef(false);

  const selectedDates = Form.useWatch("dates", form);
  const selectedRoomUuid = Form.useWatch("roomTypeUuid", form);

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

  // Initialize form fields with incoming basic parent data
  useEffect(() => {
    if (drawerOpen && data) {
      isInitializing.current = true;

      const today = dayjs();
      const Day = today.format("YYYY-MM-DD");

      const checkinDateObj = data?.actualCheckin ? dayjs(data?.actualCheckin) : null;
      let finalCheckin = null;

      if (checkinDateObj) {
        finalCheckin = checkinDateObj.isBefore(today, "day") ? Day : checkinDateObj.format("YYYY-MM-DD");
      }

      const checkoutDateObj = data?.actualCheckout ? dayjs(data?.actualCheckout) : null;
      let finalCheckout = null;

      if (checkoutDateObj) {
        finalCheckout = checkoutDateObj.isBefore(today, "day") ? Day : checkoutDateObj.format("YYYY-MM-DD");
      }

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

  // Fetch live availability options when dates are ready
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

      const payload = {
        filter: { checkinDate: checkin, checkoutDate: checkout },
        bookedVia: { uuid: data?.bookedVia?.uuid },
        sourceType: { uuid: data?.sourceType?.uuid },
        source: { uuid: data?.source?.uuid },
        totalNight: diffNights > 0 ? diffNights : 0,
        reservation: { uuid: data?.uuid },
      };

      roomAvailabilitySearchs.mutate(payload);
    }
  }, [drawerOpen, selectedDates, data]);

  const disabledDate = (current) => {
    if (!current || !data) return false;
    const today = dayjs().startOf("day");
    let arrivalLimit = data.actualCheckin ? dayjs(data.actualCheckin).startOf("day") : today;
    if (arrivalLimit.isBefore(today, "day")) {
      arrivalLimit = today;
    }
    return current.isBefore(arrivalLimit, "day");
  };

  const roomTypeOptions = availableRoomsData.map((item) => ({
    label: `${item.roomType?.name} (${item.totalRooms} available)`,
    value: item.roomType?.uuid,
  }));

  const targetRoomDetails = availableRoomsData.find((item) => item.roomType?.uuid === selectedRoomUuid);
  const maxAvailableRooms = targetRoomDetails?.totalRooms ?? 10;

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
    if (setSelectedData) setSelectedData(null);
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
          roomType: { uuid: values.roomTypeUuid },
          ratePlans: [{ id: values.ratePlanId, totalRooms: values.totalRooms }],
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

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      size={650}
      title={
        <div className="flex justify-between items-center">
          <span className={`font-semibold text-lg text-slate-800 ${textWhiteInDarkStyle}`}>Create Room Information</span>
          <FormButtons onClick={() => form.submit()} mode={mode} isPending={createReservationRooms.isPending} />
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex items-end gap-6 w-full mb-6">
          <Form.Item
            label="Stay Duration (Arrival - Departure)"
            name="dates"
            className="w-3/4 mb-0"
            rules={[{ required: true, message: "Please pick duration dates" }]}
          >
            <RangePicker className="w-full"  showTime format="YYYY-MM-DD" disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item className={`w-1/5 mb-0 bg-gray-200 rounded ${darkModeStyle} dark:!shadow-lg dark:shadow-gray-900 dark:border dark:border-gray-100`}>
            <div className="flex items-center gap-2 px-2 py-1 ml-3">
              <FaMoon className="text-xs" />
              <span className="text-xs font-bold whitespace-nowrap">
                {`${totalNight} ${totalNight === 1 ? "Night" : "Nights"}`}
              </span>
            </div>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Room Type"
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
              placeholder={selectedRoomUuid ? "Select Room Rate Plan" : "Choose Room Type First"}
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
              mode="spinner"
              min={1}
              max={maxAvailableRooms}
              placeholder="Quantity"
              style={{ width: "100%" }}
              readOnly={!selectedRoomUuid}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default RoomInformationForm;