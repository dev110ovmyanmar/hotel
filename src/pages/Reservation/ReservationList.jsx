import React, { useState } from "react";
import { Button, Card, DatePicker, Divider, Select, Table, Tag, TimePicker } from "antd";
import ReservationHeader from "./ReservationHeader";
import ReservationMenu from "./ReservationMenu";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import RoomBookedDrawer from "./RoomBookedDrawer";
import CreateGuestForm from "./CreateGuestForm";
import { MdOutlineEscalatorWarning, MdPeopleOutline } from "react-icons/md";
import GuestInformationTable from "./GuestInformationTable";
import ReservationForm from "./ReservationForm";

const ReservationList = () => {
  const [roomBookOpen, setRoomBookOpen] = useState(false);
  const [guestDrawerOpen, setGuestDrawerOpen] = useState(false);
  const [roomConfirm, setRoomConfirm] = useState(false);
  const [guestInfoTable, setGuestInfoTable] = useState(false);
  const [searchReservation, setSearchReservation] = useState(false);
  const [refreshReservation, setRefreshReservation] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  console.log(selectedData,"SelectedData")

  const options = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];

  const columns = [
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",

      render: (text, row, index) => {
        return {
          children: text,

          props: {
            rowSpan: row.rowSpan,
          },
        };
      },

    },

    {
      title: "Room",
      dataIndex: "room",
      render: (value) => (
        <Select
          defaultValue={value}
          options={options}
          className="w-20"
        />
      ),
    },

    {
      title: "Rate & Prices",
      dataIndex: "rateAndPrices",
      render: (value) => (
        <div>
          <p>{value[0]}</p>
          <p className="text-gray-500 text-sm">
            {value[1]}
          </p>
        </div>
      ),
    },

    {
      title: "Adult",
      dataIndex: "adult",
      render: (value) => (
        <Select
          defaultValue={value}
          options={options}
          className="w-20"
        />
      ),
    },
    {
      title: "Child",
      dataIndex: "child",
      render: (value) => (
        <Select
          defaultValue={value}
          options={options}
          className="w-20"
        />
      ),
    },

    {
      title: "Extra Bed",
      dataIndex: "extraBed",
      render: (value) => (
        <Select
          defaultValue={value}
          options={options}
          className="w-20"
        />
      ),
    },
    {
      title: "",
      render: (_, record, index) => {
        const isRoomBooked = (key) => {
          return selectedData.some(item => item.key === key);
        };

        return (

          <Button
            className={
              isRoomBooked(record?.key) ? "" : "!border-blue-500 !text-blue-500"
            }
            type={isRoomBooked(record?.key) ? "primary" : "default"}
            onClick={() => {
              return (

                setSelectedData((prev) => {
                  if (isRoomBooked(record?.key)) {
                    return prev.filter((item) => item.key !== record.key);
                  } else {
                    return [...prev, record];
                  }
                })
              )
            }
            }
          >
            Booked
          </Button >
        )
      },
    },

  ];

  const dataSource = [
    {
      key: "1",
      roomType: "Delux",
      rowSpan: 2,
      room: "1",
      rateAndPrices: ["125,000 MMK", "Standard Rate"],
      adult: "2",
      child: "1",
      extraBed: "1",
    },
    {
      key: "2",
      roomType: "Delux",
      rowSpan: 0,
      room: "2",
      rateAndPrices: ["125,000 MMK", "Standard Rate"],
      adult: "2",
      child: "1",
      extraBed: "1",
    },
    {
      key: "3",
      roomType: "Delux One",
      rowSpan: 1,
      room: "2",
      rateAndPrices: ["125,000 MMK", "Standard Rate"],
      adult: "2",
      child: "1",
      extraBed: "1",
    },
    {
      key: "4",
      roomType: "Delux Two",
      rowSpan: 1,
      room: "2",
      rateAndPrices: ["125,000 MMK", "Standard Rate"],
      adult: "2",
      child: "1",
      extraBed: "1",
    },
  ];

  return (
    <div className="w-full px-6 py-2">
      {/* <ReservationHeader /> */}
      {/* <ReservationMenu /> */}

      <div className="flex justify-end mb-3">
        <Button className="!border-blue-500"
          onClick={() => {
            // setRefreshReservation(true),
            setSearchReservation(false);
            setRoomConfirm(false);
            setGuestInfoTable(false);
          }}
        >
          <ReloadOutlined className="!text-blue-500" />
          <span className="!text-blue-500" >Refresh</span>
        </Button>
      </div>

      <ReservationForm onSearch={() => {setSearchReservation(true)}} afterRoomConfirm={roomConfirm}/>

      {
        refreshReservation &&
        (
          <ReservationForm onSearch={() => setSearchReservation(true)} afterRoomConfirm={roomConfirm}/>
        )
      }

      {
        roomConfirm ?
          <>
            {selectedData.map((i) => (
              <Card className="!my-3" key={i?.key}>
                <div className="flex justify-between">
                  <div className="flex">
                    <p className="mb-3">{i?.roomType}</p>
                  </div>
                  <div>
                    <Tag color="blue">{i?.room} Room</Tag>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex mr-3">
                    <MdPeopleOutline />
                    <span className="text-xs ml-1">{i.adult}</span>
                  </div>
                  <div className="flex">
                    <MdOutlineEscalatorWarning />
                    <span className="text-xs ml-1">{i?.child}</span>
                  </div>

                  <div className="text-xs text-gray-400 mx-2">|</div>

                  <div>{i?.extraBed} Extra Bed</div>
                </div>

                <Divider />

                <div className="flex justify-between">
                  <p>{i?.rateAndPrices[1]}</p>
                  <p className="font-bold">{i?.rateAndPrices[0]}</p>
                </div>
              </Card>
            ))}

            <Card>
              <h1 className="text-lg font-bold my-2">Guest Information</h1>

              {
                guestInfoTable ?
                  <GuestInformationTable
                    guestInfoTable={guestInfoTable}
                    setGuestInfoTable={setGuestInfoTable}
                  /> :
                  null
              }


              <Button type="primary" onClick={() => setGuestDrawerOpen(true)} className="my-4">
                Add Guest
                <PlusOutlined />
              </Button>

            </Card>

            <Button className="float-end my-5 !px-10" type="primary">Submit</Button>
          </>

          :

          searchReservation ?
            (
              <Card className="!my-3">
                <h1 className="text-lg font-bold my-2">Room Details</h1>

                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                />

                <div className="my-5">
                  <span className="text-red-500">***</span>
                  <span>Children under 6 years stay free in existing bedding; children aged 6 to must use and extra bed.</span>
                </div>

                <div className="flex justify-end">
                  <Button type="primary" onClick={() => setRoomBookOpen(true)}>View Room Booked</Button>
                </div>
              </Card>
            )
            :
            null
      }


      <CreateGuestForm
        guestDrawerOpen={guestDrawerOpen}
        setGuestDrawerOpen={setGuestDrawerOpen}
        guestInfoTable={guestInfoTable}
        setGuestInfoTable={setGuestInfoTable}
      />

      <RoomBookedDrawer
        roomBookOpen={roomBookOpen}
        setRoomBookOpen={setRoomBookOpen}
        roomConfirm={roomConfirm}
        setRoomConfirm={setRoomConfirm}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div >
  );
};

export default ReservationList;

