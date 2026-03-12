import React, { useEffect } from "react";
import { Form, Input, Button, Drawer } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButton from "../../../../component/FormButtons/FormButtons";
import { createFloor, editFloor, floorDetail } from "../../../../api/floorApi";
import TextArea from "antd/es/input/TextArea";

const FloorForm = ({
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

  const createFloors = useApiMutation({
    mutationFn: createFloor,
    invalidateKeys: [["floorData"]],
  });

  const editFloors = useApiMutation({
    mutationFn: editFloor,
    invalidateKeys: [["floorData"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "floorData",
    fetchQueryFunction: floorDetail,
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

      createFloors.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Floor Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        uuid: data?.uuid,
      };

      editFloors.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Floor Updated Successfully!");
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
                ? "Floor Details"
                : mode === "edit"
                  ? "Edit Floor"
                  : "Create Floor"}
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
                isPending={createFloors.isPending || editFloors.isPending}
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
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter floor name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Floor No"
            name="floorNo"
            rules={[{ required: true, message: "Please enter floor no" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Descriptiom" name="description">
            <TextArea />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FloorForm;
