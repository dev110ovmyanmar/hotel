import React, { useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  TimePicker,
  Select,
  Card,
  Typography,
  Tag,
  Table,
  Modal,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const SearchFacilityOrderDrawer = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const onFinish = (values) => {
    console.log("Searching with:", values);

    const results = [
      {
        id: 101,
        name: "Grand Ballroom Event",
        startDate: "2026-04-21",
        startTime: "2026-04-21T09:00:00Z",
        endDate: "2026-04-21",
        endTime: "2026-04-21T17:00:00Z",
        status: "Active",
        guestName: "Alice",
      },
      {
        id: 102,
        name: "Grand Ballroom Event",
        startDate: "2026-04-21",
        startTime: "2026-04-21T09:00:00Z",
        endDate: "2026-04-21",
        endTime: "2026-04-21T17:00:00Z",
        status: "Active",
        guestName: "Alice",
      },
    ];

    setTableData(results);
    setShowTable(true);
  };

  const handleAddRecord = (record) => {
    Modal.confirm({
      title: "Add to Reservation",
      icon: null,
      centered: true,
      content: (
        <div className="mt-4">
          <p>
            {record.name} will be added to Reservation ID: {reservationId}
            in Folio Operation.
          </p>
        </div>
      ),
      okText: "Confirm",
      cancelText: "Cancel",
      onOk() {
        console.log("Confirmed. Removing row ID:", record.id);

        setTableData((prevData) =>
          prevData.filter((item) => item.id !== record.id),
        );

        if (tableData.length === 1) {
          setShowTable(false);
        }
      },
    });
  };
  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Event Name", dataIndex: "name", key: "name" },
    {
      title: "Start Date Time",
      key: "startDateTime",
      render: (_, record) => (
        <div className="text-xs">
          <div className="font-medium">
            {record.startDate
              ? dayjs(record.startDate).format("DD.MM.YYYY")
              : "-"}
          </div>
          <div className="text-gray-500">
            {record.startTime ? dayjs(record.startTime).format("h:mm A") : ""}
          </div>
        </div>
      ),
    },
    {
      title: "End Date Time",
      key: "endDateTime",
      render: (_, record) => (
        <div className="text-xs">
          <div className="font-medium">
            {record.endDate ? dayjs(record.endDate).format("DD.MM.YYYY") : "-"}
          </div>
          <div className="text-gray-500">
            {record.endTime ? dayjs(record.endTime).format("h:mm A") : ""}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      key: "action",
      fixed:"end",
      align:"center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleAddRecord(record)}
        >
          <PlusOutlined />
          Add
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      title="Search By"
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
    >
      <div className="border border-gray-200 shadow rounded px-5 py-2">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item label="Order Date" name="OrderDate">
            <DatePicker className="w-full" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Event Start Time" name="eventstarttime">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>

            <Form.Item
              label="Event End Time"
              name="eventEndTime"
              className="flex-1"
            >
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Event Name" name="eventName">
              <Select
                placeholder="Select Event Name"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Package Name" name="packageName">
              <Select
                placeholder="Select Package Name"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Guest Name" name="guestName">
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status">
              <Select
                placeholder="Select Status"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end mb-2">
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </div>
        </Form>
      </div>

      {showTable && (
        <div className="mt-5">
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={false}
            size="small"
            className="custom-table-font"
          />

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setShowTable(false)}
              className="custom-blue-btn"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <Modal
        title="Add Service Order"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>
          You are adding a record for: <b>{selectedRecord?.name}</b>
        </p>
        <p>Order ID: {selectedRecord?.id}</p>
      </Modal>
    </Drawer>
  );
};

export default SearchFacilityOrderDrawer;
