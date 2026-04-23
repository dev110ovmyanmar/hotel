import React, { useState } from "react";
import { Tabs } from "antd";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Clock,
  Edit2,
  Cake,
  BadgeCheck,
} from "lucide-react";

// Import your sub-components
import PersonalInformation from "./Components/PersonalInformation";
import StayHistory from "./Components/StayHistory";
import PreferencesLoyalty from "./Components/PreferencesLoyalty";
import GuestNotes from "./Components/GuestNotes";

import Profile from "../../../assets/images/demo-profile.png";

const GuestProfile = () => {
  // State to track which tab is active
  const [activeTab, setActiveTab] = useState("1");

  const tabItems = [
    { key: "1", label: "Personal Information" },
    { key: "2", label: "Stay History" },
    { key: "3", label: "Preferences & Loyalty" },
    { key: "4", label: "Notes" },
  ];

  // Logic to switch components based on state
  const renderTabContent = () => {
    switch (activeTab) {
      case "1": return <PersonalInformation />;
      case "2": return <StayHistory />;
      case "3": return <PreferencesLoyalty />;
      case "4": return <GuestNotes />;
      default: return <PersonalInformation />;
    }
  };

  return (
    <div className="min-h-screen px-8 py-6 font-sans text-slate-700 bg-slate-50">
      
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-6">
            <img
              src={Profile}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-50"
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-800">Liam John Smith</h1>
                <span className="bg-blue-900 text-[#fff] text-xs px-3 py-1 rounded-md flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> Platinum
                </span>
                <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-md border border-purple-200 flex items-center gap-1 font-semibold">
                  <BadgeCheck size={12} /> VIP
                </span>
                <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                  <Calendar size={12} /> 28 Days
                </span>
              </div>
              <p className="text-sm text-slate-500 mb-2">Guest Id: GST0410PQCP</p>
              <div className="flex items-center gap-2 text-sm mb-3">
                <Cake size={14} /> 26 years old
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={14} /> +95 9 123 456 789
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={14} /> liamjohn123@gmail.com
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={14} /> No. 221, Pyay Road, Hlaing Township
                </div>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium">
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Calendar className="text-blue-500" />} label="Total Stays" value="28 Days" />
        <StatCard icon={<DollarSign className="text-green-500" />} label="Total Spent" value="150,000 MMK" />
        <StatCard icon={<Star className="text-blue-900" />} label="Current Tier" value="Platinum" />
        <StatCard icon={<Clock className="text-slate-500" />} label="Last Stay" value="Jan 5, 2026" />
      </div>

      {/* TABS NAVIGATION DIV (Stand-alone box) */}
      <div className="bg-white shadow-sm border border-slate-200 overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
          centered
          tabBarGutter={0}
          className="guest-profile-tabs"
          tabBarStyle={{ margin: 0, padding: 0 }}
        />
      </div>

      {/* CONTENT DIV (Separated by mt-8) */}
      <div className="mt-8 mb-10">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Helper Stat Card
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default GuestProfile;

