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
const { Text } = Typography;

const onChange = (value) => {
  console.log("changed", value);
};

const FoodBeverageOrder = ({ open, onClose, reservationId }) => {
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

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    onChange,
    style: { width: 150 },
  };

  return (
    <Drawer
      title="Food Beverage Order"
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
    >
      <Card title="Order Info" className="shadow rounded">
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Order Date" name="OrderDate">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Order Time" name="orderTime">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Room" name="room">
              <Select
                placeholder="Select Room"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Order Type" name="orderType">
              <Select
                placeholder="Select Order Type"
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item label="Order Status" name="orderStatus">
            <Select
              placeholder="Select Order Status"
              style={{ width: "100%" }}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Card>

      <Card title="Order 1" className="shadow rounded">
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <div className="grid grid-cols-3 gap-3">
            <Form.Item label="Menu" name="menu">
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: "aa", label: "aa" },
                  { value: "bb", label: "bb" },
                ]}
              />
            </Form.Item>
            <Form.Item label="Quantity" name="quantity">
              <InputNumber
                {...sharedProps}
                placeholder="Outlined"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Price Per Qty" name="pricePerQty">
              <InputNumber className="!w-full" min={0} suffix="MMK" />
            </Form.Item>
          </div>
        </Form>
      </Card>
      <div className=" mt-3 ">
        <Button className="custom-blue-btn">Add Menu</Button>
      </div>
    </Drawer>
  );
};

export default FoodBeverageOrder;
