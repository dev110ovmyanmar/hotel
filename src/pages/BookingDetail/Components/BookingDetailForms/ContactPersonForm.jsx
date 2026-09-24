import { useEffect, useMemo, useState } from "react";
import {
  AutoComplete,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import { queryClient } from "../../../../app/queryClient";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  reservationDetails,
  reservationMeta,
} from "../../../../api/reservationSectionApi";
import { useParams } from "react-router-dom";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import { upsertGuest } from "../../../../api/guestApi";

const ContactPersonform = ({ open, onClose, data }) => {
  const [form] = Form.useForm();
  const selectedTitle = Form.useWatch("title");
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const titleOptions = useMemo(() => {
    return (
      initData?.statuses?.name_title?.map((t) => ({
        value: t.name,
        label: t.name,
      })) || []
    );
  }, [initData]);

  const statusOptions = useMemo(
    () =>
      initData?.statuses?.status?.map((s) => ({
        value: s.uuid,
        label: s.name,
      })) || [],
    [initData],
  );

  const { data: reservationMetas } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
  });

  const reservationsEdit = useApiMutation({
    mutationFn: upsertGuest,
    invalidateKeys: [["reservation-details"]],
  });

  const guestsOptions =
    reservationMetas?.guests?.map((item) => ({
      label: `${item.name}  ${item.nrcNo ? "(" + item.nrcNo + ")" + " " + "(" + item.phone + ")" : "(" + item.phone + ")"}`,
      value: item.uuid,
      name: item.name,
      phone: item.phone,
      title: item.title,
    })) || [];

  const autocompleteGuestOptions = selectedTitle
    ? guestsOptions.filter((guest) => guest.title === selectedTitle)
    : guestsOptions;

  const [value, setValue] = useState("");

  useEffect(() => {
    if (open && data?.reservation) {
      const reservation = data.reservation;

      form.setFieldsValue({
        title: reservation?.guest?.title || undefined,
        name: reservation?.guest?.name || undefined,
        phone: reservation?.guest?.phone || undefined,
        secondaryPhone: reservation?.guest?.secondaryPhone || undefined,
      });
    }

    if (!open) {
      form.resetFields();
    }
  }, [open, data, form]);

  const handleFinish = (values) => {
    const reservation = data?.reservation;

    const editValues = {
      uuid: reservation?.guest?.uuid,
      title: values.title,
      name: values?.name,
      phone: values?.phone,
      secondaryPhone: value?.secondaryPhone,
      status: {
        uuid: statusOptions[0]?.value,
      },
    };

    reservationsEdit.mutate(editValues, {
      onSuccess: () => {
        form.resetFields();
        handleClose();

        if (onSuccess) {
          onSuccess();
        }

        Toast.success("Contact Person Details Updated Successfully!");
      },
    });
  };

  const handleClose = () => {
    form.resetFields();

    if (onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      size={550}
      open={open}
      onClose={handleClose}
      title={
        <div className="flex items-center justify-between">
          <span>Edit Contact Person</span>

          <FormButtons
            onClick={() => form.submit()}
            isPending={reservationsEdit.isPending}
          />
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item
                label="Full Name"
                name="title"
                style={{ width: "20%" }}
                rules={[{ required: true, message: "This is required" }]}
              >
                <Select options={titleOptions} placeholder="Select Title" />
              </Form.Item>

              <Form.Item
                label={<p className="hidden">Name</p>}
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
                style={{ width: "80%" }}
                className="hide-required-star"
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
                    form.setFieldsValue({
                      title: option.title,
                      name: option.name,
                      guestUuid: value,
                      phone: option.phone,
                      secondaryPhone: option.secondaryPhone,
                    });
                  }}
                  onChange={(value, option) => {
                    form.setFieldsValue({
                      name: value,
                      guestUuid: null,
                    });
                  }}
                >
                  <Input />
                </AutoComplete>
              </Form.Item>
            </Space.Compact>
          </Col>
        </Row>

        <Form.Item name="guestUuid" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Phone number is required." }]}
            >
              <Input
                onKeyPress={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
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
            <Form.Item label="Secondary Phone Number" name="secondaryPhone">
              <Input
                onKeyPress={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
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

export default ContactPersonform;
