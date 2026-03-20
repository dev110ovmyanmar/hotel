import React, { useEffect } from "react";
import { Form, Input, Button, Drawer, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import TextArea from "antd/es/input/TextArea";
import {
  createDepartment,
  departmentDetails,
  editDepartment,
} from "../../../../api/departmentApi";

const DepartmentsForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statuses = initData?.statuses?.status
    ?.filter((item) => item.code !== "blocked")
    ?.map((status) => ({
      value: status.uuid,
      label: status.name,
    }));

  const createDepartments = useApiMutation({
    mutationFn: createDepartment,
    invalidateKeys: [["departmentsdata"]],
    shouldInvalidate: page === 1,
  });

  const editDepartments = useApiMutation({
    mutationFn: editDepartment,
    invalidateKeys: [["departmentsdata"]],
  });

  const { data } = useApiQuery({
    fetchQueryName: "departmentsdata",
    fetchQueryFunction: departmentDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        ...data,
        status: data?.status?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        status: { uuid: values.status },
      };

      createDepartments.mutate(createValues, {
        onSuccess: () => {
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Department Created Successfully!");
          form.resetFields();
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        status: { uuid: values.status },
        uuid: selectedData?.uuid,
      };

      editDepartments.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Department Updated Successfully!");
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
                ? "Department Details"
                : mode === "edit"
                  ? "Edit Department"
                  : "Create Department"}
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
                isPending={
                  createDepartments.isPending || editDepartments.isPending
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
            <Input readOnly={isView}/>
          </Form.Item>

          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true, message: "Code is Required" }]}
          >
            <Input readOnly={isView}/>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Status is Required" }]}
            getValueProps={(value) => ({
              value: isView
                ? statuses.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly={isView} />
            ) : (
              <Select
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                }}
                options={statuses}
                placeholder="Select Status"
              />
            )}
          </Form.Item>
         
          <Form.Item label="Description" name="description">
            <TextArea readOnly={isView}/>
          </Form.Item>

        </Form>
      </Drawer>
    </div>
  );
};

export default DepartmentsForm;
