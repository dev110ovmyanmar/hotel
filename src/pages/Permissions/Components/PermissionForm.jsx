import React, { useEffect, useMemo } from "react";
import {
  Button,
  Form,
  Input,
  Row,
  Col,
  Spin,
  AutoComplete,
  Drawer,
} from "antd";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertPermission, getPermissionDetail } from "../../../api/permissionApi";
import { queryClient } from "../../../app/queryClient";

const { TextArea } = Input;

const PermissionForm = ({
  mode,
  permissions = [],
  loading = false,
  switchToEdit,
  page,
  setPage,
  selectedRow,
  setSelectedRow,
  drawerOpen,
  setDrawerOpen,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const permissionsArray = initData?.permissions;

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "permission-detail",
    fetchQueryFunction: getPermissionDetail,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!selectedRow?.uuid,
    }
  });

  const selectedPermission = selectedRow || data;

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({ ...data });
      setSelectedRow(data);
    }
  }, [data]);

  const createPermission = useApiMutation({
    mutationFn: upsertPermission,
    invalidateKeys: [["permissions"]],
    shouldInvalidate: page === 1
  });

  const editPermission = useApiMutation({
    mutationFn: upsertPermission,
    invalidateKeys: [["permissions"]],
  });

  const onFinish = (values) => {
    if (isAdd) {
      const code = values.code || "";
      const extractedModule = code.includes(".")
        ? code.split(".")[0] : values.module || "general";
      const createValues = {
        ...values, module: extractedModule
      };

      createPermission.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Permission Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        uuid: data?.uuid,
      };
      editPermission.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Permission Updated Successfully!");
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
    ? "Permission View"
    : isEdit
      ? "Permission Edit"
      : "Permission Create";


  const moduleOptions = useMemo(() => {
    const modules = [
      ...new Set(permissionsArray.map((p) => p.split(".")[0]).filter(Boolean)),
    ];
    return modules.map((m) => ({ value: m }));
  }, [permissionsArray]);

  const validateUniqueName = (_, value) => {
    if (!value) return Promise.resolve();
    const duplicate = permissions.find(
      (p) =>
        p.name.toLowerCase() === value.trim().toLowerCase() &&
        (!isEdit || p.id !== selectedPermission?.id),
    );
    return duplicate
      ? Promise.reject(new Error("Permission name already exists"))
      : Promise.resolve();
  };

  const validateUniqueCode = (_, value) => {
    if (!value) return Promise.resolve();
    const duplicate = permissions.find(
      (p) =>
        p.code.toLowerCase() === value.trim().toLowerCase() &&
        (!isEdit || p.id !== selectedPermission?.id),
    );
    return duplicate
      ? Promise.reject(new Error("Permission code already exists"))
      : Promise.resolve();
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>{DrawerTitle}</span>
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
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <Form
              form={form}
              layout="vertical"
              style={{ width: "100%" }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input permission name!" },
                  { validator: validateUniqueName },
                ]}
              >
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Permission Name"
                />
              </Form.Item>

              <Form.Item
                label="Code"
                name="code"
                rules={[
                  { required: true, message: "Please input permission code!" },
                  { validator: validateUniqueCode },
                ]}
              >
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Permission Code"
                />
              </Form.Item>

              {!isView && !isAdd && (
                <Form.Item
                  label="Module"
                  name="module"
                  rules={[{ required: false, message: "Please input module!" }]}
                >
                  <AutoComplete
                    options={moduleOptions}
                    placeholder={isAdd ? "Enter module (auto-extracted from code if contains dot)" : "Select or enter module"}
                  />
                </Form.Item>
              )}

              {isView && data?.module && (
                <Form.Item label="Module" name="module" >
                  <Input readOnly value={data.module} />
                </Form.Item>
              )}

              <Form.Item label="Description" name="description">
                <TextArea
                  rows={3}
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Description"
                />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>
    </>
  );
};

export default PermissionForm;
