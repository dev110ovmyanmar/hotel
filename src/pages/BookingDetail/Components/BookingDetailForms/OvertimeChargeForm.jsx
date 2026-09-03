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
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import OvertimeChargeCreateForm from "./OvertimeChargeCreateForm";

const { Text } = Typography;

const OvertimeChargeForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [createOpen, setCreateOpen] = useState(false);

  const onFinish = (values) => {
    console.log("Over Time Charges:", {
      reservationId,
      ...values,
    });

    onClose();
    form.resetFields();
  };

  return (
    <>
      <Drawer
        title="Overtime Charge"
        open={open}
        onClose={onClose}
        size={550}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card size="small" className="mb-10 shadow rounded border-none`" title="Room 1">
              <Row gutter={16} className="mb-2">
                <Col span={8}>
                  <Text>Room Type</Text>
                </Col>
                <Col span={8}>
                  <Text>Room No</Text>
                </Col>
                <Col span={8}>
                  <Text>Room Status</Text>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Input
                    value="Deluxe Bungalow Double"
                    readOnly
                    className="no-radius-input"
                  />
                </Col>
                <Col span={8}>
                  <Input value="101" readOnly className="no-radius-input" />
                </Col>
                <Col span={8}>
                  <Input
                    value="Check In"
                    readOnly
                    className="no-radius-input"
                  />
                </Col>
              </Row>

              <div className="flex justify-end mt-5">
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="custom-blue-btn"
                >
                  Add On Time
                </Button>
              </div>
            </Card>

            <Card size="small" className="mb-10 shadow rounded border-none`" title="Room 2">
              <Row gutter={16} className="mb-2">
                <Col span={8}>
                  <Text>Room Type</Text>
                </Col>
                <Col span={8}>
                  <Text>Room No</Text>
                </Col>
                <Col span={8}>
                  <Text>Room Status</Text>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Input
                    value="Deluxe Bungalow Double"
                    readOnly
                    className="no-radius-input"
                  />
                </Col>
                <Col span={8}>
                  <Input value="101" readOnly className="no-radius-input" />
                </Col>
                <Col span={8}>
                  <Input
                    value="Check In"
                    readOnly
                    className="no-radius-input"
                  />
                </Col>
              </Row>
              <div className="flex justify-end mt-5">
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="custom-blue-btn"
                >
                  Add On Time
                </Button>
              </div>
            </Card>
          </Space>
        </Form>
      </Drawer>

      <OvertimeChargeCreateForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        reservationId={reservationId}
      />
    </>
  );
};

export default OvertimeChargeForm;
