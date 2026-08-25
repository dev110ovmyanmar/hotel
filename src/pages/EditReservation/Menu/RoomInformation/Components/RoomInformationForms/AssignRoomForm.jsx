import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Drawer,
  Button,
  DatePicker,
  Select,
  Divider,
  Alert,
  Tag,
} from "antd";
import dayjs from "dayjs";
import GetRoomForm from "./GetRoomForm";
import {
  reservationMeta,
  reservationRoomMeta,
} from "../../../../../../api/reservationSectionApi";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useLocation } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { borderDarkMode, darkModeStyle } from "../../../../../../utils";

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
  const uuid = reservationUuid?.reservation?.uuid;
  const [form] = Form.useForm();
  const isView = mode === "view";
  const isAdd = mode === "add";
  const [showRoomResults, setShowRoomResults] = useState(false);
  const [searchKey, setSearchKey] = useState(0);

  const currentRoomNo = selectedData?.roomNo || selectedData?.room?.roomNo;

  const handleRoomSelection = (room) => {
    setSelectedData({ ...selectedData, roomNo: room.roomNo });
  };

  const { data: reservationRoom } = useApiQuery({
    fetchQueryName: "reservationRoom",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: { uuid: uuid },
      reservationRoom: { uuid: selectedData?.uuid },
    },
  });

  const floors =
    reservationRoom?.floors?.map((floor) => ({
      value: floor.uuid,
      label: `${floor.name} (${floor.floorNo})`,
    })) || [];

  const dates = Form.useWatch("dates", form);

  const calculateNights = () => {
    const [checkIn, checkOut] = dates || [];

    if (checkIn && checkOut) {
      const diff = dayjs(checkOut)
        .startOf("day")
        .diff(dayjs(checkIn).startOf("day"), "day");
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

  const handleSearch = () => {
    setShowRoomResults(true);
    setSearchKey(Date.now());
  };

  const handleFormValuesChange = (changedValues) => {
    if ("floorUuid" in changedValues || "dates" in changedValues) {
      setShowRoomResults(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={650}
      title={currentRoomNo ? "Change Assigned Room" : "Assign Room"}
      destroyOnClose
    >
      <div className="flex flex-col gap-6">
        <div className="border border-gray-200 rounded px-4 py-2">
          <Form
            form={form}
            layout="vertical"
            disabled={isView}
            onValuesChange={handleFormValuesChange}
          >
            <Form.Item label="Stay Duration (Check-in - Check-out)">
              <div className="flex items-center gap-3">
                <Form.Item name="dates" noStyle>
                  <RangePicker
                    className="flex-1"
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                  />
                </Form.Item>

                <div
                  className={`flex items-center justify-center gap-1.5 bg-gray-200 rounded px-3 h-[32px] min-w-[100px] ${darkModeStyle}`}
                >
                  <FaMoon className=" text-xs" />
                  <span className="font-bold text-black text-center text-xs">
                    {calculateNights()}{" "}
                    {calculateNights() === 1 ? "Night" : "Nights"}
                  </span>
                </div>
              </div>
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item label="Room Type" name={["roomType", "name"]}>
                <Input readOnly />
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
                    allowClear
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
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </Form>
        </div>

        {currentRoomNo && (
          <Alert
            title={
              <span>
                Currently assigned to Room:
                <Tag color="blue" className="font-bold text-lg ml-1">
                  {currentRoomNo}
                </Tag>
              </span>
            }
            type="info"
            showIcon
          />
        )}
        {showRoomResults && (
          <div>
            <Divider titlePlacement="left">Available Rooms</Divider>
            <GetRoomForm
              key={searchKey}
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
