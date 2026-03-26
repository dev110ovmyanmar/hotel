import React, { useEffect } from "react";
import { Button, Form, Input, Drawer, Select } from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import { useApiMutation } from "../../../hooks/useApiMutation";
import useApiQuery from "../../../hooks/useApiQuery";
import { upsertCategory, getCategoryDetail } from "../../../api/categoryApi";

const CategoryForm = ({
  mode,
  categories = [],
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


  const onFinish = (values) => {
    const basePayload = {
      name: values.name,
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



  // Use watch to get the value in real-time for the read-only display
  const currentStatusUuid = Form.useWatch("statusUuid", form);
  const getStatusLabel = (val) => statusOptions.find((s) => s.value === val)?.label || "-";

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const DrawerTitle = isView
    ? "Category View"
    : isEdit
      ? "Category Edit"
      : "Category Create";

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full">
          <span>{mode === "view" ? "View Category" : mode === "edit" ? "Edit Category" : "Add Category"}</span>
          {isView ? (
            <Button type="primary" onClick={switchToEdit}>Edit</Button>
          ) : (
            <FormButtons onClick={() => form.submit()} mode={mode} />
          )}
        </div>
      }
      size={500} // size={500} is not a valid AntD prop, use width
      onClose={onClose}
      open={drawerOpen}
      destroyOnClose
    >
      {loading ? <Loader /> : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input placeholder="e.g. Guest Amenities" readOnly={isView} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            {/* {isView ? (
              <div className="border border-gray-200 rounded-lg px-4 h-11 flex items-center bg-gray-50 text-gray-600">
                {getStatusLabel(currentStatusUuid)}
              </div>
            ) : (
              <Select 
                options={statusOptions} 
                className="h-11" 
                placeholder="Select Status" 
              />
            )} */}
            <Select
              options={statusOptions}
              // className="h-11" 
              placeholder="Select Status"
              disabled={isView}
            />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

export default CategoryForm;