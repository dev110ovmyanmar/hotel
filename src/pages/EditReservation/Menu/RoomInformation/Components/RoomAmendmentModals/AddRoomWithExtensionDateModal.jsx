import React, { useState } from "react";
import { Modal, Form, Input, Descriptions, Button, Divider, Space } from "antd";
import dayjs from "dayjs";
import {
  PlusOutlined,
  MinusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import AddRoomExtensionLikeUpgradeDesignModal from "./AddRoomExtensionLikeUpgradeDesignModal";
import {
  borderDarkMode,
  darkModeStyle,
  textWhiteInDarkStyle,
} from "../../../../../../utils";

export default function AddRoomWithExtensionDateModal({
  isOpen,
  extensionDateonClose,
  record,
  addRoomUuid,
  availabilitySearchs,
  reservation,
  ratePlanUuid,
}) {
  const [form] = Form.useForm();

  // States for step navigation and submission
  const [daysToAdd, setDaysToAdd] = useState(1);
  const [availabilitySearchRoomList, setAvailabilitySearchRoomList] = useState(false);
  const [backToExtensionStayDate, setBackToExtensionStayDate] = useState(false);

  // Parse baseline properties out of your JSON structure
  const reservationNo = reservation?.reservationNo || `ID-${record?.id}`;
  const guestName = reservation?.guest?.name || "Unknown Guest";
  const roomTypeName = record?.roomType?.name;

  const originalCheckin = record?.checkinDate ? dayjs(record.checkinDate) : "";
  const originalCheckout = record?.checkoutDate
    ? dayjs(record.checkoutDate)
    : "";

  const maxDayExtension =
    record?.maxExtend !== undefined ? Number(record.maxExtend) : 0;

  // Compute live mathematical timeline additions safely
  const newCheckoutDate = originalCheckout
    ? originalCheckout?.add(daysToAdd, "day")
    : dayjs();

  const totalNights = newCheckoutDate.diff(originalCheckout, "day", true);

  const handleAvailabilitySearchs = () => {
    const payload = {
      filter: {
        checkinDate: originalCheckout?.format("YYYY-MM-DD"),
        checkoutDate: newCheckoutDate?.format("YYYY-MM-DD"),
      },
      totalNight: totalNights,
      reservation: {
        uuid: reservation?.uuid,
      },
      room: {
        uuid: record?.room?.uuid ? record?.room?.uuid : null,
      },
    };
    availabilitySearchs.mutate(payload, {
      onSuccess: () => {
        setAvailabilitySearchRoomList(true);
        setBackToExtensionStayDate(false);
      },
    });
  };

  const handleCloseReset = () => {
    form.resetFields();
    setDaysToAdd(1);
    extensionDateonClose(false);
  };

  return (
    <>
      {(availabilitySearchRoomList || !backToExtensionStayDate) && (
        <AddRoomExtensionLikeUpgradeDesignModal
          isOpen={availabilitySearchRoomList}
          onClose={() => setAvailabilitySearchRoomList(false)}
          record={record}
          addRoomUuid={addRoomUuid}
          roomList={availabilitySearchs?.data}
          availabilitySearchsPendings={availabilitySearchs?.isPending}
          originalCheckout={originalCheckout}
          newCheckoutDate={newCheckoutDate}
          ratePlanUuid={ratePlanUuid}
          setBackToExtensionStayDate={setBackToExtensionStayDate}
          extensionDateonClose={extensionDateonClose}
          setDaysToAdd={setDaysToAdd}
        />
      )}

      {(!availabilitySearchRoomList || backToExtensionStayDate) && (
        <Modal
          title={
            <div className="flex items-center gap-2">
              <div className="h-[18px] w-1 rounded-sm bg-[#1677ff]" />
              <span className="font-semibold">
                Add New Room
              </span>
            </div>
          }
          open={isOpen}
          onCancel={handleCloseReset}
          width={520}
          footer={
            [
              <Button
                key="submit"
                type="primary"
                onClick={handleAvailabilitySearchs}
                disabled={maxDayExtension <= 0}
                loading={availabilitySearchs?.isPending}
              >
                Next
              </Button>,
            ]
          }
        >
          {/* Context Target Ribbon Header */}
          <div className="text-indigo-700 dark:text-indigo-500 font-semibold">
            {" "}
            {reservationNo}{" "}
            <span className={`text-slate-800 ${textWhiteInDarkStyle}`}>
              — {guestName}
            </span>
          </div>

          <Divider className="!my-2" />

          <Form form={form} layout="vertical">
            <div
              className={`bg-slate-50 p-4 rounded-lg mb-5 ${darkModeStyle}`}
            >
              <div className="flex justify-between items-center mb-2">
                <label
                  className={`block text-sm font-medium text-slate-600 ${textWhiteInDarkStyle}`}
                >
                  Provision Additional Days
                </label>
              </div>

              <Space size="middle" className="flex items-center">
                <Button
                  shape="circle"
                  icon={<MinusOutlined />}
                  onClick={() =>
                    setDaysToAdd((prev) => Math.max(1, prev - 1))
                  }
                  disabled={daysToAdd <= 1}
                />
                <span className="text-xl font-bold min-w-[30px] text-center inline-block">
                  {daysToAdd}
                </span>

                <Button
                  shape="circle"
                  icon={<PlusOutlined />}
                  onClick={() => setDaysToAdd((prev) => prev + 1)}
                />
                <span
                  className={`text-sm text-slate-500 font-medium ${textWhiteInDarkStyle}`}
                >
                  Extra Day(s)
                </span>
              </Space>
            </div>


            {/* Timeline Data Footer */}
            <div
              className={`bg-slate-50 p-3 px-4 rounded-lg mb-5 border border-slate-200 ${darkModeStyle} ${borderDarkMode}`}
            >
              <div className="text-xs ">
                Current Checkout -{" "}
                <strong className={`text-slate-700 ${textWhiteInDarkStyle}`}>
                  {originalCheckout
                    ? originalCheckout?.format("DD MMM YYYY")
                    : "-"}
                </strong>
              </div>
              {maxDayExtension !== 0 && (
                <div className="text-sm text-blue-600 mt-1">
                  New Checkout{" "}
                  <strong className="text-blue-700">
                    {newCheckoutDate.format("DD MMM YYYY")}
                  </strong>
                </div>
              )}
            </div>

            <Form.Item name="reason" label="Reason for Add Room">
              <Input.TextArea rows={3} placeholder="Reason for Add Room" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}
