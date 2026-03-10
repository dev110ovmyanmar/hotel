import React, { useEffect } from "react";
import { Form, Input, Button, Drawer, Row, Col } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import {
  createRoomType,
  editRoomType,
  roomTypeDetails,
} from "../../../../api/roomApi";
import TextArea from "antd/es/input/TextArea";

const RoomTypeForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const createRoomTypes = useApiMutation({
    mutationFn: createRoomType,
    invalidateKeys: [["roomTypeData"]],
  });

  const editRoomTypes = useApiMutation({
    mutationFn: editRoomType,
    invalidateKeys: [["roomTypeData"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "roomTypeData",
    fetchQueryFunction: roomTypeDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
      });
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
      };

      createRoomTypes.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Type Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,

        uuid: data?.uuid,
      };

      editRoomTypes.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Type Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Type Details"
                : mode === "edit"
                  ? "Edit Room Type"
                  : "Create Room Type"}
            </span>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={createRoomTypes.isLoading || editRoomTypes.isLoading}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
          disabled={isView}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter room type name" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: "Please enter short name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Max Adults"
                name="maxAdults"
                rules={[
                  { required: true, message: "Please enter maximum adults" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Max Children"
                name="maxChildren"
                rules={[
                  { required: true, message: "Please enter maximum children" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Max Occupancy"
                name="maxOccupancy"
                rules={[
                  { required: true, message: "Please enter maximum occupancy" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Total Rooms"
                name="totalRooms"
                rules={[
                  { required: true, message: "Please enter total rooms" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Base Price"
                name="basePrice"
                rules={[{ required: true, message: "Please enter base price" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Room Size" name="areaSize">
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            placeholder="Enter full room description"
          >
            <TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomTypeForm;
