import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Drawer,
  Modal,
  Image,
} from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import {
  adminDetails,
  upsertAdmin,
  adminPermission,
} from "../../../../api/adminApi";
import FormButton from "../../../../component/FormButtons/FormButtons";
import AddOnDrawer from "./AddOnDrawer";
import Toast from "./../../../../component/Toast/Toast";
import usePermission from "./../../../../hooks/usePermission";
import { PERMISSIONS } from "./../../../../variables/permission";
import { initial } from "lodash";
import Status from "./../../../../component/Status/Status";
import { adminMeta } from "../../../../api/adminApi";
import { UserOutlined } from "@ant-design/icons";
import Loader from "../../../../component/Loader/Loader";

const AdminForm = ({
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

  const { hasPermission } = usePermission();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const initDataStatus = initData?.statuses.status;

  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  // const [initialRole, setInitialRole] = useState(null);
  const [initialValue, setInitialValue] = useState(null);
  const [finalValues, setFinalValues] = useState(null);

  const roles = initData?.roles?.map((role) => ({
    value: role.uuid,
    label: role.name,
  }));

  const upsertAdmins = useApiMutation({
    mutationFn: upsertAdmin,
    invalidateKeys: [["admins"]],
    shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "admin-details",
    fetchQueryFunction: adminDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  const { data: adminMetaData } = useApiQuery({
    fetchQueryName: "admin-meta",
    fetchQueryFunction: adminMeta,
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  const staffList = adminMetaData?.staffs?.map((staff) => ({
    value: staff.uuid,
    label: staff.name,
  }));

  // Add On Permission
  const [allowMode, setAllowMode] = useState(""); // "allow" or "notAllow"

  const changesNotAllowList = data?.permissions?.changesNotAllowList;
  const changesAllowList = data?.permissions?.changesAllowList;
  const allowPermissionIds =
    changesAllowList?.flatMap((module) =>
      module.permissions.filter((p) => p.selected === true).map((p) => p.id),
    ) || [];

  const notAllowPermissionIds =
    changesNotAllowList?.flatMap((module) =>
      module.permissions.filter((p) => p.selected === true).map((p) => p.id),
    ) || [];

  const addOnAdminPermission = useApiMutation({
    mutationFn: adminPermission,
    invalidateKeys: [["admins"]],
  });

  const onSave = (values) => {
    const modifiedValues = {
      uuid: data?.uuid,
      permission: {
        ids: values,
      },
    };
    addOnAdminPermission.mutate(modifiedValues, {
      onSuccess: () => {
        setAdminDrawerOpen(false);
        Toast.success("Added Permission Successfully");
        setSelectedPermissions(values);
      },
    });
  };

  useEffect(() => {
    if (isEdit && data) {
      form.setFieldsValue({
        ...data,
        role: data?.role?.uuid,
        staff: data?.staff?.uuid,
      });
      setSelectedData(data);
    }
  }, [data]);

  useEffect(() => {
    // if (data?.role?.uuid) {
    //   setInitialRole(data?.role?.uuid)
    // }
    if (data) {
      setInitialValue(data);
    }
  }, [data]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const formButtonSubmit = () => {
    const values = form.getFieldsValue();

    if (isEdit && initialValue) {
      const isChanged = values !== initialValue;

      if (isChanged) {
        setFinalValues(values);
        setOpenModal(true);
        return;
      }
    }
    onFinish(values);
  };

  const handleOk = () => {
    if (finalValues) {
      onFinish(finalValues);
    }
    setOpenModal(false);
  };

  const cancelButton = () => {
    setOpenModal(false);
  };

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        role: { uuid: values.role },
        status: values.status,
        staff: { uuid: values.staff },
      };

      upsertAdmins.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          handleClose();
          Toast.success("Admin Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values, // merge new form values
        role: { uuid: values.role },
        status: values.status,
        staff: { uuid: values.staff },
        uuid: data?.uuid,
      };

      upsertAdmins.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("Admin Updated Successfully!");
        },
      });
    }
  };

  const adminDrawerFunction = (mode) => {
    setAllowMode(mode);
    setAdminDrawerOpen(true);
  };

  useEffect(() => {
    if (data && allowMode === "allow") {
      setSelectedPermissions(allowPermissionIds);
    }
  }, [data]);

  useEffect(() => {
    if (isAdd) {
      form.setFieldsValue({
        status: {
          uuid: initDataStatus?.find((item) => item?.code === "active")?.uuid,
        },
      });
    }
  }, [isAdd]);

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Admin Details"
                : mode === "edit"
                  ? "Edit Admin"
                  : "Create Admin"}
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
                onClick={formButtonSubmit}
                isPending={upsertAdmins.isPending}
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
            style={{ width: "100%" }}
            onFinish={onFinish}
          >
            {!isAdd && (
              <Image
                src={data?.file}
                alt="image"
                className="!w-32 border-1 border-gray-300 rounded-full mb-3 p-1"
                preview={false}
              />
            )}

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Admin Name is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Admin Name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Admin Email is Required" }]}
            >
              <Input readOnly={isView} placeholder="Enter Email Address" />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Role is Required" }]}
              getValueProps={(value) => {
                return {
                  value: isView
                    ? initData?.roles.find((item) => item.uuid === value)?.name
                    : value,
                };
              }}
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
                  options={roles}
                  placeholder="Select Role"
                />
              )}
            </Form.Item>

            <Form.Item label="Staff" name="staff" className="flex-2">
              <Select
                showSearch={{
                  filterOption: (input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase()),
                }}
                options={staffList}
                placeholder="Select Staff"
              />
            </Form.Item>

            <Status isView={isView} statusValue={initDataStatus} />

            {isEdit && (
              <div className="mt-6">
                <Divider />

                {changesNotAllowList?.length <= 0 ? null : (
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="font-bold">Current Permissions</span>

                    {/* {changesNotAllowList?.length <= 0 ? null : ( */}
                    <Button
                      type="primary"
                      onClick={() => adminDrawerFunction("notAllow")}
                    >
                      View
                    </Button>
                    {/* )} */}
                  </div>
                )}

                {!hasPermission(PERMISSIONS.ADMIN_PERMISSION) ||
                changesAllowList?.length <= 0 ? null : (
                  <div
                    style={{
                      background: "#f5f5f5",
                      padding: "15px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="font-bold">Additional Permissions</span>

                    <Button
                      type="primary"
                      onClick={() => adminDrawerFunction("allow")}
                    >
                      Add On
                    </Button>
                  </div>
                )}

                <AddOnDrawer
                  mode={allowMode}
                  open={adminDrawerOpen}
                  onClose={() => setAdminDrawerOpen(false)}
                  loading={addOnAdminPermission.isPending}
                  rolePermissions={
                    allowMode === "notAllow"
                      ? changesNotAllowList
                      : changesAllowList
                  }
                  selectedPermissions={
                    allowMode === "notAllow"
                      ? notAllowPermissionIds
                      : selectedPermissions
                  }
                  onSave={onSave}
                />
              </div>
            )}
          </Form>
        )}

        <Modal
          title="Confirmation Box"
          open={openModal}
          onOk={handleOk}
          okText="Confirm"
          okButtonProps={
            {
              // loading: loading,
            }
          }
          onCancel={cancelButton}
        >
          <Divider />
          <div className="text-md !mt-3">
            Changing the role will update permissions. Please verify the
            information you entered before continuing. Are you sure you want to
            continue?
            {/* Do you want to continue? */}
          </div>
        </Modal>
      </Drawer>
    </div>
  );
};

export default AdminForm;
