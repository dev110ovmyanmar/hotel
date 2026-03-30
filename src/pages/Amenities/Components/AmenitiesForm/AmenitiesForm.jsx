import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Switch,
  Row,
  Col,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  amenitiesDetails,
  upsertAmenity,
} from "../../../../api/amenitiesApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";

const AmenitiesForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const upsertAmenities = useApiMutation({
    mutationFn: upsertAmenity,
    invalidateKeys: [["amenities"]],
    shouldInvalidate: isEdit ? true : page === 1

  });

  const { data, isPending, error } = useApiQuery({
    fetchQueryName: "amenity-details",
    fetchQueryFunction: amenitiesDetails,
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
    if (isAdd) {
      upsertAmenities.mutate(values, {
        onSuccess: () => {
          setPage(1);
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

      upsertAmenities.mutate(editValues, {
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
                isPending={upsertAmenities?.isPending}
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
          initialValues={{
            isFree: false,
            visibility: false,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Amenity Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Amenity Name" />
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Amenity Code is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Amenity Code" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Is Free" name="isFree" valuePropName="checked">
                <Switch
                  checkedChildren="True"
                  unCheckedChildren="False"
                  disabled={isView} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Visibility"
                name="visibility"
                valuePropName="checked"
              >
                <Switch
                  disabled={isView}
                  checkedChildren="True"
                  unCheckedChildren="False"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default AmenitiesForm;




