import React, { useState } from "react";
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

const SearchEventFacilityOrderForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const onFinish = (values) => {
    console.log("Searching with formatted values:", {
      ...values,
      OrderDate: getFormattedDate(values.OrderDate, false),
    });

    //  API
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
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Guest Name", dataIndex: "guestName", key: "guestName" },
    {
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => console.log("Added:", record)}
        >
         + Add
        </Button>
      ),
    },
  ];

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
          <Form.Item label="Order Date" name="OrderDate">
            <DatePicker className="w-full" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Start Time" name="startTime">
                <TimePicker className="w-full" format="h:mm A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="End Time" name="endTime">
                <TimePicker className="w-full" format="h:mm A" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Facility Package" name="facilityPackage">
                <Select
                  placeholder="Select Package"
                  options={[
                    { value: "aa", label: "Package AA" },
                    { value: "bb", label: "Package BB" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Facility" name="facility">
                <Input placeholder="Enter Facility" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Event Name" name="eventName">
                <Input placeholder="Enter Event Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Guest Name" name="guestName">
                <Input placeholder="Enter Guest Name" />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </div>
        </Form>
      </div>

      {showTable && (
        <div className="mt-6">
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
              className="custom-blue-btn"
              onClick={() => setShowTable(false)}
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
