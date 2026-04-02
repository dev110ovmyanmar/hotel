import React, { useEffect } from "react";
import { Form, Input, Button, Drawer, Row, Col } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import {
  createRoomAttribute,
  editRoomAttribute,
  roomAttributeDetails,
} from "../../../../api/roomApi";
import Loader from "../../../../component/Loader/Loader"

const RoomAttributeForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
  page
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const createRoomAttributes = useApiMutation({
    mutationFn: createRoomAttribute,
    invalidateKeys: [["roomAttributeData"]],
    shouldInvalidate: page === 1,
  });

  const editRoomAttributes = useApiMutation({
    mutationFn: editRoomAttribute,
    invalidateKeys: [["roomAttributeData"]],
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roomAttributeData",
    fetchQueryFunction: roomAttributeDetails,
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

      createRoomAttributes.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Attribute Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        uuid: data?.uuid,
      };

      editRoomAttributes.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Room Attribute Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Attribute Details"
                : mode === "edit"
                  ? "Edit Room Attribute"
                  : "Create Room Attribute"}
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
                isPending={
                  createRoomAttributes.isPending || editRoomAttributes.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
        {
          isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Loader />
            </div>
          ) :
            (
              <Form
                form={form}
                layout="vertical"
                style={{ width: "100%" }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input readOnly={isView} placeholder="Enter Room Attribute Name" />
                </Form.Item>
              </Form>
            )
        }
      </Drawer>
    </div >
  );
};

export default RoomAttributeForm;
