import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import { useApiMutation } from "../../../hooks/useApiMutation";
import useApiQuery from "../../../hooks/useApiQuery";
import { upsertUnit, getUnitDetail } from "../../../api/unitApi";

const UnitForm = ({
  mode,
  units = [],
  loading = false,
  switchToEdit,
  page,
  setPage,
  selectedRow,
  setSelectedRow,
  drawerOpen,
  setDrawerOpen,
  statusOptions
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "unit_detail",
    fetchQueryFunction: getUnitDetail,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen,
    }
  });

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else if (data) {
      form.setFieldsValue({
        ...data,
        statusUuid: data.status?.uuid
      });
    }
  }, [data, mode]);

  const createUnit = useApiMutation({
    mutationFn: upsertUnit,
    invalidateKeys: [["units"]],
    shouldInvalidate: page === 1
  });

  const editUnit = useApiMutation({
    mutationFn: upsertUnit,
    invalidateKeys: [["units"]],
  });


  const onFinish = (values) => {
    console.log('Form values:', values);

    // Validate required fields
    if (!values.statusUuid) {
      Toast.error('Please select a status');
      return;
    }

    const basePayload = {
      name: values.name,
      shortName: values.shortName,
      status: { uuid: values.statusUuid }
    };

    console.log('Final payload:', basePayload);

    if (isAdd) {
      createUnit.mutate(basePayload, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          Toast.success("Unit Created Successfully!");
        },
        onError: (error) => {
          console.error('Create error:', error);
          Toast.error(error?.response?.data?.error?.text || 'Failed to create unit');
        }
      });
    }
    if (isEdit) {
      const editValues = {
        ...basePayload,
        uuid: data?.uuid,
      };
      editUnit.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Unit Updated Successfully!");
        },
        onError: (error) => {
          console.error('Update error:', error);
          Toast.error(error?.response?.data?.error?.text || 'Failed to update unit');
        }
      });
    }
  }


  // Use watch to get the value in real-time for the read-only display
  const currentStatusUuid = Form.useWatch("statusUuid", form);
  const getStatusLabel = (val) =>
    statusOptions?.find((s) => s.value === val)?.label || "-";

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Unit View"
    : isEdit
      ? "Unit Edit"
      : "Unit Create";

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>
            {DrawerTitle}
          </span>
          {isView ? (
            <Button type="primary" onClick={switchToEdit}>
              Edit
            </Button>
          ) : (
            <FormButtons onClick={() => form.submit()} mode={mode} />
          )}
        </div>
      }
      size={550}
      onClose={onClose}
      open={drawerOpen}
      destroyOnClose
    >
      {loading ? (
        <Loader />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input unit name!" }]}
          >
            <Input placeholder="e.g. Guest Amenities" readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Short Name"
            name="shortName"
            rules={[
              { required: true, message: "Please input unit short name!" },
            ]}
          >
            <Input placeholder="e.g. Guest Amenities" readOnly={isView} />
          </Form.Item>

          <Form.Item
            name="statusUuid"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            {/* {isView ? (
              <div className="border border-gray-200 rounded-lg px-4 h-11 flex items-center bg-gray-50 text-gray-600">
                {getStatusLabel(currentStatusUuid)}
              </div>
            ) : ( */}
            <Select
              options={statusOptions || []}
              placeholder="Select Status"
              open={isView ? false : undefined}
            />
            {/* )} */}
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UnitForm;
