import { useEffect } from "react";
import dayjs from "dayjs";
import { Drawer, Form, Input, InputNumber, Button, Radio , Select, DatePicker} from "antd";
import { createFolioLineNewPost } from "../../../../../api/folioApi";
import { reservationRoomMeta } from "../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../hooks/useApiMutation";
import { useApiQuery } from "../../../../../hooks/useApiQuery";
import Toast from "../../../../../component/Toast/Toast";
import { darkModeStyle } from "../../../../../utils";
import PriceInput from "../../../../../component/PriceInput/PriceInput";
import { queryClient } from "../../../../../app/queryClient";

const { TextArea } = Input;

const AddFolioLineNewPost = ({
  open,
  onClose,
  reservationUuid,
}) => {
  const [form] = Form.useForm();
  const itemType = Form.useWatch("itemType", form);
  const reservationRoomUuid = Form.useWatch("reservationRoomUuid", form);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const folioItemTypeOptions = initData?.statuses?.folio_item_type?.map(({name, code})=>({label:name, value:code}));

  const { data: reservationRoom, isFetching: reservationRoomFetching } = useApiQuery({
      fetchQueryName: "reservation-room-fetching",
      fetchQueryFunction: reservationRoomMeta,
      params: {
        reservation: {
          uuid: reservationUuid,
        },
      },
      options: { enabled: !!reservationUuid },
    });

const rooms =
  reservationRoom?.rooms
    ?.filter((room) => room?.roomStatus?.code === "checked_in")
    ?.map((room) => ({
      value: room?.uuid,
      searchLabel: `${room?.room?.roomNo} ${room?.roomType?.name}`,
      label: (
        <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-800">
              {room?.room?.roomNo}
            </span>
            <span className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {room?.roomType?.name}
            </span>
          </div>
        </div>
      ),
    })) || [];

  const selectedRoom = reservationRoom?.rooms?.find(
    (room) => room?.uuid === reservationRoomUuid
  );

  // Auto-fill chargeDate for early_checkin / late_checkout
  useEffect(() => {
    if (!selectedRoom) return;

    if (itemType === "early_checkin") {
      form.setFieldsValue({ chargeDate: dayjs(selectedRoom.checkinDate) });
    } else if (itemType === "late_checkout") {
      form.setFieldsValue({ chargeDate: dayjs(selectedRoom.checkoutDate) });
    } else {
      form.setFieldsValue({ chargeDate: null });
    }
  }, [itemType, selectedRoom, form]);

  const disabledDate = (current) => {
    if (!selectedRoom || itemType === "early_checkin" || itemType === "late_checkout") return false;
    const checkin = dayjs(selectedRoom.checkinDate).startOf("day");
    const checkout = dayjs(selectedRoom.checkoutDate).endOf("day");
    return current && (current.isBefore(checkin) || current.isAfter(checkout));
  };


  const { mutate: createCharge, isPending } = useApiMutation({
    mutationFn: createFolioLineNewPost,
    invalidateKeys: [["folios"], ["reservation-details"]],
    options: {
      onSuccess: () => {
        Toast.success("New Folio Line created successfully");
        onClose();
        form.resetFields();
      },
      onError: (err) => {
       console.log(err)
       form.resetFields();
      },
    },
  });

  const onFinish = (values) => {
    const chargeDate = dayjs(values.chargeDate).format("YYYY-MM-DD");

    const payload = {
      reservationRoom: { uuid: values.reservationRoomUuid },
      itemType: values.itemType,
      chargeDate,
      amount: Number(values.amount),
      ...(values.description?.trim() && { description: values.description.trim() }),
      ...(values.remark?.trim() && { remark: values.remark.trim() }),
    };

    createCharge(payload);
  };

  return (
    <Drawer
      title="Add New Post"
      open={open}
      onClose={onClose}
      size={550}
      extra={
        <Button
          type="primary"
          onClick={() => form.submit()}
          loading={isPending}
        >
          Create
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ itemType: "early_checkin" }}
      >
        <Form.Item
          name="itemType"
          label="Overtime Type"
          rules={[{ required: true, message: "Please select an overtime type" }]}
        >
          <Select
            options={folioItemTypeOptions}
          />
        </Form.Item>

        <Form.Item
          name="reservationRoomUuid"
          label="Room"
          rules={[{ required: true, message: "Please select a room" }]}
        >
          <Select
            placeholder="Select a Room"
            options={rooms}
            showSearch
            optionFilterProp="searchLabel"
            filterOption={(input, option) =>
            String(option?.searchLabel ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
            }
            loading={reservationRoomFetching}
          />
        </Form.Item>

        <Form.Item
        name="chargeDate"
        label="Charge Date"
        rules={[{ required: true, message: "Please select an charge date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={disabledDate}
            disabled={itemType === "early_checkin" || itemType === "late_checkout"}
          />
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
              { required: true, message: "Required" },
            ]}
          >
            <PriceInput
            min={1}
            placeholder="Enter Amount"
            />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            rows={1}
            placeholder="Add description..."
            className={`no-radius-input ${darkModeStyle}`}
          />
        </Form.Item>

      <Form.Item label="Remark" name="remark">
          <TextArea
            rows={2}
            placeholder="Add Remark..."
            className={`no-radius-input ${darkModeStyle}`}
          />
        </Form.Item>

      </Form>
    </Drawer>
  );
};

export default AddFolioLineNewPost;
