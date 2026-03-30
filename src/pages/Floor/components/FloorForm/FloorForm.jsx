import React, { useEffect } from "react";
import { Form, Input, Button, Drawer } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { createFloor, editFloor, floorDetail } from "../../../../api/floorApi";
import FormButtons from "./../../../../component/FormButtons/FormButtons";

const { TextArea } = Input;

const FloorForm = ({
  mode,
  setMode,
  selectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const createFloors = useApiMutation({
    mutationFn: createFloor,
    invalidateKeys: [["floorData"]],
    shouldInvalidate: page === 1,
  });

  const editFloors = useApiMutation({
    mutationFn: editFloor,
    invalidateKeys: [["floorData"]],
  });

  const { data } = useApiQuery({
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
    }
  }, [data, isAdd]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }
  }, [isAdd]);

  const onFinish = (values) => {
    if (isAdd) {
      createFloors.mutate(values, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Floor Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid,
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
    <div className="flex justify-center">
      <Drawer
        destroyOnClose
        size={500}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Floor Details"
                : mode === "edit"
                  ? "Edit Floor"
                  : "Add Floor"}
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
              <FormButtons
                onClick={() => form.submit()}
                isPending={
                  isAdd ? createFloors.isPending : editFloors.isPending
                }
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          validateTrigger="onSubmit"
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter floor name" }]}
          >
            <Input readOnly={isView} placeholder="Enter Floor Name" />
          </Form.Item>
          <Form.Item
            label="Floor / Zone"
            name="floorNo"
            rules={[{ required: true, message: "Please enter floor no" }]}
          >
            <Input readOnly={isView} placeholder="Enter Floor Number" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea readOnly={isView} placeholder="Enter Floor Description" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FloorForm;
