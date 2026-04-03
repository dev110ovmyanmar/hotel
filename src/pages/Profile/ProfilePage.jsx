import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Drawer,
  Upload,
  Form,
  message,
  Image,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
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
  const [previewVisible, setPreviewVisible] = useState(false);

  const uuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.uuid;
  const roleUuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.role?.uuid;

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

  useEffect(() => {
    if (loginAdminDetails?.file) {
      setImageUrl(loginAdminDetails.file);
    }
  }, [loginAdminDetails]);

  const personalInfoInitial = {
    name: loginAdminDetails?.name,
    role: loginAdminDetails?.role?.name,
    email: loginAdminDetails?.email,
    status: loginAdminDetails?.status?.name,
  };

  const showDrawer = (section) => {
    setEditingSection(section);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingSection(null);
  };

  const handleSave = (values) => {
    const editValues = {
      ...values,
      uuid: uuid,
      role: { uuid: roleUuid },
      status: { uuid: loginAdminDetails?.status?.uuid },
    };

    upsertAdmins.mutate(editValues, {
      onSuccess: () => {
        Toast.success("Information Updated Successfully!");
      },
    });

    closeDrawer();
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
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
      },
    );
    return false;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* 1. Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center sm:flex-row sm:space-x-10">
        {/* Avatar Container */}
        <div className="relative mb-6 sm:mb-0">
          {/* Main Image Circle */}
          <div className="w-32 h-32 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
            {loading ? (
              <LoadingOutlined className="text-3xl text-blue-500" />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <PlusOutlined className="text-3xl text-gray-300" />
            )}
          </div>

          {/* LEFT SIDE: PREVIEW */}
          {imageUrl && !loading && (
            <div className="absolute left-0 top-[95%] -translate-x-[10%] -translate-y-[80%] z-10">
              <Tooltip title="Preview Image">
                <Button
                  shape="circle"
                  size="middle"
                  icon={<EyeOutlined />}
                  className="shadow-md bg-white border-gray-200 hover:text-blue-500 flex items-center justify-center"
                  onClick={() => setPreviewVisible(true)}
                />
              </Tooltip>
            </div>
          )}

          {/* RIGHT SIDE: EDIT */}
          {!loading && (
            <div className="absolute right-0 top-[95%] translate-x-[10%] -translate-y-[80%] z-10">
              <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/*"
              >
                <Tooltip title="Update Photo">
                  <Button
                    shape="circle"
                    size="middle"
                    type="primary"
                    icon={<EditOutlined />}
                    className="shadow-md flex items-center justify-center"
                  />
                </Tooltip>
              </Upload>
            </div>
          )}
        </div>

        {/* User Identity Text */}
        <div className="text-center sm:text-left flex-1">
          <Title level={2} className="mb-1 !text-gray-800">
            {loginAdminDetails?.name || "User Name"}
          </Title>
          <Text className="text-lg text-gray-500 italic">
            {loginAdminDetails?.role?.name || "Position"}
          </Text>
        </div>
      </div>

      {/* 2. Personal Information Card */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
          <Title level={4} className="mb-0 !text-gray-700">
            Personal Information
          </Title>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showDrawer("personal")}
            className="rounded-lg"
          >
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
          {Object.entries(personalInfoInitial).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                {key.replace(/([A-Z])/g, " $1")}
              </Text>
              <Text className="text-base text-gray-800 font-medium">
                {value || "—"}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer & Image Preview Logic */}
      <Drawer
        onClose={closeDrawer}
        open={drawerVisible}
        width={420}
        title={<span className="font-bold">Edit Profile</span>}
        extra={
          <Button type="primary" onClick={() => form.submit()}>
            Update
          </Button>
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

      <Image
        src={imageUrl}
        style={{ display: "none" }}
        preview={{
          visible: previewVisible,
          onVisibleChange: (vis) => setPreviewVisible(vis),
        }}
      />
    </div>
  );
};

export default ProfilePage;
