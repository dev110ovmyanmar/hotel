import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Select } from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  reservationEdit,
  reservationMeta,
} from "../../../../api/reservationSectionApi";
import { queryClient } from "../../../../app/queryClient";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";

const ReservationDetailsForm = ({ open, onClose, onSuccess, data }) => {
  const [form] = Form.useForm();
  const [selectedSourceType, setSelectedSourceType] = useState(null);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const { data: reservationMetas, isFetching: metaLoading } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
    options: {
      enabled: open,
    },
  });

  const bookedVia =
    initData?.statuses?.booked_via?.map((item) => ({
      value: item.uuid,
      label: item.name,
    })) || [];

  const sourceType =
    initData?.statuses?.source_type?.map((item) => ({
      value: item.uuid,
      label: item.name,
      code: item.code?.trim()?.toLowerCase(),
    })) || [];

  const agenciesOptions =
    reservationMetas?.agencies?.filter(item => item?.status.code === "active")
      .map((item) => ({
        label: item?.name,
        value: item.uuid
      })) || [];

  const referralAgentsOptions =
    reservationMetas?.referral_agents?.filter(item => item?.status.code === "active")
      .map((item) => ({
        label: item?.name,
        value: item.uuid
      })) || []

  const companyOptions =
    reservationMetas?.companies?.filter(item => item?.status.code === "active")
      .map((item) => ({
        label: item?.name,
        value: item.uuid
      })) || [];


  const sourceNameOptions = {
    agency: agenciesOptions,
    company: companyOptions,
    referral_agent: referralAgentsOptions,
  }[selectedSourceType] || [];


  const reservationsEdit = useApiMutation({
    mutationFn: reservationEdit,
    invalidateKeys: [["reservation-details"]],
  });

  useEffect(() => {
    if (open && data?.reservation) {
      const reservation = data.reservation;

      const sourceTypeCode =
        reservation?.sourceType?.code?.trim()?.toLowerCase() || null;

      setSelectedSourceType(sourceTypeCode);

      form.setFieldsValue({
        refNo: reservation?.refNo || undefined,
        bookingSource: reservation?.bookedVia?.uuid || undefined,
        sourceType: reservation?.sourceType?.uuid || undefined,
      });

      // Only set sourceName when options have loaded to avoid showing UUID
      if (!metaLoading && ["agency", "company", "referral_agent"].includes(sourceTypeCode)) {
        form.setFieldValue("sourceName", reservation?.source?.uuid || undefined);
      }
    }

    if (!open) {
      form.resetFields();
      setSelectedSourceType(null);
    }
  }, [open, data, form]);

  // Set sourceName once meta options finish loading
  useEffect(() => {
    if (!metaLoading && open && data?.reservation && selectedSourceType) {
      const reservation = data.reservation;
      if (["agency", "company", "referral_agent"].includes(selectedSourceType)) {
        const currentVal = form.getFieldValue("sourceName");
        if (!currentVal) {
          form.setFieldValue("sourceName", reservation?.source?.uuid || undefined);
        }
      }
    }
  }, [metaLoading, open, data, form, selectedSourceType]);

  const handleSourceTypeChange = (value) => {
    const selected = sourceType.find((item) => item.value === value);

    const sourceTypeCode = selected?.code?.trim()?.toLowerCase() || null;

    setSelectedSourceType(sourceTypeCode);

    form.setFieldValue("sourceName", undefined);
  };

  const handleFinish = (values) => {
    const reservation = data?.reservation;

    const editValues = {
      reservation: {
        uuid: reservation.uuid,
      },
      refNo: values.refNo,
      bookedVia: values.bookingSource
        ? {
          uuid: values.bookingSource,
        }
        : undefined,
      sourceType: values.sourceType
        ? {
          uuid: values.sourceType,
        }
        : undefined,
      source:
        ["agency", "company", "referral_agent"].includes(selectedSourceType) && values.sourceName
          ? {
            uuid: values.sourceName,
          }
          : undefined,
    };

    reservationsEdit.mutate(editValues, {
      onSuccess: () => {
        form.resetFields();
        setSelectedSourceType(null);

        handleClose();

        if (onSuccess) {
          onSuccess();
        }

        Toast.success("Reservation Details Updated Successfully!");
      },
    });
  };

  const handleClose = () => {
    form.resetFields();
    setSelectedSourceType(null);

    if (onClose) {
      onClose();
    }
  };

  return (
    <Drawer
      placement="right"
      size={550}
      open={open}
      onClose={handleClose}
      title={
        <div className="flex items-center justify-between">
          <span>Edit Reservation Details</span>

          <FormButtons
            onClick={() => form.submit()}
            isPending={reservationsEdit.isPending}
          />
        </div>
      }
    >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item label="Ref No." name="refNo">
            <Input placeholder="Enter Ref No." />
          </Form.Item>

          <Form.Item label="Booking Source" name="bookingSource">
            <Select
              options={bookedVia}
              placeholder="Select Booking Source"
            />
          </Form.Item>

          <Form.Item label="Source Type" name="sourceType">
            <Select
              options={sourceType}
              placeholder="Select Source Type"
              onChange={handleSourceTypeChange}
            />
          </Form.Item>

          {["agency", "company", "referral_agent"].includes(selectedSourceType) && (
            <Form.Item
              label="Source Name"
              name="sourceName"
              rules={[{ required: true }]}
            >
              <Select
                options={sourceNameOptions}
                disabled={metaLoading}
                placeholder={`Select ${selectedSourceType === "agency"
                  ? "Agency"
                  : selectedSourceType === "referral_agent"
                    ? "Referral Agent"
                    : "Company"
                  }`}
                showSearch
                loading={metaLoading}
              />
            </Form.Item>

          )}
        </Form>
    </Drawer>
  );
};

export default ReservationDetailsForm;
