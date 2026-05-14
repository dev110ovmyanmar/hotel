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
  Space,
  Divider,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { getFormattedDate } from "../../../../../../utils";

const { Option } = Select;

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
    const formattedValues = {
      ...values,
      date_of_birth: getFormattedDate(values.date_of_birth, false),
    };

    console.log("Submitted Values:", formattedValues);

    const existingData = JSON.parse(localStorage.getItem("guests")) || [];
    if (mode === "add") {
      localStorage.setItem(
        "guests",
        JSON.stringify([
          ...existingData,
          { ...formattedValues, id: Date.now() },
        ]),
      );
    } else {
      const updated = existingData.map((item) =>
        item.id === selectedData.id
          ? { ...formattedValues, id: item.id }
          : item,
      );
      localStorage.setItem("guests", JSON.stringify(updated));
    }

    setDrawerOpen(false);
    onSuccess();
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
                  name="guestName"
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

        <Divider />
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

        {/* <Form.Item
          label="NRC No"
          name="nrcNo"
          rules={[{ required: true}]}
        >
          <Row gutter={5}>
            <Col span={4}>
              <Form.Item
                name="nrcSrNo"
                rules={[{ required: true }]}
                getValueProps={(value) => ({
                  value: isView
                    ? region.find((item) => item.value === value)?.label
                    : value,
                })}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                    // options={region}
                    placeholder="Select Region"
                    onChange={(value) => {
                      setSelectedRegion(value);
                      form.setFieldsValue({ nrcTownship: null });
                    }}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={1} className="text-center font-bold">
              /
            </Col>

            <Col span={7}>
              <Form.Item
                name="nrcTownship"
                rules={[{ required: true }]}
                // getValueProps={(value) => ({
                //   value: isView
                //     ? township?.find((item) => item.value === value)?.label
                //     : value,
                // })}
              >
                {isView ? (
                  <Input readOnly={isView} />
                ) : (
                  <Select
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                    // options={township}
                    placeholder="Select Township"
                    // disabled={!selectedRegion}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                name="nrcType"
                rules={[{ required: true }]}
                // getValueProps={(value) => ({
                //   value: isView
                //     ? citizenship.find((item) => item.value === value)?.label
                //     : value,
                // })}
              >
                {isView ? (
                  <Input/>
                ) : (
                  <Select
                    showSearch={{
                      filterOption: (input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                    // options={citizenship}
                    placeholder="Select Type"
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="nrcNumber" rules={[{ required: true }]}>
                <Input placeholder="Number" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item> */}

        <Form.Item label="NRC" name="nrc" rules={[{ required: true }]}>
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
