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
import useApiQuery from "../../../hooks/useApiQuery";
import { getGuestDetail } from "../../../api/guestApi";
import { useLocation } from "react-router-dom";
import GuestForm from "../Components/NewGuestForm";
import { getGuestNotes } from "../../../api/guestNoteApi";
import { reservationRoomList } from "../../../api/reservationSectionApi";
import GuestProfileBG from "../../../assets/images/Guestprofile.png";
import Loader from "../../../component/Loader/Loader";

const calculateAge = (dobString) => {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 ? age : null;
};

const GuestProfile = () => {
  // State to track which tab is active

  const { state } = useLocation();
  const { data: guestDetailDatas, isFetching: guestDetailDatasFetching } = useApiQuery({
    fetchQueryName: "guest-detail",
    fetchQueryFunction: getGuestDetail,
    params: {
      uuid: state?.guestDetails?.uuid,
      isProfile: 1
    },
  });


  const [activeTab, setActiveTab] = useState("1");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(guestDetailDatas);
  const [mode, setMode] = useState("edit");

  // Stay History
  const { data: stayHistoryList } = useApiQuery({
    fetchQueryName: "reservation-room",
    fetchQueryFunction: reservationRoomList,
    params: {
      guest: {
        uuid: state?.guestDetails?.uuid,
      },
    },
    options: {
      // enabled: !!bookingId && bookingId.trim().length >= 32,
    },
  });

  const tabItems = [
    { key: "1", label: "Personal Information" },
    { key: "2", label: "Stay History" },
    // { key: "3", label: "Preferences & Loyalty" },
    { key: "3", label: "Notes" },
  ];

  // Logic to switch components based on state
  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return <PersonalInformation personalInfo={guestDetailDatas} />;
      case "2":
        return <StayHistory guestUuid={guestDetailDatas?.uuid} />;
      // case "3": return <PreferencesLoyalty />;
      case "3":
        return <GuestNotes guestUuid={guestDetailDatas?.uuid} />;
      default:
        return <PersonalInformation />;
    }c
  };



  return (
    <>
      {
        guestDetailDatasFetching
          ?
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
          :
          <div className="min-h-screen px-8 py-6 font-sans text-slate-700 dark:!text-[#D9D9D9] bg-slate-50 dark:bg-[#141414]">
            {/* Header Card */}
            <div
              className="rounded-xl  p-6 mb-6 bg-cover bg-center  min-h-[200px] "
              style={{
                backgroundImage: `url(${GuestProfileBG})`,
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-6">
                  <img
                    src={guestDetailDatas?.guestFiles?.profile}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-50"
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-2xl font-bold text-slate-800 ">
                        {guestDetailDatas?.name}
                      </h1>
                      <span className="bg-blue-900 text-[#fff] text-xs px-3 py-1 rounded-md flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> Platinum
                      </span>
                      <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-md border border-purple-200 flex items-center gap-1 font-semibold">
                        <BadgeCheck size={12} /> VIP
                      </span>
                      <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                        <Calendar size={12} />
                        {guestDetailDatas?.totalStay} {guestDetailDatas?.totalStay <= 1 ? "Day" : "Days"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">
                      Guest Id: {guestDetailDatas?.id}
                    </p>

                    {guestDetailDatas?.dob && (
                      <div className="flex items-center gap-2 text-sm mb-3 dark:!text-[#000000]">
                        <Cake size={14} /> {calculateAge(guestDetailDatas?.dob)}
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {guestDetailDatas?.phone ? (
                          <>
                            <Phone size={14} />
                            {guestDetailDatas?.phone}
                          </>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {guestDetailDatas?.email ? (
                          <>
                            <Mail size={14} />
                            {guestDetailDatas?.email}
                          </>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {guestDetailDatas?.address ? (
                          <>
                            <MapPin size={14} />
                            {guestDetailDatas?.address}
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="flex items-center gap-1 md:gap-2 border border-blue-600 text-blue-600 px-1 md:px-1 lg:px-3 py-1 md:py-1 lg:py- rounded-lg bg-gray-200 hover:bg-blue-50 transition font-medium cursor-pointer"
                  onClick={() => setDrawerOpen(true)}
                >
                  {/* <Edit2 size={16} />  */}
                  <Edit2 className="sm:w-2 sm:h-2 lg:w-4 lg:h-4" />
                  <span className="sm:text-xs md:!-md lg:!text-base sm:!p-0 sm:!m-0">
                    Edit Profile
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Calendar className="text-blue-500" />}
                label="Total Stays"
                value={`${guestDetailDatas?.totalStay} ${guestDetailDatas?.totalStay <= 1 ? "Night" : "Nights"}`}
              />
              <StatCard
                icon={<DollarSign className="text-green-500" />}
                label="Total Spent"
                value={guestDetailDatas?.totalSpend ? `${guestDetailDatas?.totalSpend} MMK` : ""}
              />
              <StatCard
                icon={<Star className="text-blue-900" />}
                label="Current Tier"
                value="Platinum"
              />
              <StatCard
                icon={<Clock className="text-slate-500" />}
                label="Last Stay"
                value={guestDetailDatas?.lastStay}
              />
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
            <div className="mt-8 mb-10">{renderTabContent()}</div>
          </div>
      }


      <GuestForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={guestDetailDatas}
      />
    </>
  );
};

// Helper Stat Card
const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
    <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 dark:text-[#C5C5C5] uppercase tracking-wider font-semibold">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-800 dark:text-[#D9D9D9]">
        {value}
      </p>
    </div>
  </div>
);

export default GuestProfile;