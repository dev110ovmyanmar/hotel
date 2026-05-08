import React, { useState } from "react";
import { Button, Card, Divider, Form, Select, Table, Tag } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import RoomBookedDrawer from "./RoomBookedDrawer";
import CreateContactPerson from "./CreateContactPerson";
import { MdOutlineEscalatorWarning, MdPeopleOutline } from "react-icons/md";
import GuestInformationTable from "./GuestInformationTable";
import ReservationForm from "./ReservationForm";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApiMutation";
import { availabilitySearch, createReservation, rateQuote } from "../../api/reservationSectionApi";
import Toast from "../../component/Toast/Toast";
import dayjs from "dayjs";
import { upsertGuest } from "../../api/guestApi";
import store from "../../app/store";

const ReservationList = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [roomBookOpen, setRoomBookOpen] = useState(false);
  const [guestDrawerOpen, setGuestDrawerOpen] = useState(false);
  const [roomConfirm, setRoomConfirm] = useState(false);
  const [guestInfoTable, setGuestInfoTable] = useState(false);
  const [searchReservation, setSearchReservation] = useState(false);

  const [storeData, setStoreData] = useState(null);

  const [selectedData, setSelectedData] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [roomBookValues, setRoomBookValues] = useState();
  const [reservationFormValues, setReservationFormValues] = useState(null);
  const [contactPersonInfo, setContactPersonInfo] = useState();

  const [clickCreateContact, setClickCreateContact] = useState(false);
  const [createContactFinish, setCreateContactFinish] = useState(false);

  const availabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
    options: {
      onSuccess: (values) => {
        setStoreData(values);
        setSearchReservation(true);
      },
    },
  });


  const rateQuotes = useApiMutation({
    mutationFn: rateQuote,
    invalidateKeys: [["rate-quote"]],
    options: {
      onSuccess: (values) => {
        setRoomBookOpen(true);
        setRoomBookValues(values);
      },
    },
  });

  const upsertMutation = useApiMutation({
    mutationFn: upsertGuest,
    // invalidateKeys: [["guests"]],
    options: {
      onSuccess: (values) => {
        Toast.success("Create Contact Preson successfully");
        setGuestDrawerOpen(false);
        setGuestInfoTable(true);
        setClickCreateContact(true);
        setContactPersonInfo(values)
      },
    },
  });

  const submitReservationMutate = useApiMutation({
    mutationFn: createReservation,
    options: {
      onSuccess: (values) => {
        Toast.success(values);
        navigate("/reservation/inquiry/")
      },
    },
  });

  const viewRoomBookedMutate = () => {
    if (!selectedData.length) {
      Toast.error("Please select at least one room");
      return;
    }

    const groupedRooms = Object.values(
      selectedData.reduce((acc, item) => {
        const roomTypeUuid = item.roomTypeUuid;
        if (!acc[roomTypeUuid]) {
          acc[roomTypeUuid] = {
            roomType: {
              uuid: roomTypeUuid,
            },
            ratePlans: [],
          };
        }

        acc[roomTypeUuid].ratePlans.push({
          id: item.ratePlans.id,
          totalRooms: item.selectedRoomCount,
        });

        return acc;
      }, {})
    );

    const payload = {

      filter: {
        checkinDate: dayjs(reservationFormValues?.filter?.[0]).format("YYYY-MM-DD"),
        checkoutDate: dayjs(reservationFormValues?.filter?.[1]).format("YYYY-MM-DD"),
      },
      bookedVia: {
        uuid: reservationFormValues?.bookedVia,
      },
      sourceType: {
        uuid: reservationFormValues?.sourceType,
      },
      source: {
        uuid: reservationFormValues?.source,
      },
      totalNight: reservationFormValues?.totalNight,

      rooms: groupedRooms

    };

    rateQuotes.mutate(payload);
  };

  const submitReservation = () => {

    const rooms = roomBookValues?.rooms.map((room) => ({
      roomType: {
        uuid: room.roomType.uuid
      },

      subTotal: room.subTotal,
      taxTotal: room.taxTotal,
      discountTotal: room.discountTotal,
      grandTotal: room.grandTotal,

      ratePlans: room.ratePlans.map((rate) => ({
        id: rate.id,
        totalRooms: rate.totalRooms,
        totalPrice: rate.totalPrice
      }))
    }));

    const payload = {

      filter: {
        checkinDate: dayjs(reservationFormValues?.filter?.[0]).format("YYYY-MM-DD"),
        checkoutDate: dayjs(reservationFormValues?.filter?.[1]).format("YYYY-MM-DD"),
      },
      bookedVia: {
        uuid: reservationFormValues?.bookedVia,
      },
      sourceType: {
        uuid: reservationFormValues?.sourceType,
      },
      source: {
        uuid: reservationFormValues?.source,
      },
      totalNight: reservationFormValues?.totalNight,
      guest: {
        uuid: contactPersonInfo?.uuid
      },
      subTotal: roomBookValues?.subTotal,
      taxTotal: roomBookValues?.taxTotal,
      discountTotal: roomBookValues?.discountTotal,
      grandTotal: roomBookValues?.grandTotal,
      rooms

    };
    submitReservationMutate.mutate(payload);
  }


  //total booked rooms per roomType
  const getBookedCount = (roomTypeId) => {
    return selectedData
      .filter((item) => item.roomTypeId === roomTypeId)
      .reduce((sum, item) => sum + (item.selectedRoomCount || 1), 0);
  };

  //remaining rooms
  const getRemainingRooms = (record) => {
    const booked = getBookedCount(record.roomTypeId);
    return record.totalRooms - booked;
  };

  const columns = [
    {
      title: "Room Type",
      dataIndex: "roomType",
      render: (text, row) => ({
        children: text,
        props: { rowSpan: row.rowSpan },
      }),
    },
    {
      title: "Room",
      dataIndex: "totalRooms",
      render: (value, record) => {
        const remainingRooms = getRemainingRooms(record);

        const options = Array.from(
          { length: remainingRooms > 0 ? remainingRooms : 0 },
          (_, i) => ({
            label: i + 1,
            value: i + 1,
          }),
        );

        return (
          <Select
            options={options}
            value={selectedRooms[record.key] || 1}
            disabled={remainingRooms <= 0}
            onChange={(val) => {
              setSelectedRooms((prev) => ({
                ...prev,
                [record.key]: val,
              }));
            }}
            className="w-20"
          />
        );
      },
    },
    {
      title: "Rate & Prices",
      dataIndex: "ratePlans",
      align: "center",
      render: (value) => (
        <div className="mb-2">
          <p>{value?.minPrice?.toLocaleString()} MMK</p>
          <p className="text-gray-500 text-sm">{value?.name}</p>
        </div>
      ),
    },
    {
      title: "Adult",
      dataIndex: "adults",
    },
    {
      title: "Extra Bed",
      dataIndex: "extraBed",
    },
    {
      title: "",
      render: (_, record) => {
        const isBooked = selectedData.some((item) => item.key === record.key);

        return (
          <Button
            className={isBooked ? "" : "!border-blue-500 !text-blue-500"}
            type={isBooked ? "primary" : "default"}
            disabled={!isBooked && getRemainingRooms(record) <= 0} // disable if no rooms left
            onClick={() => {
              const selectedCount = selectedRooms[record.key] || 1;
              const remainingRooms = getRemainingRooms(record);

              if (!isBooked && selectedCount > remainingRooms) {
                Toast.error("Not enough rooms available");
                return;
              }

              setSelectedData((prev) => {
                if (isBooked) {
                  return prev.filter((item) => item.key !== record.key);
                } else {
                  return [
                    ...prev,
                    {
                      ...record,
                      selectedRoomCount: selectedCount,
                    },
                  ];
                }
              });
            }}
          >
            Booked
          </Button>
        );
      },
    },
  ];


  const dataSource = storeData?.rooms?.flatMap((room) =>
    room.ratePlans.map((rate, index) => ({
      key: `${room.roomType.id}-${rate.id}-${index}`,
      roomType: room.roomType.name,
      roomTypeId: room.roomType.id, //important for counting booked rooms
      totalRooms: room.totalRooms,
      ratePlans: rate,
      adults: room.adults,
      extraBed: room.extraBed,
      rowSpan: index === 0 ? room.ratePlans.length : 0,
      roomTypeUuid: room.roomType.uuid,
    })),
  );

  return (
    <div className="w-full px-6">
      <div className="flex justify-end mb-3">
        <Button
          className="!border-blue-500"
          onClick={() => {
            setSearchReservation(false);
            setRoomConfirm(false);
            setGuestInfoTable(false);
            setSelectedData([]);
            setSelectedRooms({});
            setReservationFormValues(null);
            form.resetFields()

          }}
        >
          <ReloadOutlined className="!text-blue-500" />
          <span className="!text-blue-500">Refresh</span>
        </Button>
      </div>

      <ReservationForm
        afterRoomConfirm={roomConfirm}
        availabilitySearchResults={availabilitySearchs}
        setReservationFormValues={setReservationFormValues}
        // reservationFormField={reservationFormField}
        form={form}

      />

      {roomConfirm ? (
        <>
          {roomBookValues?.rooms?.map((i) => (
            <Card className="!my-3" >
              <div className="flex justify-between">
                <p>{i?.roomType?.name}</p>
                <Tag color="blue">{i?.totalRooms} Room</Tag>
              </div>

              <div className="flex">
                <MdPeopleOutline fontSize={19} className="mt-1" />
                <span className="text-md ml-1 mt-1">{i.adults}</span>

                {/* <MdOutlineEscalatorWarning className="ml-3" />
                <span className="ml-1 text-xs">{i.child}</span> */}

                <div className="text-lg text-gray-400 mx-2">|</div>
                <div className="!text-md ml-1 mt-1">{i.extraBed} Extra Bed</div>
              </div>

              <Divider />

              {
                i?.ratePlans?.map((rate) =>
                  <div className="flex justify-between">
                    <p>{rate?.name}</p>
                    <p className="font-bold">{rate?.totalPrice?.toLocaleString()} MMK</p>
                  </div>
                )
              }
            </Card>
          ))}

          <Card className="!my-3">
            <h1 className="text-lg font-bold my-2">Contact Person</h1>

            {guestInfoTable && (
              <GuestInformationTable
                guestInfoTable={guestInfoTable}
                setGuestInfoTable={setGuestInfoTable}
                contactPersonInfo={contactPersonInfo}
                setContactPersonInfo={setContactPersonInfo}

              />
            )}

            {!clickCreateContact && (
              <Button
                type="primary"
                onClick={() => setGuestDrawerOpen(true)}
                className="my-4"
              >
                Add Contact Person <PlusOutlined />
              </Button>
            )}
          </Card>

          {
            createContactFinish &&
            <div className="flex justify-end">
              <Button
                className="!my-5 !px-10"
                type="primary"
                onClick={submitReservation}
              >
                Submit
              </Button>
            </div>
          }
        </>
      ) : searchReservation ? (
        <Card className="!my-3">
          <h1 className="text-lg font-bold my-2">Room Details</h1>

          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowClassName={(record) => {
              const isBooked = selectedData.some(
                (item) => item.key === record.key,
              );
              const remainingRooms = getRemainingRooms(record);
              return !isBooked && remainingRooms <= 0
                ? "opacity-50 grayscale bg-gray-50"
                : "";
            }}
          />

          <div className="my-5">
            <span className="text-red-500">*** </span>
            <span>
              Children under 6 years stay free in existing bedding; children
              aged 6+ must use extra bed.
            </span>
          </div>

          <div className="flex justify-end">
            <Button type="primary" onClick={viewRoomBookedMutate} loading={rateQuotes?.isPending}>
              View Room Booked
            </Button>
          </div>
        </Card>
      ) : null}

      <CreateContactPerson
        guestDrawerOpen={guestDrawerOpen}
        setGuestDrawerOpen={setGuestDrawerOpen}
        guestInfoTable={guestInfoTable}
        setGuestInfoTable={setGuestInfoTable}
        clickCreateContact={clickCreateContact}
        setClickCreateContact={setClickCreateContact}
        upsertMutation={upsertMutation}
        createContactFinish={createContactFinish}
        setCreateContactFinish={setCreateContactFinish}
      />

      <RoomBookedDrawer
        roomBookOpen={roomBookOpen}
        setRoomBookOpen={setRoomBookOpen}
        roomConfirm={roomConfirm}
        setRoomConfirm={setRoomConfirm}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        roomBookValues={roomBookValues}
        setRoomBookValues={setRoomBookValues}
        rateQuotes={rateQuotes}

      />
    </div>
  );
};

export default ReservationList;
