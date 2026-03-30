import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer, InputNumber } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import {
  menuCategoryDetails,
  upsertMenuCategory,
} from "../../../../api/menuCategory";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import Status from "../../../../component/Status/Status";

const MenuCategoryForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  console.log(page, "page");
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const status = initData?.statuses?.status;

  const statusList = status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const createMenuCategories = useApiMutation({
    mutationFn: upsertMenuCategory,
    invalidateKeys: [["menuCategory"]],
    shouldInvalidate: page === 1,
  });

  const editMenuCategories = useApiMutation({
    mutationFn: upsertMenuCategory,
    invalidateKeys: [["menuCategory"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "menuCategory-details",
    fetchQueryFunction: menuCategoryDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  // useEffect(() => {
  //   if (!isAdd && data) {
  //     form.setFieldsValue({
  //       ...data,
  //       displayOrder: Number(data?.displayOrder),
  //       status: data?.status?.uuid,
  //     });

  //     setSelectedData(data);
  //   }
  // }, [data]);
  useEffect(() => {
    if (!isAdd && data) {
      form.resetFields();

      form.setFieldsValue({
        ...data,
        displayOrder: Number(data?.displayOrder),
      });

      setSelectedData(data);
    }
  }, [data]);
  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        // status: { uuid: values.status },
        status: values.status,
      };

      createMenuCategories.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Menu Category Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        // status: { uuid: values.status },
        status: values.status,
        uuid: data?.uuid,
      };

      editMenuCategories.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Menu Category Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={600}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Menu Category Details"
                : mode === "edit"
                  ? "Edit Menu Category"
                  : "Create Menu Category"}
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
                  createMenuCategories.isPending || editMenuCategories.isPending
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
          style={{ width: "100%" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Menu Category Name" />
          </Form.Item>

          <Form.Item
            label="Display Order"
            name="displayOrder"
            rules={[{ required: true }]}
          >
            <InputNumber disabled={isView} className="!w-full" placeholder="Enter Display Order" />
          </Form.Item>

          <Status isView={isView} />
        </Form>
      </Drawer>
    </div>
  );
};

export default MenuCategoryForm;
