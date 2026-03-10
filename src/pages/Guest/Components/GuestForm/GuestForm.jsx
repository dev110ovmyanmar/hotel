import { Form, Input, Select, Drawer, Row, Col, DatePicker } from "antd";
import FormButton from "../../../../component/FormButtons/FormButtons";
import TextArea from "antd/es/input/TextArea";

const GuestForm = ({ mode, drawerOpen, setDrawerOpen }) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const onFinish = (values) => {
    console.log("Form values:", values);
    setDrawerOpen(false);
    form.resetFields();
  };
  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          mode === "view"
            ? "Guest Details"
            : mode === "edit"
              ? "Edit Guest"
              : "Create Guest"
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            {(isEdit || isView) && (
              <Col span={6}>
                <Form.Item
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="front_photo"
                >
                  <Upload action="/upload.do" listType="picture-card">
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                  <h1 className="mt-4">Guest Photo</h1>
                </Form.Item>
              </Col>
            )}

            <Col span={isEdit || isView ? 18 : 24}>
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
                    <Input />
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

          <Form.Item label="Passport No" name="passport_no">
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

          <Form.Item label="Guest Notes" name="notes">
            <TextArea />
          </Form.Item>

          <FormButton
            isView={isView}
            isAdd={isAdd}
            onCancel={() => setDrawerOpen(false)}
          />
        </Form>
      </Drawer>
    </div>
  );
};

export default GuestForm;
