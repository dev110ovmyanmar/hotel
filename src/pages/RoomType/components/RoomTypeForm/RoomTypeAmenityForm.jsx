import {
  Drawer,
  Input,
  Form,
  Select,
  Switch,
  Checkbox,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import {
  createRoomTypeAmenity,
  editRoomTypeAmenity,
  roomMeta,
} from "../../../../api/roomApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { queryClient } from "../../../../app/queryClient";
import { useEffect } from "react";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import PriceInput from "../../../../component/PriceInput/PriceInput";

const RoomAttributesForm = ({
  mode,
  open,
  setDrawerOpen,
  roomTypeUuid,
  selectedAmenity,
}) => {
  const [form] = Form.useForm();

  const isAdd = mode === "add";
  const isEdit = mode === "edit";
  const isFree = Form.useWatch("isFree", form);

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomTypeAmenities = roomMetaData?.amenities?.map((amenity) => ({
    value: amenity.uuid,
    label: amenity.name,
  }));

  const createRoomTypeAmenities = useApiMutation({
    mutationFn: createRoomTypeAmenity,
    invalidateKeys: [["roomTypeData", { uuid: roomTypeUuid }]],
  });

  const editRoomTypeAmenities = useApiMutation({
    mutationFn: editRoomTypeAmenity,
    invalidateKeys: [["roomTypeData"]],
  });

  useEffect(() => {
    if (open) {
      if (isEdit && selectedAmenity) {
        form.setFieldsValue({
          roomTypeAmenityUuid: selectedAmenity?.amenity?.uuid,
          extraPrice: selectedAmenity?.extraPrice,
          isFree: selectedAmenity?.isFree ? 1 : 0,
          // isFree: !!selectedAmenity?.isFree,
        });
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [open, selectedAmenity, mode, form]);

  const handleClose = () => {
    setDrawerOpen(false);
    form.resetFields();
  };
  const onFinish = (values) => {
    const payload = {
      extraPrice: Number(values.extraPrice),
      isFree: Boolean(values.isFree),
      amenity: { uuid: values.roomTypeAmenityUuid },
      roomType: { uuid: roomTypeUuid },
    };

    if (isAdd) {
      createRoomTypeAmenities.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "roomTypeData",
            { uuid: roomTypeUuid },
          ]);
          form.resetFields();
          setDrawerOpen(false);
          Toast.success("Room Type Amenity Created Successfully!");
        },
      });
    }

    if (isEdit) {
      editRoomTypeAmenities.mutate(
        { uuid: selectedAmenity?.uuid, ...payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([
              "roomTypeData",
              { uuid: roomTypeUuid },
            ]);
            setDrawerOpen(false);
            Toast.success("Room Type Amenity Updated Successfully!");
          },
        },
      );
    }
  };

  return (
    <Drawer
      size={550}
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "edit"
              ? "Edit Room Type Amenity"
              : "Add Room Type Amenity"}
          </span>
          <FormButtons
            onClick={() => form.submit()}
            isPending={
              createRoomTypeAmenities.isPending ||
              editRoomTypeAmenities.isPending
            }
            mode={mode}
          />
        </div>
      }
      open={open}
      onClose={handleClose}
      destroyOnClose
    >
      {open && (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isFree: 0 }}
        >
          <Form.Item
            label="Room Amenity"
            name="roomTypeAmenityUuid"
            rules={[{ required: true, message: "Select attribute" }]}
          >
            <Select
              options={roomTypeAmenities}
              placeholder="Select Attribute"
            />
          </Form.Item>

          {/* <Form.Item
            label="Is Free"
            name="isFree"
            valuePropName="checked"
            rules={[{ required: true }]}
          >
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              onChange={(checked) => {
                if (checked) {
                  form.setFieldsValue({ extraPrice: 0 });
                } else {
                  form.setFieldsValue({ extraPrice: undefined });
                }
              }}
            />
          </Form.Item> */}
          <Form.Item
            // label="Is Free"
            name="isFree"
            initialValue={false}
            valuePropName="checked"
            rules={[{ required: true, message: "Please select billing type!" }]}
          >
            <Checkbox>This item is free</Checkbox>
          </Form.Item>

          {/* <Form.Item
            label="Extra Price"
            name="extraPrice"
          >
            <InputNumber
              className="!w-full"
              min={1}
              readOnly={isFree}
              placeholder="Enter Extra Price"
              suffix="MMK"
              formatter={priceFormatter}
              parser={priceParser}
            />
          </Form.Item> */}
          {!isFree && (
            <Form.Item
              label="Extra Price"
              name="extraPrice"
              rules={[{ required: true, message: "Please enter extra price!" }]}
              getValueProps={(value) => ({ value: value !== null && value !== undefined ? String(value) : "" })}
            >
              <PriceInput
                min={1}
                placeholder="Enter Extra Price"
                suffix="MMK"
              />
            </Form.Item>
          )}
        </Form>
      )}
    </Drawer>
  );
};

export default RoomAttributesForm;
