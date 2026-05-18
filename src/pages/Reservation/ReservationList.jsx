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
import { queryClient } from "../../app/queryClient";
import RoomDetailsTable from "./RoomDetailsTable";
import RoomConfirmFinish from "./RoomConfirmFinish";

const ReservationList = () => {

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const currencyUuid = initData?.property?.currency?.uuid;

  const bookedViaOptions = initData?.statuses?.booked_via.map((item) => ({
    label: item.name,
    value: item.uuid,
  })) || [];

  const sourceTypeOptions = initData?.statuses?.source_type.map((item) => ({
    label: item.name,
    value: item.uuid,
  })) || [];

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [createContactForm] = Form.useForm();
  const [roomBookOpen, setRoomBookOpen] = useState(false);
  const [guestDrawerOpen, setGuestDrawerOpen] = useState(false);
  const [roomConfirm, setRoomConfirm] = useState(false);
  const [guestInfoTable, setGuestInfoTable] = useState(false);
  const [searchReservation, setSearchReservation] = useState(false);
  const [searchButtonDisable, setSearchButtonDisable] = useState(false);

  const [storeData, setStoreData] = useState(null);

  const [selectedData, setSelectedData] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [roomBookValues, setRoomBookValues] = useState();
  const [reservationFormValues, setReservationFormValues] = useState(null);
  const [contactPersonInfo, setContactPersonInfo] = useState();

  const [clickCreateContact, setClickCreateContact] = useState(false);
  const [createContactFinish, setCreateContactFinish] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);



  const defaultFilter = [
    dayjs().hour(14).minute(0),
    dayjs().add(1, "day").hour(12).minute(0)
  ];

  const availabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
    options: {
      onSuccess: (values) => {
        setStoreData(values);
        setSearchReservation(true);
        setSearchButtonDisable(true)
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
        setModalOpen(false)
      },
      onError: (error) => {
        setModalOpen(false)
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
        navigate("/reservations/inquery/")
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
      currency:{
        uuid: currencyUuid
      },
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
            className={remainingRooms <= 0 ? "!w-20 [&_.ant-select-content]:!text-gray-500 [$_.ant-select-input]:!text-gray-500" : "!w-20"}
            options={options}
            value={selectedRooms[record.key] || 1}
            disabled={remainingRooms <= 0}
            onChange={(val) => {
              setSelectedRooms((prev) => ({
                ...prev,
                [record.key]: val,
              }));
            }}
          />
        );
      },
    },
    {
      title: "Rate & Prices",
      dataIndex: "ratePlans",
      align: "center",
      render: (value, record) => (
        <div className="mb-2">
          <p>{value?.minPrice?.toLocaleString()} MMK</p>
          <p className="!text-gray-400 !text-sm">{value?.name}</p>
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
            className={getRemainingRooms(record) <= 0 ? "border-gray-100 !text-gray-300" : isBooked ? "" : "!border-blue-500 !text-blue-500"}
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
            setSearchButtonDisable(false);
            setClickCreateContact(false);
            // setSelectedSourceType(null);
            form.setFieldsValue({
              filter: defaultFilter,
              bookedVia: bookedViaOptions?.[0]?.value,
              sourceType: sourceTypeOptions?.[0]?.value,
            });
          }}
        >
          <ReloadOutlined className="!text-blue-500" />
          <span className="max-w-[125px] !text-blue-500" >Refresh</span>
        </Button>
      </div>

      <ReservationForm
        afterRoomConfirm={roomConfirm}
        availabilitySearchResults={availabilitySearchs}
        setReservationFormValues={setReservationFormValues}
        form={form}
        searchButtonDisable={searchButtonDisable}
        setSearchButtonDisable={setSearchButtonDisable}
        defaultFilter={defaultFilter}
        bookedViaOptions={bookedViaOptions}
        sourceTypeOptions={sourceTypeOptions}
      />

      {roomConfirm ? (
        <>
          <RoomConfirmFinish
            roomBookValues={roomBookValues}
          />

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
                onClick={() => {
                  setGuestDrawerOpen(true),
                  createContactForm.resetFields()
                }}
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
        <RoomDetailsTable
          columns={columns}
          dataSource={dataSource}
          selectedData={selectedData}
          getRemainingRooms={getRemainingRooms}
          viewRoomBookedMutate={viewRoomBookedMutate}
          rateQuotes={rateQuotes}
        />
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
        createContactForm={createContactForm}
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
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}

      />
    </div>
  );
};

export default ReservationList;
