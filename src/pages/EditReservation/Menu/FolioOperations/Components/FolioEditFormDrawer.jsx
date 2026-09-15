import React, { useEffect, useMemo } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Typography,
} from "antd";
import { useApiMutation } from "../../../../../hooks/useApiMutation";
import { useApiQuery } from "../../../../../hooks/useApiQuery";
import { reservationMeta } from "../../../../../api/reservationSectionApi";
import { editFolio } from "../../../../../api/folioApi";
import Toast from "../../../../../component/Toast/Toast";
import Loader from "../../../../../component/Loader/Loader";
import dayjs from "dayjs";
import { queryClient } from "../../../../../app/queryClient";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const FolioEditFormDrawer = ({
  open,
  onClose,
  folioData,
  reservationUuid,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const { data: reservationMetaData, isLoading: reservationMetaLoading } =
    useApiQuery({
      fetchQueryName: "reservation-meta",
      fetchQueryFunction: reservationMeta,
      params: {
        reservation: { uuid: reservationUuid },
      },
      options: {
        enabled: !!open && !!reservationUuid,
      },
    });

  const guests = reservationMetaData?.folio_guests || [];
  const folioOwnerTypes = initData?.statuses?.folio_owner_type || [];
  const financialStatuses = initData?.statuses?.financial_status || [];
  const documentStatuses = initData?.statuses?.document_status || [];

  const { mutate: updateFolioMutate, isPending } = useApiMutation({
    mutationFn: editFolio,
    invalidateKeys: [["reservation-details"], ["folios"]],
    options: {
      onSuccess: () => {
        Toast.success("Folio updated successfully");
        form.resetFields();
        onClose();
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        // Toast.error(error?.message || "Failed to update folio");
        console.error("Error updating folio:", error);
      },
    },
  });

  useEffect(() => {
    if (open && folioData) {
      form.setFieldsValue({
        folioOwnerType: folioData.folioOwnerType?.uuid,
        financialStatus: folioData.financialStatus?.uuid,
        documentStatus: folioData.documentStatus?.uuid,
        dueDate: folioData.dueDate ? dayjs(folioData.dueDate) : null,
        closedAt: folioData.closedAt ? dayjs(folioData.closedAt) : null,
        remark: folioData.remark || "",
      });
    }
  }, [open, folioData, form]);

  const onFinish = (values) => {
    const payload = {
      folio: {uuid: folioData?.uuid},
      guest: values.guest ? { uuid: values.guest } : undefined,
      folioOwnerType: values.folioOwnerType
        ? { uuid: values.folioOwnerType }
        : null,
      financialStatus: values.financialStatus
        ? { uuid: values.financialStatus }
        : null,
      documentStatus: values.documentStatus
        ? { uuid: values.documentStatus }
        : null,
      dueDate: values.dueDate
        ? values.dueDate.format("YYYY-MM-DD")
        : null,
      closedAt: values.closedAt
        ? values.closedAt.format("YYYY-MM-DD HH:mm:ss")
        : null,
      remark: values.remark,
    };

    updateFolioMutate(payload);
  };

  const guestOptions = useMemo(() => {
    if (!Array.isArray(guests)) return [];
    return guests
      .filter((guest) => guest.uuid !== folioData?.guest?.uuid)
      .map((guest) => ({
        label: guest.name,
        value: guest.uuid,
      }));
  }, [guests, folioData?.guest?.uuid]);

  const folioOwnerTypeOptions = useMemo(() => {
    if (!Array.isArray(folioOwnerTypes)) return [];
    return folioOwnerTypes.map((type) => ({
      label: type.name,
      value: type.uuid,
    }));
  }, [folioOwnerTypes]);

  const financialStatusOptions = useMemo(() => {
    if (!Array.isArray(financialStatuses)) return [];
    return financialStatuses.map((status) => ({
      label: status.name,
      value: status.uuid,
    }));
  }, [financialStatuses]);

  const documentStatusOptions = useMemo(() => {
    if (!Array.isArray(documentStatuses)) return [];
    return documentStatuses.map((status) => ({
      label: status.name,
      value: status.uuid,
    }));
  }, [documentStatuses]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnHidden
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Edit Folio</span>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isPending}
          >
            Update
          </Button>
        </div>
      }
    >
      {reservationMetaLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Folio Number (read-only) */}
          <Form.Item label={<span className="font-medium">Folio No</span>}
          rules={[{ required: true, message: "Required" }]}>
            <Input
              value={folioData?.folioNo || ""}
              // disabled
              readOnly={true}
              className="rounded w-full"
            />
          </Form.Item>

          {/* Current Guest (read-only) */}
          <Form.Item label={<span className="font-medium">Guest</span>}>
            <Input
              value={folioData?.guest?.name || ""}
              readOnly
              className="rounded w-full bg-gray-50"
            />
          </Form.Item>

          {/* Change Guest */}
          <Form.Item
            label={<span className="font-medium">Change Guest</span>}
            name="guest"
          >
            <Select
              placeholder="Select new guest"
              allowClear
              options={guestOptions}
              className="w-full rounded"
              showSearch={{
                filterOption: (input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
            />
          </Form.Item>

          {/* Folio Owner Type */}
          <Form.Item
            label={<span className="font-medium">Folio Owner Type</span>}
            name="folioOwnerType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              placeholder="Select owner type"
              options={folioOwnerTypeOptions}
              className="w-full rounded"
            />
          </Form.Item>

          {/* Financial Status */}
          {/* <Form.Item
            label={<span className="font-medium">Financial Status</span>}
            name="financialStatus"
          >
            <Select
              placeholder="Select financial status"
              options={financialStatusOptions}
              className="w-full rounded"
            />
          </Form.Item> */}

          {/* Document Status */}
          {/* <Form.Item
            label={<span className="font-medium">Document Status</span>}
            name="documentStatus"
          >
            <Select
              placeholder="Select document status"
              options={documentStatusOptions}
              className="w-full rounded"
            />
          </Form.Item> */}

          {/* Due Date */}
          {/* <Form.Item
            label={<span className="font-medium">Due Date</span>}
            name="dueDate"
          >
            <DatePicker
              className="w-full rounded"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item> */}

          {/* Closed At */}
          {/* <Form.Item
            label={<span className="font-medium">Closed At</span>}
            name="closedAt"
          >
            <DatePicker
              className="w-full rounded"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item> */}

          {/* Remark */}
          <Form.Item
            label={<span className="font-medium">Remark</span>}
            name="remark"
          >
            <TextArea
              rows={3}
              placeholder="Enter remark..."
              className="rounded w-full"
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default FolioEditFormDrawer;
