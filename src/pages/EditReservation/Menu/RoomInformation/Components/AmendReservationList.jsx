import React from "react";
import {
  EditOutlined,
  CalendarOutlined,
  PlusOutlined,
  MinusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MdOutlineMeetingRoom } from "react-icons/md";
import dayjs from "dayjs";
import { queryClient } from "../../../../../app/queryClient";

export const getAmendReservationMenuItems = ({
  record,
  handleAction,
  setRoomMoveOpen,
  setRoomUpgrade,
  setRoomDowngrade,
  setAddRoomWithStayExtension,
  setRatePlanUuid,
  setGuestOpen,
  setSelectedData,
}) => {
  if (!record?.amendStatus) return [];
  const hasRoom = record?.room;

  const isCheckoutToday = record?.checkoutDate
    ? dayjs(record.checkoutDate).isSame(dayjs(), "day")
    : false;

  const checkDisabled = (actionKey) => {
    if (isCheckoutToday) {
      return !["stay_extension", "add_room"].includes(actionKey);
    }
    return false;
  };

  const getDisabledStyles = (actionKey) => {
    if (checkDisabled(actionKey)) {
      return {
        style: { color: "#a2a0a0", cursor: "not-allowed" },
      };
    }
    return {};
  };

  const confirmStatusDisabled = record?.roomStatus?.code !== "confirmed";
  return [
    { type: "divider" },
    {
      key: "modify_group",
      label: "Amend Reservation",
      icon: <EditOutlined />,
      children: [
        {
          key: "col_date",
          type: "group",
          label: "DATE CHANGES",
          children: [
            {
              key: "date_change",
              label: "Change CI/CO Dates",
              icon: <CalendarOutlined />,
              disabled: checkDisabled("date_change") ||
                confirmStatusDisabled,
              ...getDisabledStyles("date_change"),
              onClick: () =>
                !checkDisabled("date_change") &&
                handleAction("date_change", record),
              style: confirmStatusDisabled
                ? {
                  color: "#a2a0a0",
                  cursor: "not-allowed",
                }
                : {},
            },
            {
              key: "stay_extension",
              label: "Extend Stay",
              icon: <PlusOutlined />,
              disabled: checkDisabled("stay_extension"),
              ...getDisabledStyles("stay_extension"),
              onClick: () => handleAction("stay_extension", record),
            },
            {
              key: "stay_reduction",
              label: "Shorten Stay",
              icon: <MinusOutlined />,
              disabled: checkDisabled("stay_reduction"),
              ...getDisabledStyles("stay_reduction"),
              onClick: () =>
                !checkDisabled("stay_reduction") &&
                handleAction("stay_reduction", record),
            },
          ],
        },
        { type: "divider" },
        {
          key: "col_room",
          type: "group",
          label: "ROOM CHANGES",
          children: [
            {
              key: "room_move",
              label: "Change Room",
              icon: <MdOutlineMeetingRoom />,
              disabled: checkDisabled("room_move") || !hasRoom || dayjs(record?.checkoutDate).isSame(dayjs(), "day"),
              ...getDisabledStyles("room_move"),
              onClick: () => {
                if (!checkDisabled("room_move")) {
                  queryClient.removeQueries({
                    queryKey: ["reservation-room-search"],
                  });

                  handleAction("room_move", record);
                  setRoomMoveOpen(true);
                }
              },
              style: !hasRoom || dayjs(record?.checkoutDate).isSame(dayjs(), "day")
                ? {
                  color: "#a2a0a0",
                  cursor: "not-allowed",
                }
                : {},
            },
            {
              key: "room_upgrade",
              label: "Upgrade Room",
              icon: <ArrowUpOutlined />,
              // disabled: checkDisabled("room_upgrade") || record?.postedToFolio,
              disabled: checkDisabled("room_upgrade"),
              ...getDisabledStyles("room_upgrade"),
              onClick: () => {
                if (!checkDisabled("room_upgrade")) {
                  handleAction("room_upgrade", record);
                  setRoomUpgrade(true);
                  setRatePlanUuid(record?.ratePlan?.uuid);
                }
              },
              // style: record?.postedToFolio
              //   ? {
              //     color: "#a2a0a0",
              //     cursor: "not-allowed",
              //   }
              //   : {},
            },
            {
              key: "room_downgrade",
              label: "Downgrade Room",
              icon: <ArrowDownOutlined />,
              // disabled: checkDisabled("room_downgrade") || record?.postedToFolio,
              disabled: checkDisabled("room_downgrade"),
              ...getDisabledStyles("room_downgrade"),
              onClick: () => {
                if (!checkDisabled("room_downgrade")) {
                  handleAction("room_downgrade", record);
                  setRoomDowngrade(true);
                  setRatePlanUuid(record?.ratePlan?.uuid);
                }
              },
              // style: record?.postedToFolio
              //   ? {
              //     color: "#a2a0a0",
              //     cursor: "not-allowed",
              //   }
              //   : {},
            },
            {
              key: "add_room",
              label: "Add Room",
              icon: <PlusOutlined />,
              disabled: checkDisabled("add_room"),
              ...getDisabledStyles("add_room"),
              onClick: () => {
                handleAction("add_room", record);
                setAddRoomWithStayExtension(true);
                setRatePlanUuid(record?.ratePlan?.uuid);
              },
            },
            // {
            //   key: "remove_room",
            //   label: "Remove Room",
            //   icon: <MinusOutlined />,
            //   disabled: checkDisabled("remove_room"),
            //   ...getDisabledStyles("remove_room"),
            //   onClick: () =>
            //     !checkDisabled("remove_room") &&
            //     handleAction("remove_room", record),
            // },
          ],
        },
        { type: "divider" },
        {
          key: "col_rate",
          type: "group",
          label: "RATE / PRICE CHANGES",
          children: [
            {
              key: "rate_change",
              label: "Update Rates",
              icon: <DollarOutlined />,
              disabled: checkDisabled("rate_change") || record?.postedToFolio,
              ...getDisabledStyles("rate_change"),
              onClick: () =>
                !checkDisabled("rate_change") &&
                handleAction("rate_change", record),
              style: record?.postedToFolio
                ? {
                  color: "#a2a0a0",
                  cursor: "not-allowed",
                }
                : {},
            },
          ],
        },
        // { type: "divider" },
        // {
        //   key: "col_guest",
        //   type: "group",
        //   label: "GUEST / OCCUPANCY",
        //   children: [
        //     {
        //       key: "occupancy_change",
        //       label: "Update Room Guests",
        //       icon: <UserOutlined />,
        //       disabled: checkDisabled("occupancy_change"),
        //       ...getDisabledStyles("occupancy_change"),
        //       onClick: () => {
        //         if (!checkDisabled("occupancy_change")) {
        //           setSelectedData(record);
        //           setGuestOpen(true);
        //         }
        //       },
        //     },
        //     {
        //       key: "extra_bed_remove",
        //       label: "Remove Extra Bed",
        //       icon: <MinusOutlined />,
        //       disabled: checkDisabled("extra_bed_remove"),
        //       ...getDisabledStyles("extra_bed_remove"),
        //       onClick: () =>
        //         !checkDisabled("extra_bed_remove") &&
        //         handleAction("extra_bed_remove", record),
        //     },
        //   ],
        // },
      ],
    },
  ];
};
