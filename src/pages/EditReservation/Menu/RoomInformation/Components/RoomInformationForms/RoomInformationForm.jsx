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
  reservationRoomDetails,
} from "../../../../../../api/reservationSectionApi";
import Toast from "../../../../../../component/Toast/Toast";
import { FaMoon } from "react-icons/fa";

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

  const reservationRoomsDetails = useApiMutation({
    mutationFn: reservationRoomDetails,
    // invalidateKeys: [["reservation-room"]],
  });

  const availableRoomsData = roomAvailabilitySearchs.data?.rooms || [];

  // Fetch view details on drawer open
  useEffect(() => {
    if (drawerOpen && isView && selectedData?.uuid) {
      reservationRoomsDetails.mutate({ uuid: selectedData.uuid });
    }
  }, [drawerOpen, isView, selectedData]);

  // Populate view mode data
  useEffect(() => {
    if (isView && reservationRoomsDetails.data) {
      const viewData = reservationRoomsDetails.data;
      form.setFieldsValue({
        dates: [
          viewData?.checkinDate ? dayjs(viewData.checkinDate) : null,
          viewData?.checkoutDate ? dayjs(viewData.checkoutDate) : null,
        ],
        roomTypeUuid: viewData?.roomType?.uuid || null,
        ratePlanId: viewData?.ratePlan?.id || null,
        totalRooms: viewData?.totalRooms || 1,
      });
    }
  }, [isView, reservationRoomsDetails.data, form]);

  // initial  form value
  useEffect(() => {
    if (drawerOpen && data && !isView) {
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

      const checkoutDateObj = data?.actualCheckout
        ? dayjs(data?.actualCheckout)
        : null;
      let finalCheckout = null;

      if (checkoutDateObj) {
        if (checkoutDateObj.isBefore(today, "day")) {
          finalCheckout = Day;
        } else {
          finalCheckout = checkoutDateObj.format("YYYY-MM-DD");
        }
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
  }, [drawerOpen, data, form, isView]);

  // date change / api
  useEffect(() => {
    if (drawerOpen && !isView && selectedDates?.[0] && selectedDates?.[1]) {
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
  }, [drawerOpen, selectedDates, data, isView]);

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

    //date disable
    const isBeforeArrival = current.isBefore(arrivalLimit, "day");

    return isBeforeArrival;
  };

  const roomTypeOptions =
    isView && reservationRoomsDetails.data
      ? [
          {
            label: reservationRoomsDetails.data?.roomType?.name,
            value: reservationRoomsDetails.data?.roomType?.uuid,
          },
        ]
      : availableRoomsData.map((item) => ({
          label: `${item.roomType?.name} (${item.totalRooms} available)`,
          value: item.roomType?.uuid,
        }));

  const targetRoomDetails = availableRoomsData.find(
    (item) => item.roomType?.uuid === selectedRoomUuid,
  );

  const ratePlanOptions =
    isView && reservationRoomsDetails.data
      ? [
          {
            label:
              reservationRoomsDetails.data?.ratePlan?.name || "Selected Plan",
            value: reservationRoomsDetails.data?.ratePlan?.id,
          },
        ]
      : targetRoomDetails?.ratePlans
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
              : "Create Room Information"}
          </span>

          {isView ? (
            <Button className="custom-blue-btn" onClick={handleClose}>
              Close
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
        {/* <div className="border border-gray-200 rounded px-4 py-2"> */}
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
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
              />
            </Form.Item>

            <Form.Item className="w-1/5 mb-0 bg-gray-200 rounded">
              <div className="flex items-center gap-2 px-2 py-1.5 ml-3">
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
                loading={
                  roomAvailabilitySearchs.isPending ||
                  reservationRoomsDetails.isPending
                }
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
                disabled={!selectedRoomUuid || isView}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Form.Item
              label="Total Room"
              name="totalRooms"
              rules={[
                { required: true, message: "Please input total rooms" },
                ...(!isView
                  ? [
                      {
                        type: "number",
                        max: maxAvailableRooms,
                        message: `Cannot exceed available rooms (${maxAvailableRooms})`,
                      },
                    ]
                  : []),
              ]}
            >
              <InputNumber
                {...sharedProps}
                min={1}
                max={isView ? undefined : maxAvailableRooms}
                placeholder="Quantity"
                readOnly={isView}
                style={{ width: "100%" }}
                disabled={!selectedRoomUuid || isView}
              />
            </Form.Item>
          </div>
        {/* </div> */}
      </Form>
    </Drawer>
  );
};

export default RoomInformationForm;
