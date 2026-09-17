import React, { useEffect, useState } from "react";
import { Drawer, Form, Input, Select } from "antd";
import { useParams } from "react-router-dom";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  reservationDetails,
  reservationEdit,
  reservationMeta,
} from "../../../../api/reservationSectionApi";
import { queryClient } from "../../../../app/queryClient";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import Loader from "../../../../component/Loader/Loader";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const ReservationDetailsForm = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const { bookingId: reservationRoomUuid } = useParams();
  const [selectedSourceType, setSelectedSourceType] = useState(null);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const { data, isLoading: detailsLoading } = useApiQuery({
    fetchQueryName: "reservation-details",
    fetchQueryFunction: reservationDetails,
    params: {
      reservationRoom: {
        uuid: reservationRoomUuid,
      },
    },
    options: {
      enabled: !!reservationRoomUuid && open,
    },
  });

  const { data: reservationMetas, isLoading: metaLoading } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
    options: {
      enabled: open,
    },
  });

  const formatSourceLabel = (item) => {
    if (!item) return "";

    const value = item.chargeValue;
    const typeCode = item.chargeType?.code?.trim()?.toLowerCase();

    if (value === null || value === undefined) {
      return item.name;
    }

    return (
      <span>
        {item.name}{" "}
        ({" "}
        {typeCode === "flat" ? (
          <>
            <PriceTag value={value} /> MMK
          </>
        ) : (
          <>
            {value} %
          </>
        )}
        {" "} )
      </span>
    );
  };

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
        sourceName: reservation?.source?.uuid || undefined,
      });
    }

    if (!open) {
      form.resetFields();
      setSelectedSourceType(null);
    }
  }, [open, data, form]);

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
      loading={detailsLoading}
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
      {metaLoading || detailsLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
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
                placeholder={`Select ${selectedSourceType === "agency"
                  ? "Agency"
                  : selectedSourceType === "referral_agent"
                    ? "Referral Agent"
                    : "Company"
                  }`}
                showSearch
              />
            </Form.Item>

          )}
        </Form>
      )}
    </Drawer>
  );
};

export default ReservationDetailsForm;
