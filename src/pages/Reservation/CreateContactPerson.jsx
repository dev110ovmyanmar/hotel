import React, { useEffect, useMemo, useState } from "react";
import {
  AutoComplete,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space
} from "antd";
import { reservationMeta } from "../../api/reservationSectionApi";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import { upsertGuest } from "../../api/guestApi";
import { queryClient } from "../../app/queryClient";
import { validatePhoneNumber } from "../../utils";
import { ReloadOutlined } from "@ant-design/icons";

const CreateGuestForm = ({
  guestDrawerOpen,
  setGuestDrawerOpen,
  setGuestInfoTable,
  setClickCreateContact,
  upsertMutation,
  createContactFinish,
  setCreateContactFinish,
  createContactForm
}) => {
  const phoneValue = Form.useWatch("phone", createContactForm);
  const secondPhoneValue = Form.useWatch("secondaryphone", createContactForm);
  const selectedTitle = Form.useWatch("title", createContactForm);
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
        label: `${item.name}  ${item.nrcNo ? '(' + item.nrcNo + ')' + " " + '(' + item.phone + ')' : '(' + item.phone + ')'}`,
        value: item.uuid,
        name: item.name,
        phone: item.phone,
        title: item.title
      })) || [];

  const autocompleteGuestOptions = selectedTitle ?
    guestsOptions.filter(
      guest => guest.title === selectedTitle
    ) :
    guestsOptions;


  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState("");

  const onClick = () => {
    setCreateContactFinish(true);
    createContactForm.validateFields().then((values) => {
      //       {
      //     "title": "Mr",
      //     "name": "f2c7bdf7c2a249e9a4ac28925625d59b",
      //     "phone": "09123456789"
      // }

      let payload = {
        title: values.title,
        phone: values.phone,
        status: {
          uuid: statusOptions[0]?.value,
        },
      };
      // existing guest
      if (values.guestUuid) {
        payload = {
          ...payload,
          uuid: values.guestUuid,
          name: values.name,
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

  const handleAddCustomer = () => {
    if (!newCustomer.trim()) return;

    const newItem = {
      label: newCustomer,
      value: crypto.randomUUID()
    };

    setCustomers(prev => [...prev, newItem]);
    setNewCustomer("")
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
      <div className="flex justify-end">
        <Button
          className="!border-blue-500"
          onClick={() => {
            createContactForm.resetFields()
          }}
        >
          <ReloadOutlined className="!text-blue-500" />
          <span className="!text-blue-500" >Refresh Input Field</span>
        </Button>
      </div>

      <Form layout="vertical" form={createContactForm}>
        <Row gutter={16}>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              label="Full Name"
              name="title"
              style={{ width: '20%' }}
              rules={[{required:true, message:"This is required"}]}
            >
              <Select options={titleOptions} placeholder="Select Title" />
            </Form.Item>

            <Form.Item
              label={
                <p className="hidden">Name</p>
              }
              name="name"
              rules={[{required:true, message:"Name is required"}]}
              style={{ width: "80%" }}
            >
              <AutoComplete
                options={autocompleteGuestOptions}
                placeholder="Select or type guest name"
                filterOption={(inputValue, option) =>
                  option?.label
                    ?.toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                onSelect={(value, option) => {
                  createContactForm.setFieldsValue({
                    title: option.title,
                    name: option.name,
                    guestUuid: value,
                    phone: option.phone,
                    secondaryPhone: option.secondaryPhone
                  });
                }}
                onChange={(value, option) => {
                  createContactForm.setFieldsValue({
                    name: value,
                    guestUuid: null,
                  });
                }}
              >
                <Input />
              </AutoComplete>
            </Form.Item>
          </Space.Compact>
        </Row>

        <Form.Item name="guestUuid" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true , message: "Phone number is required." },
                
              ]}
            >
              <Input
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) &&
                    !(e.key === "+" && value.length === 0)
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Phone Number"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Secondary Phone Number"
              name="secondaryPhone"
            // rules={[
            //   {
            //     validator: validatePhoneNumber
            //   }
            // ]}
            >
              <Input
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key) &&
                    !(e.key === "+" && value.length === 0)
                  ) {
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

