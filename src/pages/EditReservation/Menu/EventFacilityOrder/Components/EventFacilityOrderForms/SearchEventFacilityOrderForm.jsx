import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
  TimePicker,
  Select,
  Table,
  Empty,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../../../utils";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import {
  facilityBookingAttach,
  facilityBookingSearch,
  fetchFacilityBooking,
} from "../../../../../../api/booking";
import ColorStatusTag from "../../../../../../component/ColorStatusTag/ColorStatusTag";
import SearchByModal from "../SearchByModal";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";
import Loader from "../../../../../../component/Loader/Loader";

const SearchEventFacilityOrderForm = ({
  open,
  onClose,
  reservationId,
  setDrawerOpen,
  reservationData,
  facilityPackagesOptions,
}) => {
  const [form] = Form.useForm();
  const hasStartTime = Form.useWatch("startTime", form);
  const hasEndTime = Form.useWatch("endTime", form);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [searchValues, setSearchValues] = useState();
  const [openSearchModal, setOpenSearchModal] = useState(false);

  const [reservationIdList, setReservationIdList] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState();

  const [isSearched, setIsSearched] = useState(false);
  const [searchTrigger, setSearchTrigger] = useState(0);


  const { data: bookingSearch, isFetching: bookingSearchPending } = useApiQuery({
    fetchQueryName: searchValues?.eventDate
      ? ["facility-booking-search", searchValues, searchTrigger]
      : ["facility-booking-search"],
    fetchQueryFunction: () => {
      if (!searchValues?.eventDate) return null;
      return facilityBookingSearch(searchValues);
    },
    options: {
      enabled: !!searchValues?.eventDate && searchTrigger > 0,
    },
  });

  useEffect(() => {
    if (bookingSearch) {
      setTableData(bookingSearch);
      setShowTable(true);
    }
  }, [bookingSearch]);

  const disabledEndTime = () => {
    if (!hasStartTime) {
      return {};
    }

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, hour) =>
          hour < hasStartTime.hour() ? hour : null
        ).filter(hour => hour !== null),

      disabledMinutes: (selectedHour) => {
        if (selectedHour === hasStartTime.hour()) {
          return Array.from(
            { length: 60 },
            (_, minute) => minute
          ).filter(
            minute => minute <= hasStartTime.minute()
          );
        }

        return [];
      },
    };
  };

  const disabledStartTime = () => {
    if (!hasEndTime) {
      return {};
    }

    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, hour) =>
          hour > hasEndTime.hour() ? hour : null
        ).filter(hour => hour !== null),

      disabledMinutes: (selectedHour) => {
        if (selectedHour === hasEndTime.hour()) {
          return Array.from(
            { length: 60 },
            (_, minute) => minute
          ).filter(
            minute => minute >= hasEndTime.minute()
          );
        }

        return [];
      },
    };
  };

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      startTime: values?.startTime?.format("HH:mm:ss"),
      endTime: values?.endTime?.format("HH:mm:ss"),
      facilityPackage: {
        uuid: values?.facilityPackage,
      },
      eventDate: values?.eventDate?.format("YYYY-MM-DD"),
    };

    setSearchValues(modifiedValues);
    // setIsSearched(false);
    setShowTable(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 50,
      align: "center",
    },
    {
      title: "Guest Name & Phone No",
      key: "guestInfo",
      render: (_, record) => (
        <div>
          <div>{record.guestName}</div>
          <div>{record.guestPhone}</div>
        </div>
      ),
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      width: 100,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Details",
      key: "eventDetails",
      width: 100,
      render: (_, record) => {
        const dateStr = record.eventDate
          ? dayjs(record.eventDate, "YYYY-MM-DD").format("YYYY-MM-DD")
          : "-";

        const startTimeStr = record.startTime
          ? dayjs(record.startTime, "HH:mm").format("HH:mm")
          : null;
        const endTimeStr = record.endTime
          ? dayjs(record.endTime, "HH:mm").format("HH:mm")
          : null;

        let timeStr = "-";
        if (startTimeStr && endTimeStr) {
          timeStr = `${startTimeStr} - ${endTimeStr}`;
        } else if (startTimeStr) {
          timeStr = startTimeStr;
        } else if (endTimeStr) {
          timeStr = endTimeStr;
        }

        return (
          <div>
            <div>
              <strong> {dateStr}</strong>
            </div>
            <div>({timeStr})</div>
          </div>
        );
      },
    },

    {
      title: "Expected Pax",
      dataIndex: "expectedPax",
      key: "expectedPax",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },

    {
      key: "action",
      fixed: "end",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            size="small"
            style={{ borderRadius: "3px" }}
            onClick={() => {
              setOpenSearchModal(true);
              setReservationIdList({
                ...record,
                reservation: {
                  uuid: reservationId,
                },
              });
              setSelectedBooking({
                facilityBookingUuid: record.uuid,
              });
            }}
          >
            + Add
          </Button>
        );
      },
    },
  ];

  // facilityBookingAttach
  const facilityBookingAttachs = useApiMutation({
    mutationFn: facilityBookingAttach,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  console.log(reservationId, "reservationUuid");

  const handleOk = () => {
    if (selectedBooking) {
      const modifiedValues = {
        reservation: {
          uuid: reservationId,
        },
        facilityBooking: {
          uuid: selectedBooking?.facilityBookingUuid,
        },
      };
      facilityBookingAttachs.mutate(modifiedValues, {
        onSuccess: () => {
          Toast.success("Facility Booking Attached Successfully!");
          setOpenSearchModal(false);
          setDrawerOpen(false);
          onClose(false);
        },
      });
    }
  };

  return (
    <Drawer
      title="Search By"
      open={open}
      onClose={onClose}
      width={650}
      destroyOnClose
    >
      <div className="border border-gray-200 shadow-sm rounded-lg p-4 ">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item 
            label="Event Date" 
            name="eventDate"
            rules={[
              {
                required: true,
                message:"Event Date is required."
              }
            ]}
             >
            <DatePicker className="w-full" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[
                  {
                    required: hasEndTime ? true : false,
                    message: "Select Start Time"
                  }
                ]}
              >
                <TimePicker className="w-full" format="HH:mm" disabledTime={disabledStartTime} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[
                  {
                    required: hasStartTime ? true : false,
                    message: "Select End Time",
                  },
                ]}
              >
                <TimePicker className="w-full" format="HH:mm" disabledTime={disabledEndTime} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Facility Package" name="facilityPackage">
                <Select
                  placeholder="Select Package"
                  options={facilityPackagesOptions}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Event Name" name="eventName">
                <Input placeholder="Enter Event Name" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit" loading={bookingSearchPending} >
              Search
            </Button>
          </div>
        </Form>
      </div>

      {
        bookingSearchPending
          ?
          <div className="w-full flex justify-center items-center mt-6">
            <Loader />
          </div>
          :

          showTable &&
          <div className="mt-6">
            {
              bookingSearch?.length !== 0
                ?
                <Table
                  columns={columns}
                  dataSource={tableData}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  className="custom-table-font"
                />
                :
                <div className="border border-gray-200 p-5 shadow-md rounded">
                  <Empty description="No Event Availabe" />
                </div>
            }
          </div>


      }

      <SearchByModal
        open={openSearchModal}
        onCancel={() => setOpenSearchModal(false)}
        onOk={handleOk}
        confirmLoading={facilityBookingAttachs.isPending}
      />
    </Drawer>
  );
};

export default SearchEventFacilityOrderForm;
