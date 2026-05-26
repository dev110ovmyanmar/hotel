import React, { useEffect, useState } from "react";
import { Form, Input, Drawer, Button, DatePicker, Select, Divider } from "antd";
import dayjs from "dayjs";
import GetRoomForm from "./GetRoomForm";
import {
  reservationMeta,
  reservationRoomMeta,
} from "../../../../../../api/reservationSectionApi";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;

const AssignRoomForm = ({
  data,
  mode,
  open,
  onClose,
  selectedData,
  setSelectedData,
  onSuccess,
  reservationUuid,
}) => {
  const uuid = reservationUuid?.uuid;

  const [form] = Form.useForm();
  const isView = mode === "view";
  const isAdd = mode === "add";
  const [showRoomResults, setShowRoomResults] = useState(false);

  const handleRoomSelection = (room) => {
    console.log(room, "Roomselected");
    setSelectedData({ ...selectedData, roomNo: room.roomNo });
  };

  const { data: reservationRoom } = useApiQuery({
    fetchQueryName: "reservationRoom",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: uuid,
      },
      reservationRoom: {
        uuid: selectedData?.uuid,
      },
    },
  });

  const floors =
    reservationRoom?.floors?.map((floor) => ({
      value: floor.uuid,
      label: `${floor.name} (${floor.floorNo})`,
    })) || [];

  const dates = Form.useWatch("dates", form);

  const calculateNights = () => {
    if (dates && dates[0] && dates[1]) {
      const diff = dayjs(dates[1]).diff(dayjs(dates[0]), "day");
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  useEffect(() => {
    if (open && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        dates: [
          selectedData.checkinDate ? dayjs(selectedData.checkinDate) : null,
          selectedData.checkoutDate ? dayjs(selectedData.checkoutDate) : null,
        ],
        floorUuid: selectedData?.floor?.uuid || selectedData?.floorUuid,
      });
      setShowRoomResults(false);
    }
  }, [selectedData, open, form]);

  // date boundary filter
  const disabledDate = (current) => {
    if (!current || !selectedData) return false;

    const today = dayjs().startOf("day");

    let arrivalLimit = selectedData.checkinDate
      ? dayjs(selectedData.checkinDate).startOf("day")
      : today;

    if (arrivalLimit.isBefore(today, "day")) {
      arrivalLimit = today;
    }

    const departureLimit = selectedData.checkoutDate
      ? dayjs(selectedData.checkoutDate).endOf("day")
      : null;

    const isBeforeArrival = current.isBefore(arrivalLimit, "day");
    const isAfterDeparture = departureLimit
      ? current.isAfter(departureLimit, "day")
      : false;

    return isBeforeArrival || isAfterDeparture;
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={650}
      title="Assign Room"
      destroyOnClose
    >
      <div className="flex flex-col gap-6">
        <div className="border border-gray-200 rounded px-4 py-2">
          <Form form={form} layout="vertical" disabled={isView}>
            <Form.Item label="Stay Duration (Check-in - Check-out)">
              <div className="flex items-center gap-3">
                <Form.Item name="dates" noStyle>
                  <RangePicker
                    className="flex-1"
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <div className="flex flex-col items-center justify-center bg-gray-300 rounded px-3 h-[32px] min-w-[120px] border border-gray-300">
                  <span className="font-medium text-black disabled:text-black text-center leading-none">
                    {calculateNights()}{" "}
                    <span className="font-medium text-black disabled:text-black text-center">
                      {calculateNights() === 1 ? "Night" : "Nights"}
                    </span>
                  </span>
                </div>
              </div>
            </Form.Item>
           

            <div className="grid grid-cols-2 gap-6">
              <Form.Item label="Room" name={["roomType", "name"]}>
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Floor"
                name="floorUuid"
                getValueProps={(value) => ({
                  value: isView
                    ? floors.find((item) => item.value === value)?.label
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
                    options={floors}
                    placeholder="Select Floor"
                  />
                )}
              </Form.Item>
            </div>

            <div className="flex justify-end mt-4">
              <Button type="primary" onClick={() => setShowRoomResults(true)}>
                Search
              </Button>
            </div>
          </Form>
        </div>

        {showRoomResults && (
          <div className="mt-4">
            <Divider orientation="left">Available Rooms</Divider>
            <GetRoomForm
              open={showRoomResults}
              onClose={onClose}
              selectedData={selectedData}
              onSelectRoom={handleRoomSelection}
              setSelectedData={setSelectedData}
              floorUuid={form.getFieldValue("floorUuid")}
            />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default AssignRoomForm;
