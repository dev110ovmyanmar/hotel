import dayjs from "dayjs";
import { Drawer, Form, Input, InputNumber, Button, Radio , Select} from "antd";
import { createFolioLineNewPost } from "../../../../../api/folioApi";
import { reservationRoomMeta } from "../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../hooks/useApiMutation";
import { useApiQuery } from "../../../../../hooks/useApiQuery";
import Toast from "../../../../../component/Toast/Toast";
import { darkModeStyle } from "../../../../../utils";
import PriceInput from "../../../../../component/PriceInput/PriceInput";

const { TextArea } = Input;

const today = () => dayjs().format("YYYY-MM-DD");

const AddFolioLineNewPost = ({
  open,
  onClose,
  reservationUuid,
}) => {
  const [form] = Form.useForm();

  const itemTypeOptions = [
    {
      label: "Early Check In",
      value: "early_checkin"
    },
    {
      label: "Late Check Out",
      value: "late_checkout"
    }
  ]

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
      searchLabel: room?.room?.roomNo,
      label: (
        <div className="flex w-full items-center justify-between gap-3">
          <span className="font-medium text-neutral-800">
            {room?.room?.roomNo}
          </span>
          <span className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {room?.roomType?.name}
          </span>
        </div>
      ),
    })) || [];


  const { mutate: createCharge, isPending } = useApiMutation({
    mutationFn: createFolioLineNewPost,
    invalidateKeys: [["folios"], ["reservation-details"]],
    options: {
      onSuccess: () => {
        Toast.success("New Folio Line created successfully");
        onClose();
        form.resetFields();
      },
      // onError: (err) => {
      //   Toast.error(err?.message || "Failed to create overtime charge");
      // },
    },
  });

  const onFinish = (values) => {
    const selectedRoom = reservationRoom?.rooms?.find(
      (room) => room?.uuid === values.reservationRoomUuid
    );

    const chargeDate =
      values.itemType === "early_checkin"
        ? dayjs(selectedRoom?.checkinDate).format("YYYY MM DD")
        : dayjs(selectedRoom?.checkoutDate).format("YYYY MM DD");

    const payload = {
      reservationRoom: { uuid: values.reservationRoomUuid },
      itemType: values.itemType,
      chargeDate,
      amount: Number(values.amount),
      remark: values.description?.trim() || "",
    };

    createCharge(payload);
  };

  return (
    <Drawer
      title="Folio Line New Post"
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
            options={itemTypeOptions}
          />
        </Form.Item>

                <Form.Item
          name="reservationRoomUuid"
          label="Room"
          rules={[{ required: true, message: "Please select a room" }]}
          // initialValue={reservationRoomUuid}
        >
          <Select
            placeholder="Select a Room"
            options={rooms}
            loading={reservationRoomFetching}
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

      </Form>
    </Drawer>
  );
};

export default AddFolioLineNewPost;
