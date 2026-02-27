import React, { useState } from "react";
import { Button, Avatar, Typography, Drawer } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ProfileForm from "./ProfileForm";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingSection, setEditingSection] = useState(null); 

  const userInfo = {
    name: "Natashia Khaleira",
    role: "Admin",
    location: "Leeds, United Kingdom",
    avatar: null,
  };

  const personalInfoInitial = {
    firstName: "Natashia",
    lastName: "Khaleira",
    dob: "12-10-1990",
    email: "info@binary-fusion.com",
    phone: "(+62) 821 2554-5846",
    userRole: "Admin",
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
    console.log(`${editingSection} updated:`, values);
    closeDrawer();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Info Header */}
        <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-sm">
          <div className="relative">
            <Avatar size={72} src={userInfo.avatar} />
            <span className="absolute bottom-0 right-0 block w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <Title level={4} className="mb-0">
              {userInfo.name}
            </Title>
            <Text type="secondary" className="block">
              {userInfo.role}
            </Text>
            <Text type="secondary" className="block">
              {userInfo.location}
            </Text>
          </div>
        </div>


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
          <div className="grid grid-cols-3 gap-x-12 gap-y-6">
            {Object.entries(personalInfoInitial).map(([key, value]) => (
              <div key={key}>
                <Text strong>{key.replace(/([A-Z])/g, " $1")}:</Text>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <Drawer
        title={`Edit ${editingSection === "personal" ? "Personal Info" : ""}`}
        onClose={closeDrawer}
        open={drawerVisible}
        footer={null}
      >
        {editingSection === "personal" && (
          <ProfileForm
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
