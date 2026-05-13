import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select
} from "antd";
import { reservationMeta } from "../../api/reservationSectionApi";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import { upsertGuest } from "../../api/guestApi";
import { queryClient } from "../../app/queryClient";

const CreateGuestForm = ({
  guestDrawerOpen,
  setGuestDrawerOpen,
  setGuestInfoTable,
  setClickCreateContact,
  upsertMutation,
  createContactFinish,
  setCreateContactFinish
}) => {
  const [form] = Form.useForm();

  const [searchText, setSearchText] = useState("");


  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const titleOptions = useMemo(() => {
    return initData?.statuses?.name_title?.map(t => ({ value: t.name, label: t.name })) || [];
  }, [initData]);

  const statusOptions = useMemo(() =>
    initData?.statuses?.status?.map(s => ({ value: s.uuid, label: s.name })) || [], [initData]);

  const { data: reservationMetas } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
  });

  const
    guestsOptions =
      reservationMetas?.guests?.map((item) => ({
        label: item.name,
        value: item.uuid,
      })) || [];

  const onClick = () => {
    setCreateContactFinish(true);
    form.validateFields().then((values) => {
      //       {
      //     "title": "Mr",
      //     "name": "f2c7bdf7c2a249e9a4ac28925625d59b",
      //     "phone": "09123456789"
      // }

      const selectedGuest = reservationMetas?.guests?.find(
        (guest) => guest.uuid === values.name
      );

      let payload = {
        title: values.title,
        phone: values.phone,
        status: {
          uuid: statusOptions[0]?.value,
        },
      };

      // existing guest
      if (selectedGuest) {
        payload = {
          ...payload,
          uuid: selectedGuest.uuid,
          name: selectedGuest.name,
        };
      }

      // new guest
      else {
        payload = {
          ...payload,
          uuid: null,
          name: values.name,
        };
      }

      upsertMutation.mutate(payload);
    });
  };
  return (
    <Drawer
      size={550}
      open={guestDrawerOpen}
      onClose={() => setGuestDrawerOpen(false)}
      title={
        <div className="flex justify-between gap-4">
          <span>Create Contact Person</span>
          <Button type="primary" onClick={onClick} loading={upsertMutation?.isPending}>
            Create
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={5}>
            <Form.Item
              label="Title"
              name="title"
            >
              <Select options={titleOptions} placeholder="Select Title" />
            </Form.Item>
          </Col>

          <Col span={19}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: false }]}
            // handled manualcly
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
                  setSearchText(value); //  store typed value
                }}
                onChange={(value, option) => {
                  setSearchText("");
                  form.setFieldValue("name", value);

                }}

                onInputKeyDown={(e) => {
                  if (searchText) {
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
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Phone Number is required." },
              ]}
            >
              <Input
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Phone Number"
              />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateGuestForm;

