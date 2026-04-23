import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col,
  DatePicker,
  Button,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";

const GuestForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (drawerOpen && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        date_of_birth: selectedData.date_of_birth
          ? dayjs(selectedData.date_of_birth)
          : null,
      });
    } else if (drawerOpen && mode === "add") {
      form.resetFields();
    }
  }, [selectedData, drawerOpen, form, mode]);

  const onFinish = (values) => {
    const existingData = JSON.parse(localStorage.getItem("guests")) || [];

    if (mode === "add") {
      const newData = {
        ...values,
        id: Date.now(),
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.toISOString()
          : null,
      };
      localStorage.setItem(
        "guests",
        JSON.stringify([...existingData, newData]),
      );
    } else if (mode === "edit") {
      const updatedData = existingData.map((item) =>
        item.id === selectedData.id
          ? { ...item, ...values, id: item.id }
          : item,
      );
      localStorage.setItem("guests", JSON.stringify(updatedData));
    }

    setDrawerOpen(false);
    onSuccess(); //table refresh
    form.resetFields();
  };

  return (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      size={600}
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "view"
              ? "Guest Details"
              : mode === "edit"
                ? "Edit Guest"
                : "Create Guest"}
          </span>

          {isView ? (
            <Button type="primary" onClick={() => setMode("edit")}>
              Edit
            </Button>
          ) : (
            <FormButtons onClick={() => form.submit()} mode={mode} />
          )}
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} disabled={isView}>
        <Row gutter={16}>
          <Col span={24}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Title" name="title">
                  <Select
                    options={[
                      { value: "Mr.", label: "Mr." },
                      { value: "Mrs.", label: "Mrs." },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={18}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input your name!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name (other language)" name="name_other">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Room No" name="room_no">
                  <Select
                    options={[
                      { value: "101", label: "101" },
                      { value: "102", label: "102" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone No 1"
              name="phone_no1"
              rules={[{ required: true, message: "Phone no is Required" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone No 2" name="phone_no2">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Country" name="country">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Postal Code" name="postal_code">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="NRC No"
          name="nrc_no"
          rules={[{ required: true, message: "NRC is Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Passport No" name="passport">
          <Input />
        </Form.Item>

        <Form.Item label="Nationality" name="nationality">
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Gender" name="gender">
              <Select
                options={[
                  { value: "Female", label: "Female" },
                  { value: "Male", label: "Male" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Date of Birth" name="date_of_birth">
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Father Name" name="father_name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Status" name="status">
              <Select
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Guest Type" name="guest">
          <Select
            style={{ width: "50%" }}
            options={[
              { value: "Main Guest", label: "Main Guest" },
              { value: "Guest", label: "Guest" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Guest Notes" name="notes">
          <TextArea />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GuestForm;
