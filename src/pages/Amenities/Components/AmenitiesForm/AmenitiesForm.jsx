import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Switch, Row, Col } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { amenitiesDetails, upsertAmenity } from "../../../../api/amenitiesApi";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import Loader from "../../../../component/Loader/Loader";
import { PERMISSIONS } from "../../../../variables/permission";
import usePermission from "../../../../hooks/usePermission";

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

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.AMENITY_EDIT);

  const upsertAmenities = useApiMutation({
    mutationFn: upsertAmenity,
    invalidateKeys: [["amenities"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isLoading, error } = useApiQuery({
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

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

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
          handleClose();
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
          handleClose();
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
        onClose={handleClose}
        destroyOnClose={true}
        size={550}
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
              canEdit && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMode("edit");
                  }}
                >
                  Edit
                </Button>
              )
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
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
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
                <Form.Item
                  label="Is Free"
                  name="isFree"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="True"
                    unCheckedChildren="False"
                    disabled={isView}
                  />
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
        )}
      </Drawer>
    </div>
  );
};

export default AmenitiesForm;
