import React, { useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Select,
  Table,
  Tag,
  TimePicker,
} from "antd";
import ReservationHeader from "./ReservationHeader";
import ReservationMenu from "./ReservationMenu";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import RoomBookedDrawer from "./RoomBookedDrawer";
import CreateContactPerson from "./CreateContactPerson";
import { MdOutlineEscalatorWarning, MdPeopleOutline } from "react-icons/md";
import GuestInformationTable from "./GuestInformationTable";
import ReservationForm from "./ReservationForm";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "../../hooks/useApiMutation";
import { availabilitySearch } from "../../api/availabilitySearchApi";
import Toast from "../../component/Toast/Toast";
import PriceTag from "../../component/PriceTag/PriceTag";

const ReservationList = () => {
  const navigate = useNavigate();
  const [roomBookOpen, setRoomBookOpen] = useState(false);
  const [guestDrawerOpen, setGuestDrawerOpen] = useState(false);
  const [roomConfirm, setRoomConfirm] = useState(false);
  const [guestInfoTable, setGuestInfoTable] = useState(false);
  const [searchReservation, setSearchReservation] = useState(false);
  const [refreshReservation, setRefreshReservation] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [clickCreateContact, setClickCreateContact] = useState(false);

  const availabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
    options: {
      onSuccess: (values) => {
        Toast.success("Availability search completed successfully");
        setStoreData(values);
        setSearchReservation(true);
      },
    },
  });


  const options = storeData?.rooms?.flatMap((item) => Array.from({ length: item.totalRooms }, (_, i) => ({
    label: i + 1,
    value: i + 1,
  })));


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
      dataIndex: "totalRooms",
      render: (value) => {
        const options = Array.from({ length: value }, (_, i) => ({
          label: i + 1,
          value: i + 1,
        }));
        return (
          <Select options={options} defaultValue={value} className="w-20" />
        )
      },

    },

    {
      title: "Rate & Prices",
      dataIndex: "ratePlans",
      align: "center",
      render: (value) => {
        return (
          <div key={value.key} className="mb-2">
            <p>{value?.minPrice.toLocaleString()} MMK</p>
            {/* <PriceTag value={item?.minPrice} /> */}
            <p className="text-gray-500 text-sm">{value?.name}</p>
          </div>
        )
      }
    },

    {
      title: "Adult",
      dataIndex: "adults",
      render: (value) => (
        <div>{value}</div>
      ),
    },
    {
      title: "Extra Bed",
      dataIndex: "extraBed",
      render: (value) => (
        <div>{value}</div>
      ),
    },
    {
      title: "",
      render: (_, record, index) => {
        const isRoomBooked = (key) => {
          return selectedData.some((item) => item.key === key);
        };

        return (
          <Button
            className={
              isRoomBooked(record?.key) ? "" : "!border-blue-500 !text-blue-500"
            }
            type={isRoomBooked(record?.key) ? "primary" : "default"}
            onClick={() => {
              return setSelectedData((prev) => {
                if (isRoomBooked(record?.key)) {
                  return prev.filter((item) => item.key !== record.key);
                } else {
                  return [...prev, record];
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

  const dataSource = storeData?.rooms?.flatMap((room) => {
    return (
      room.ratePlans.map((rate, index) => ({
        key: rate.key,
        roomType: room.roomType.name,
        totalRooms: room.totalRooms,
        ratePlans: rate,
        adults: room.adults,
        extraBed: room.extraBed,
        rowSpan: index === 0 ? room.ratePlans.length : 0,
      }))
    )
  }


  );

  return (
    <div className="w-full px-6">

      <div className="flex justify-end mb-3">
        <Button
          className="!border-blue-500"
          onClick={() => {
            // setRefreshReservation(true),
            setSearchReservation(false);
            setRoomConfirm(false);
            setGuestInfoTable(false);
          }}
        >
          <ReloadOutlined className="!text-blue-500" />
          <span className="!text-blue-500">Refresh</span>
        </Button>
      </div>

      <ReservationForm
        afterRoomConfirm={roomConfirm}
        availabilitySearchResults={availabilitySearchs}
      />

      {/* {refreshReservation && (
        <ReservationForm
          onSearch={() => setSearchReservation(true)}
          afterRoomConfirm={roomConfirm}
        />
      )} */}

      {roomConfirm ? (
        <>
          {storeData?.rooms?.map((i) => (
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
            <h1 className="text-lg font-bold my-2">Contact Person</h1>

            {guestInfoTable ? (
              <GuestInformationTable
                guestInfoTable={guestInfoTable}
                setGuestInfoTable={setGuestInfoTable}
              />
            ) : null}

            {clickCreateContact ? null : (
              <Button
                type="primary"
                onClick={() => setGuestDrawerOpen(true)}
                className="my-4"
              >
                Add Contact Person
                <PlusOutlined />
              </Button>
            )}
          </Card>

          <div className="flex justify-end">
            <Button
              className="!my-5 !px-10"
              type="primary"
              onClick={() => {
                navigate("/reservation/inquiry/");
              }}
            >
              Submit
            </Button>
          </div>
        </>
      ) : searchReservation ? (
        <Card className="!my-3">
          <h1 className="text-lg font-bold my-2">Room Details</h1>

          <Table columns={columns} dataSource={dataSource} pagination={false} />

          <div className="my-5">
            <span className="text-red-500">***</span>
            <span>
              Children under 6 years stay free in existing bedding; children
              aged 6 to must use and extra bed.
            </span>
          </div>

          <div className="flex justify-end">
            <Button type="primary" onClick={() => setRoomBookOpen(true)}>
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
      />

      <RoomBookedDrawer
        roomBookOpen={roomBookOpen}
        setRoomBookOpen={setRoomBookOpen}
        roomConfirm={roomConfirm}
        setRoomConfirm={setRoomConfirm}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default ReservationList;
