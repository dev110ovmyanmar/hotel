import React, { useState, useEffect } from "react";
import { Button, Avatar, Typography, Drawer, Upload, Form, message } from "antd";
import { EditOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ProfileForm from "./ProfileForm";
import { loadState } from "../../utils/Utils";
import { LOCAL_STORAGE_KEYS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import { useApiMutation } from "../../hooks/useApiMutation";
import { adminDetails, adminUpload, upsertAdmin } from "../../api/adminApi";
import Toast from "../../component/Toast/Toast";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const uuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.uuid;
  const roleUuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.role?.uuid;

  /* ---------------- API ---------------- */

  const { data: loginAdminDetails, refetch } = useApiQuery({
    fetchQueryName: "login-admin-details",
    fetchQueryFunction: adminDetails,
    params: { uuid },
  });

  const upsertAdmins = useApiMutation({
    mutationFn: upsertAdmin,
    invalidateKeys: [["login-admin-details"]],
  });

  const uploadMutation = useApiMutation({
    mutationFn: adminUpload,
  });

  /* ---------------- Load Existing Image ---------------- */

  useEffect(() => {
    if (loginAdminDetails?.file) {
      setImageUrl(loginAdminDetails.file);
    }
  }, [loginAdminDetails]);

  /* ---------------- User Info ---------------- */

  const userInfo = {
    name: loginAdminDetails?.name,
    role: loginAdminDetails?.role?.name,
  };

  const personalInfoInitial = {
    name: loginAdminDetails?.name,
    role: loginAdminDetails?.role?.name,
    email: loginAdminDetails?.email,
    status: loginAdminDetails?.status?.name,
  };

  /* ---------------- Drawer ---------------- */

  const showDrawer = (section) => {
    setEditingSection(section);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingSection(null);
  };

  /* ---------------- Save Profile ---------------- */

  const handleSave = (values) => {
    const editValues = {
      ...values,
      uuid: uuid,
      role: {
        uuid: roleUuid,
      },
      status: {
        uuid: loginAdminDetails?.status?.uuid,
      },
    };

    upsertAdmins.mutate(editValues, {
      onSuccess: () => {
        Toast.success("Information Updated Successfully!");
      },
    });

    closeDrawer();
  };

  /* ---------------- Avatar Upload ---------------- */

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";

    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG/JPEG file!");
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }

    setLoading(true);

    uploadMutation.mutate(
      { file },
      {
        onSuccess: (response) => {
          setImageUrl(response?.file);
          setLoading(false);
          Toast.success("Profile picture updated!");
          refetch();
        },
        onError: () => {
          setLoading(false);
          message.error("Upload failed");
        },
      }
    );

    return false;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">

      {/* User Info */}
      <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-sm">

        <Upload
          name="file"
          listType="picture-circle"
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept="image/png, image/jpeg"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            uploadButton
          )}
        </Upload>

        <div>
          <Title level={4} className="mb-0">
            {userInfo.name}
          </Title>
          <Text type="secondary">{userInfo.role}</Text>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">

        <div className="flex justify-between items-center mb-6">
          <Title level={5} className="mb-0">
            Personal Information
          </Title>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showDrawer("personal")}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {Object.entries(personalInfoInitial).map(([key, value]) => (
            <div key={key}>
              <Text strong>
                {key.replace(/([A-Z])/g, " $1")}:
              </Text>
              <div>{value}</div>
            </div>
          ))}
        </div>

      </div>

      {/* Drawer */}
      <Drawer
        onClose={closeDrawer}
        open={drawerVisible}
        footer={null}
        title={
          <div className="flex justify-between gap-4">
            {`Edit ${editingSection === "personal" ? "Personal Info" : ""}`}
            <Button type="primary" onClick={() => form.submit()}>
              Update
            </Button>
          </div>
        }
      >
        {editingSection === "personal" && (
          <ProfileForm
            form={form}
            initialValues={personalInfoInitial}
            onSave={handleSave}
            onCancel={closeDrawer}
          />
        )}
      </Drawer>

    </div>
  );
};

export default ProfilePage;