import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import { useApiMutation } from "../../../hooks/useApiMutation";
import useApiQuery from "../../../hooks/useApiQuery";
import { upsertUnit, getUnitDetail } from "../../../api/unitApi";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const UnitForm = ({
  mode,
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

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.UNIT_EDIT);

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
        status: data.status?.uuid
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
    const basePayload = {
      name: values.name,
      shortName: values.shortName,
      status: { uuid: values.status }
    };

    if (isAdd) {
      createUnit.mutate(basePayload, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          Toast.success("Unit Created Successfully!");
        },
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
        }
      });
    }
  }

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Unit Details"
    : isEdit
      ? "Edit Unit"
      : "Add Unit";

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>
            {DrawerTitle}
          </span>
          {
            isView ? (
              canEdit && (
                <Button type="primary" onClick={switchToEdit}>
                  Edit
                </Button>
              )
            ) : (
              <FormButtons onClick={() => form.submit()} mode={mode} />
            )
          }
        </div>
      }
      size={550}
      afterOpenChange={(open) => {
        if (open && isAdd) {
          form.resetFields();
          const defaultStatus = statusOptions?.find((s) => s.label.toLowerCase() === 'active')?.value;
          form.setFieldsValue({ status: defaultStatus });
        }
      }}
      onClose={onClose}
      open={drawerOpen}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <Loader />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter unit name!" }]}
          >
            <Input placeholder="Enter Unit Name" readOnly={isView} />
          </Form.Item>

          <Form.Item
            label="Short Name"
            name="shortName"
            rules={[
              { required: true, message: "Please enter unit short name!" },
            ]}
          >
            <Input placeholder="Enter Unit Short Name" readOnly={isView} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select
              options={statusOptions || []}
              placeholder="Select Status"
              open={isView ? false : undefined}
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default UnitForm;
