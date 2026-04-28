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
  Radio,
  Table,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import EventFacilityOrderTable from "../EventFacilityOrderTable";

const { Text } = Typography;

const SearchEventFacilityOrderForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleSubmit = (values) => {
    console.log("Searching with:", values);

    const results = [
      {
        id: 101,
        name: "Grand Ballroom Event",
        startDate: "2026-04-21",
        endDate: "2026-04-21",
        status: "Active",
        guestName: "Alice",
      },
    ];

    setTableData(results);
    setShowTable(true);
  };
  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Event Name", dataIndex: "name", key: "name" },
    {
      title: "Start Date Time",
      key: "startDateTime",
      render: (_, record) => {
        const dateObj = new Date(record.startDate);

        const datePart = dateObj
          .toLocaleDateString("en-GB")
          .replace(/\//g, ".");

        const timePart = dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return `${datePart} ${timePart}`;
      },
    },
    {
      title: "End Date Time",
      key: "endDateTime",
      render: (_, record) => {
        const dateObj = new Date(record.endDate);

        const datePart = dateObj
          .toLocaleDateString("en-GB")
          .replace(/\//g, ".");

        const timePart = dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return `${datePart} ${timePart}`;
      },
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleAddRecord(record)}
        >
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
      <div className="border border-gray-200 shadow rounded p-5">
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item label="Order Date" name="OrderDate">
            <DatePicker className="w-full" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Start Time" name="starttime">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>

            <Form.Item label="End Time" name="endTime" className="flex-1">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Facility Package" name="facilityPackage">
              <Select
                placeholder="Select Facility Package"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Facility" name="facility">
              <Input />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Event Name" name="eventName">
              <Input />
            </Form.Item>

            <Form.Item label="Guest Name" name="guestName">
              <Input />
            </Form.Item>
          </div>

          <div className="flex justify-end mb-3">
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
    </Drawer>
  );
};

export default SearchEventFacilityOrderForm;
