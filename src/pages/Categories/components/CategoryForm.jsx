import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import { useApiMutation } from "../../../hooks/useApiMutation";
import useApiQuery from "../../../hooks/useApiQuery";
import { queryClient } from "../../../app/queryClient";
import { upsertCategory, getCategoryDetail } from "../../../api/categoryApi";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const CategoryForm = ({
  mode,
  switchToEdit,
  page,
  setPage,
  selectedRow,
  setSelectedRow,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.CATEGORY_EDIT);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  //status & department uuid
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

  const departmentOptions =
    initData?.departments?.map((item) => ({
      value: item.uuid,
      label: item.name,
    })) || [];

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "category_detail",
    fetchQueryFunction: getCategoryDetail,
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
        department: data?.department?.uuid,
        description: data?.description,
        status: data?.status?.uuid
      });
    }
  }, [data, mode]);

  const createCategory = useApiMutation({
    mutationFn: upsertCategory,
    invalidateKeys: [["categories"]],
    shouldInvalidate: page === 1
  });

  const editCategory = useApiMutation({
    mutationFn: upsertCategory,
    invalidateKeys: [["categories"]],
  });

editCategory
  const onFinish = (values) => {
    const basePayload = {
      name: values.name,
      department: { uuid: values.department },
      description: values.description,
      status: { uuid: values.status }
    };

    if (isAdd) {
      createCategory.mutate(basePayload, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Category Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...basePayload,
        department: { uuid: values.department },
        description: values.description,
        uuid: data?.uuid,
      };
      editCategory.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Category Updated Successfully!");
        },
      });
    }
  }

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Category Details"
    : isEdit
      ? "Edit Category"
      : "Add Category";

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          {DrawerTitle}
          {
            isView ? (
              canEdit && (
                <Button type="primary" onClick={switchToEdit}>Edit</Button>
              )
            ) : (
              <FormButtons onClick={() => form.submit()} mode={mode} isPending={editCategory?.isPending} />
            )
          }
        </div>
      }
      size={550} // size={550} is not a valid AntD prop, use width
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
      {isLoading ?
        <div className="flex items-center justify-center h-full min-h-[300px]">
          <Loader />
        </div> : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input category name!" }]}
            >
              <Input placeholder="Enter Category Name" readOnly={isView} />
            </Form.Item>

            {isView ? (
              <Form.Item label="Department">
                <Input
                  readOnly
                  value={data?.department?.name}
                  className="bg-white text-black cursor-default border-gray-200"
                  variant="outlined"
                />
              </Form.Item>
            ) : (
              <Form.Item label="Department" name="department"
                rules={[{ required: true, message: "Department is required" }]} >
                <Select
                  options={departmentOptions}
                  className="w-full"
                  showSearch
                  placeholder="Select Department"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            )}

            <Form.Item label="Description" name="description">
              <Input.TextArea rows={2}
                readOnly={isView}
                style={{ cursor: isView ? "default" : "text" }}
                placeholder="Enter Description"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Status is required" }]}
              getValueProps={(value) => ({
                value: isView
                  ? statusOptions.find((item) => item.value === value)?.label
                  : value,
              })}
            >
              {isView ? (
                <Input readOnly={isView} />
              ) : (
                <Select options={statusOptions} placeholder="Select Status" />
              )}
            </Form.Item>
          </Form>
        )
      }
    </Drawer >
  );
};

export default CategoryForm;