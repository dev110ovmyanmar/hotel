import React, { useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select
} from "antd";
import { reservationMeta } from "../../api/availabilitySearchApi";
import useApiQuery from "../../hooks/useApiQuery";

const CreateGuestForm = ({
  guestDrawerOpen,
  setGuestDrawerOpen,
  setGuestInfoTable,
  setClickCreateContact
}) => {
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState("");

  const { data: reservationMetas } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
  });

  const guestsOptions =
    reservationMetas?.guests?.map((item) => ({
      label: item.name,
      value: item.uuid,
    })) || [];

  const onClick = () => {
    form.validateFields().then((values) => {
      console.log("Form Values:", values);

      // 👉 if user typed new name
      if (!values.name && searchText) {
        values.name = searchText;
      }

      console.log("Final Name:", values.name);

      setGuestDrawerOpen(false);
      setGuestInfoTable(true);
      setClickCreateContact(true);
    });
  };

  const titleOptions = [
    { label: "Mr.", value: "mr." },
    { label: "Mrs.", value: "mrs." },
  ];

  return (
    <Drawer
      size={550}
      open={guestDrawerOpen}
      onClose={() => setGuestDrawerOpen(false)}
      title={
        <div className="flex justify-between gap-4">
          <span>Create Guest</span>
          <Button type="primary" onClick={onClick}>
            Create
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item label="Title" name="title" initialValue="mr.">
              <Select options={titleOptions} />
            </Form.Item>
          </Col>

          <Col span={20}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: false }]} // handled manually
            >
              <Select
                showSearch
                allowClear
                placeholder="Select or type guest name"
                options={guestsOptions}
                filterOption={(input, option) =>
                  option?.label
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                onSearch={(value) => {
                  setSearchText(value); // 👈 store typed value
                }}
                onChange={(value) => {
                  // 👇 reset searchText if selecting existing
                  setSearchText("");
                  form.setFieldValue("name", value);
                }}
                onInputKeyDown={(e) => {
                  if ( searchText) {
                    form.setFieldValue("name", searchText);
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <h1 className="!mb-2 !font-bold">Contact Information</h1>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone No 1"
              name="phoneNoOne"
              rules={[
                { required: true, message: "Phone Number is required." },
              ]}
            >
              <Input  
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}/>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone No 2" name="phoneNoTwo">
              <Input 
               onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateGuestForm;

