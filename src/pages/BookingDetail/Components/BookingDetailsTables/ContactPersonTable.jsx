import React from "react";
import { Card, Row, Typography, Divider, Space } from "antd";
import { DollarCircleOutlined, PhoneOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ContactPersonCard = () => {
  const CustomTitle = (
    <Space>
      <div className="contact-icon-box">
        <PhoneOutlined style={{ color: "#312f2f", fontSize: "20px" }} />
      </div>
      <Text>Contact Person</Text>
    </Space>
  );

  return (
    <Card title={CustomTitle} className="contact-card line-height">
      <Row justify="space-between">
        <Text strong>Name</Text>
        <Text strong>Phone Number</Text>
      </Row>

      <Row justify="space-between" className="mt-3">
        <Text >Emily Brown</Text>
        <Text>+9591234567890</Text>
      </Row>
    </Card>
  );
};

export default ContactPersonCard;
