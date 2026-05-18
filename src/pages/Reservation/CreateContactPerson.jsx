import React, { useMemo, useState } from "react";
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
  const secondPhoneValue = Form.useWatch("phonetwo", createContactForm);
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
        name: item.name
      })) || [];

  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState(guestsOptions);
  const [value, setValue] = useState("");

  const handleSelect = (value) => {
    setValue(value)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const inputValue = e.target.value.trim();

      if (!inputValue) return;

      setOptions(prev => [
        ...prev,
        {
          value: inputValue
        }
      ]);

      setValue(inputValue)
    }
  }

  const onClick = () => {
    setCreateContactFinish(true);
    createContactForm.validateFields().then((values) => {
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
      <Form layout="vertical" form={createContactForm}>
        <Row gutter={16}>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              label="Title"
              name="title"
              style={{ width: '20%' }}
            >
              <Select options={titleOptions} placeholder="Select Title" />
            </Form.Item>

            {/* <Form.Item
              label="Name"
              name="name"
              rules={[{ required: false }]}
              style={{ width: '80%' }}
            >
              <Select
                mode="combobox"
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
                  createContactForm.setFieldValue("name", value);

                }}

                onInputKeyDown={(e) => {
                  if (searchText) {
                    createContactForm.setFieldValue("name", searchText);
                  }
                }}

              />

            </Form.Item> */}

            <Form.Item
              label="Name"
              name="name"
              style={{ width: "80%" }}
            >
              <AutoComplete
                options={guestsOptions}
                placeholder="Select or type guest name"
                filterOption={(inputValue, option) =>
                  option?.label
                    ?.toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                onSelect={(value, option) => {
                  createContactForm.setFieldValue("name", option.name);
                }}
                onChange={(value, option) => {
                  createContactForm.setFieldValue("name", value);
                }}

              >
                <Input />
              </AutoComplete>
            </Form.Item>
          </Space.Compact>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true },
                {
                  validator: validatePhoneNumber
                }
              ]}
            >
              <Input
                addonBefore="+959"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Phone Number"
                maxLength={
                  phoneValue?.startsWith("09")
                    ? 11
                    : phoneValue?.startsWith("9")
                      ? 10
                      : 9
                }
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Secondary Phone Number"
              name="phonetwo"
              rules={[
                {
                  validator: validatePhoneNumber
                }
              ]}
            >
              <Input
                addonBefore="+959"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter Phone Number"
                maxLength={
                  secondPhoneValue?.startsWith("09")
                    ? 11
                    : secondPhoneValue?.startsWith("9")
                      ? 10
                      : 9
                }
              />
            </Form.Item>
          </Col>

        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateGuestForm;

