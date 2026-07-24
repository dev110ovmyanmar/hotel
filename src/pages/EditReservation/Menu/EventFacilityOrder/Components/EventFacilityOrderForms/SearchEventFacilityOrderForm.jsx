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
} from "antd";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../../../utils";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { facilityBookingAttach, facilityBookingSearch, fetchFacilityBooking } from "../../../../../../api/booking";
import ColorStatusTag from "../../../../../../component/ColorStatusTag/ColorStatusTag";
import SearchByModal from "../SearchByModal";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";

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
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const [searchValues, setSearchValues] = useState();
  const [openSearchModal, setOpenSearchModal] = useState(false);

  const [reservationIdList, setReservationIdList] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState();

  const [isSearched, setIsSearched] = useState(false);



  const { data: bookingSearch, isPending: bookingSearchPending } = useApiQuery({
    fetchQueryName: searchValues?.eventDate ? ["facility-booking-search", searchValues] : ["facility-booking-search"],
    fetchQueryFunction: () => {
      if (!searchValues?.eventDate) return null;
      return facilityBookingSearch(searchValues);
    },
    options: {
      enabled: isSearched && !!searchValues?.eventDate,
    },
  });

  useEffect(() => {
    setTableData(bookingSearch);
  }, [bookingSearch])

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      startTime: values?.startTime?.format("HH:mm:ss"),
      endTime: values?.endTime?.format("HH:mm:ss"),
      facilityPackage: {
        uuid: values?.facilityPackage
      },
      eventDate: values?.eventDate?.format("YYYY-MM-DD")
    };

    setSearchValues(modifiedValues);
    setIsSearched(true);
    setShowTable(true);
  };

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
      align: "center",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Guest Phone",
      dataIndex: "guestPhone",
      key: "guestPhone",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      render: (text) => <div>{text}</div>,
    },
    // {
    //   title: "Total Price",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   render: (text) => <div>{text ? text : "-"}</div>,
    // },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (text) => <div>{text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "-"}</div>,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => {
        console.log(text, "TextINStartTime")
        return <div>{text ? dayjs(text, "HH:mm").format("HH:mm") : "-"}</div>
      },
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => <div>{text ? dayjs(text, "HH:mm").format("HH:mm") : "-"}</div>,
    },
    {
      title: "Expected Hours",
      dataIndex: "expectedHours",
      key: "expectedHours",
      render: (_, record) => {
        const startTime = dayjs(record.startTime, "HH:mm:ss");
        const endTime = dayjs(record.endTime, "HH:mm:ss");

        const totalSeconds = endTime.diff(startTime, "second");

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const text = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        return <div>{text}</div>;

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
    // {
    //   title: "Remark",
    //   dataIndex: "remark",
    //   key: "remark",
    //   render: (text) => <div>{text ? text : "-"}</div>,
    // },
    {
      key: "action",
      fixed: "end",
      align: "center",
      render: (_, record) => {
        return (
          (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setOpenSearchModal(true);
                setReservationIdList({
                  ...record,
                  reservation: {
                    uuid: reservationId
                  }
                });
                setSelectedBooking({
                  facilityBookingUuid: record.uuid,
                });
              }
              }
            >
              + Add
            </Button >
          )
        )
      },
    },
  ];

  // facilityBookingAttach
  const facilityBookingAttachs = useApiMutation({
    mutationFn: facilityBookingAttach,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  console.log(reservationId, "reservationUuid")

  const handleOk = () => {
    if (selectedBooking) {

      const modifiedValues = {
        reservation: {
          uuid: reservationId
        },
        facilityBooking: {
          uuid: selectedBooking?.facilityBookingUuid
        }
      };
      facilityBookingAttachs.mutate(modifiedValues, {
        onSuccess: () => {
          Toast.success("Facility Booking Attached Successfully!");
          setOpenSearchModal(false);
          setDrawerOpen(false);
          onClose(false);
        }
      })
    };
  };

  return (
    <Drawer
      title="Search By"
      open={open}
      onClose={onClose}
      width={600}
      destroyOnClose
    >
      <div className="border border-gray-200 shadow-sm rounded-lg p-4 ">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Event Date" name="eventDate" required>
            <DatePicker className="w-full" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Start Time" name="startTime">
                <TimePicker className="w-full" format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="End Time"
                name="endTime"
                rules={[
                  {
                    required: hasStartTime ? true : false,
                    message: "Select End Time"
                  }
                ]}
              >
                <TimePicker className="w-full" format="HH:mm" />
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
            <Button
              type="primary"
              htmlType="submit"
            >
              Search
            </Button>
          </div>
        </Form>
      </div>

      {
        showTable && (
          <div className="mt-6">
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey="id"
              pagination={false}
              size="small"
              className="custom-table-font"
            />

          </div>
        )
      }

      <SearchByModal
        open={openSearchModal}
        onCancel={() => setOpenSearchModal(false)}
        onOk={handleOk}
        confirmLoading={facilityBookingAttachs.isPending}
      />
    </Drawer >
  );
};

export default SearchEventFacilityOrderForm;
