import React from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  TimePicker,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";

const onFinish = (fieldsValue) => {
  const rangeValue = fieldsValue["range-picker"];
  const rangeTimeValue = fieldsValue["range-time-picker"];
  const values = {
    ...fieldsValue,
    "date-picker": fieldsValue["date-picker"].format("YYYY-MM-DD"),
    "date-time-picker": fieldsValue["date-time-picker"].format(
      "YYYY-MM-DD HH:mm:ss",
    ),
    "month-picker": fieldsValue["month-picker"].format("YYYY-MM"),
    "range-picker": [
      rangeValue[0].format("YYYY-MM-DD"),
      rangeValue[1].format("YYYY-MM-DD"),
    ],
    "range-time-picker": [
      rangeTimeValue[0].format("YYYY-MM-DD HH:mm:ss"),
      rangeTimeValue[1].format("YYYY-MM-DD HH:mm:ss"),
    ],
    "time-picker": fieldsValue["time-picker"].format("HH:mm:ss"),
  };
  console.log("Received values of form: ", values);
};

const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
const ReservationForm = () => (
  <div className="ml-10">
    <Row gutter={5}>
      <Col span={50}>
        <Form
          name="time_related_controls"
          layout="vertical"
          onFinish={onFinish}
          style={{
            maxWidth: 750,
            border: "1px solid #d9d9d9",
            padding: "24px",
          }}
        >
          <h1 className="form-subtitle">Stay Details</h1>
          <Row gutter={8}>
            <Col span={10}>
              <Row gutter={0}>
                <Col span={12}>
                  <Form.Item name="date1" style={{ marginBottom: 0 }}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="time1" style={{ marginBottom: 0 }}>
                    <TimePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Form.Item className="w-16">
              <Input />
            </Form.Item>

            <Col span={10}>
              <Row gutter={0}>
                <Col span={12}>
                  <Form.Item name="date2" style={{ marginBottom: 0 }}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="time2" style={{ marginBottom: 0 }}>
                    <TimePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label="Reservation Type">
                <Select
                  placeholder="Select reservation type"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                    { value: "3", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Source Type">
                <Select
                  placeholder="Select source type"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Booking Source">
                <Select
                  placeholder="Select booking source"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                    { value: "3", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <h1 className="form-subtitle">Rate Offers</h1>
          <Form.Item name="agree">
            <Checkbox.Group style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "4px 8px",
                  background: "#ffffff",
                  width: 222,
                  fontSize: "12px",
                }}
              >
                <Checkbox value="contract1">Contract</Checkbox>
              </div>

              <div
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "4px 8px",
                  background: "#ffffff",
                  width: 222,
                  fontSize: "12px",
                }}
              >
                <Checkbox value="contract2">Group Booking</Checkbox>
              </div>

              <div
                style={{
                  border: "1px solid #d9d9d9",
                  padding: "4px 8px",
                  background: "#ffffff",
                  width: 222,
                  fontSize: "12px",
                }}
              >
                <Checkbox value="Complimentary">Complimentary Room</Checkbox>
              </div>
            </Checkbox.Group>
          </Form.Item>
          <Divider />

          <h1 className="form-subtitle">Room Details</h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 className="mb-3 text-[14px]">Room 1</h1>

            <CloseOutlined
              style={{
                fontSize: "16px",
                cursor: "pointer",
                color: "#999",
              }}
            />
          </div>
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item label="Room Type">
                <Select
                  placeholder="Select"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Room">
                <Select
                  placeholder="Select"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Rate Type">
                <Select
                  placeholder="Select"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                    { value: "3", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Adult">
                <Select
                  placeholder="Select"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                    { value: "3", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Child">
                <Select
                  placeholder="Select"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                    { value: "3", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Extra Bed">
                <Select
                  placeholder="Select"
                  options={[
                    { value: "1", label: "Female" },
                    { value: "2", label: "Male" },
                    { value: "3", label: "Other" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={4}>
              <Button type="primary" block>
                Add Room
              </Button>
            </Col>

            <Col span={4}>
              <Button block>Add Discount</Button>
            </Col>

            <Col span={4}>
              <Button block>Close</Button>
            </Col>
          </Row>

          <Divider />
          <h1 className="form-subtitle">Guest Information</h1>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mobile">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="NRC/Passport">
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Country">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="State">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="City">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Zip">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary">Add More Guest</Button>

          <Divider />
          <h1 className="form-subtitle">Other Information</h1>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <Checkbox onChange={onChange}>Send Email</Checkbox>
            <Checkbox onChange={onChange}>Check Out</Checkbox>
          </div>

          <Divider />
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={12}>
              <Button block>Cancel</Button>
            </Col>
            <Col span={12}>
              <Button type="primary" htmlType="submit" block>
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>

      <Col span={7}>
        <Form
          name="time_related_controls"
          layout="vertical"
          onFinish={onFinish}
          style={{
            maxWidth: 300,
            border: "1px solid #d9d9d9",
            padding: "24px",
          }}
        >
          <h1 className="form-subtitle">Billing Summary</h1>

          <div className="flex justify-between">
            <span className="text-xs">Check In</span>
            <span className="text-xs"> Check Out</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs">21/12/2025</span>
            <span className="text-xs">27/12/2025</span>
          </div>
          <Divider />

          <div className="space-y-3 text-sm text-white">
            <div className="space-y-2 ">
              <div className="flex justify-between">
                <span className="text-xs">Room Charges (5 nights)</span>
                <span className="text-xs"> 450,000 MMK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Tax</span>
                <span className="text-xs"> 50,000 MMK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs">Discount</span>
                <span className="text-xs"> 0 MMK</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <span className="text-xs">Total</span>
                <span className="text-xs"> 500,000 MMK</span>
              </div>
            </div>
          </div>
          <Divider />
          <h1 className="form-subtitle">Payment</h1>
          <Form.Item label="Bill to">
            <Select
              placeholder="Select"
              options={[
                { value: "1", label: "Female" },
                { value: "2", label: "Male" },
                { value: "3", label: "Other" },
              ]}
            />
          </Form.Item>

          <h1 className="text-xs mb-2">Payment Method</h1>

          <Radio.Group
            name="radiogroup"
            // defaultValue={1}
            options={[
              { value: 1, label: "Cash" },
              { value: 2, label: "Credit" },
            ]}
          />

          <Form.Item label="Amount">
            <Input placeholder="Enter Amount" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Add Payment
          </Button>
        </Form>
      </Col>
    </Row>
  </div>
);
export default ReservationForm;
