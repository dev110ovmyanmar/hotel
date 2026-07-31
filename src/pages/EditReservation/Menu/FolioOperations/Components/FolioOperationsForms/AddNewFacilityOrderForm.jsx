import React, { useEffect, useState } from "react";
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
} from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import SearchFacilityOrderDrawer from "./SearchFacilityOrderDrawer";
import Status from "../../../../../../component/Status/Status";
import { queryClient } from "../../../../../../app/queryClient";
const { Text } = Typography;

const onChange = (value) => {
  console.log("changed", value);
};

const AddNewFacilityOrderForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;

  const initDataStatus = initData?.status;

  useEffect(() => {
    form.setFieldsValue({
      status: {
        uuid: initDataStatus.find(
          item => item.code === "active"
        )?.uuid,
      },
    });
  })

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

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    onChange,
    style: { width: 150 },
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        size={600}
        destroyOnClose
        title={
          <div className="flex justify-between items-center">
            <span>Add New Facility Order</span>
            <Button type="primary">Create</Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex justify-end mb-3">
            <Button
              onClick={() => setSearchOpen(true)}
              className="custom-blue-btn"
            >
              Search By
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Event Order Date"
              name="eventOrderDate"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Event Order Time"
              name="eventOrderTime"
              className="flex-1"
              rules={[{ required: true }]}
            >
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <FormItem label="Event Name" name="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Start Date" name="startDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="Start Time" name="startTime" className="flex-1">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="End Date" name="endDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="End Time" name="endTime" className="flex-1">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <FormItem label="Package Name" name="packageName">
            <Select
              placeholder="Select Package Name"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Estimated Pax"
              name="estimatedPax"
              rules={[{ required: true }]}
            >
              <InputNumber className="!w-full" min={0} suffix="Pax" />
            </Form.Item>

            <Form.Item
              label="Estimated Time"
              name="estimatedTime"
              className="flex-1"
            >
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Guest Name"
              name="guestName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              className="flex-1"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </div>

          {/* <Form.Item label="Status" name="status">
            <Select
              rules={[{ required: true }]}
              placeholder="Select Status"
              style={{ width: "100%" }}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item> */}

          <Status statusValue={initDataStatus} />

          <Form.Item label="Remarks" name="remarks">
            <TextArea />
          </Form.Item>
        </Form>
      </Drawer>
      <SearchFacilityOrderDrawer
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        reservationId={reservationId}
      />
    </>
  );
};

export default AddNewFacilityOrderForm;
