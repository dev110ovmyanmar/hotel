import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Space, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { CloseOutlined } from "@ant-design/icons";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { FiEdit } from "react-icons/fi";
import {
  amenitiesDetailsFun,
  createAmenitiesFun,
  editAmenitiesFun,
} from "../../../../api/amenitiesFunctionApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";

const AmenitiesForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const createAmenitiesFunction = useApiMutation({
    mutationFn: createAmenitiesFun,
    invalidateKeys: [["amenities"]],
  });

  const editAmenitiesFunction = useApiMutation({
    mutationFn: editAmenitiesFun,
    invalidateKeys: [["amenities"]],
  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "amenities",
    fetchQueryFunction: amenitiesDetailsFun,
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
  }, [data, isEdit]);

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }
  }, [isAdd]);

  const onFinish = (values) => {
    console.log(values, "ValuesInOnCreateFinish");
    if (isAdd) {
      createAmenitiesFunction.mutate(values, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Country Created Successfully!");
          form.resetFields();
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        uuid: selectedData?.uuid,
      };

      editAmenitiesFunction.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Country Updated Successfully!");
        },
      });
    }
  };

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Amenitities Details"
                : mode === "edit"
                  ? "Edit Amenitities"
                  : "Add New Amenitities"}
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
                  createAmenitiesFunction.isLoading ||
                  editAmenitiesFunction.isLoading
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
          // labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
          // wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
          // className="w-full px-4 max-w-lg md:max-w-2xl"
          validateTrigger="onSubmit"
          onFinish={onFinish}
          disabled={isView}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Amenity Name is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Amenity Code is Required" }]}
          >
            <Input readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Is Free"
            name="isFree"
            rules={[{ required: true, message: "Is Free  is Required" }]}
          >
            <Select
              options={[
                { label: "Yes", value: 1 },
                { label: "No", value: 0 },
              ]}
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>

          <Form.Item
            label="Visibility"
            name="visibility"
            rules={[{ required: true, message: "Visibility  is Required" }]}
          >
            <Select
              options={[
                { label: "Yes", value: 1 },
                { label: "No", value: 0 },
              ]}
              open={isView ? false : undefined}
            ></Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default AmenitiesForm;
