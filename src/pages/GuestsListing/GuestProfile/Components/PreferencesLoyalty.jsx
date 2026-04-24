import React from 'react';
import { 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  BedDouble, 
  Calendar, 
  Clock, 
  CircleDollarSign, 
  VolumeX, 
  CigaretteOff,
  BadgeCheck,
  CircleStar
} from 'lucide-react';
import { Progress } from 'antd';

const PreferencesAndLoyalty = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Guest Loyalty Banner */}
     <div className="bg-[#0a1866] rounded-xl p-7 text-white relative overflow-hidden shadow-lg w-full">
      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
        
        {/* Left Section */}
        <div className="flex-1 space-y-5">
          <h3 className="text-slate-300 text-lg font-medium opacity-90">Guest Loyalty</h3>
          
          {/* Tier Label */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1 rounded-full flex items-center justify-center">
              <CircleStar size={25} fill="white" className="text-white" />
            </div>
            <h2 className="text-2xl text-[#fff] font-bold tracking-tight">Platinum Tier</h2>
            <span className="bg-[#f3e8ff] text-[#9333ea] text-[14px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <BadgeCheck size={16} fill="#9333ea" className="text-[#f3e8ff]" /> VIP
            </span>
          </div>

          {/* Progress Bar Area */}
          <div className="space-y-1.5 w-full">
            <div className="flex justify-between text-[16px] font-bold text-slate-300">
              <span>Current: 8,500 pts</span>
              <span>10,000 pts</span>
            </div>
            
            {/* Custom styled Ant Design Progress */}
            <div className="custom-loyalty-progress">
              <Progress 
                percent={85} 
                showInfo={false} 
                strokeColor="#ffffff" 
                trailColor="rgba(255,255,255,0.15)"
                strokeWidth={13}
                strokeLinecap="round"
              />
            </div>
            
            <p className="text-right text-[16px] font-medium text-slate-300">
              Need 1,500 Pts to Diamond
            </p>
          </div>

          {/* Spending Goal */}
          <p className="text-lg font-bold text-[#fff] pt-2">
            Need To Spend <span className="font-extrabold">300,000 MMK</span> To Reach Diamond Tier
          </p>
          
          {/* Action Link */}
          <button className="flex items-center text-[#fff] gap-2 text-lg font-bold pt-2 group">
            View Tier Details 
            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Section (Benefits Card) */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 min-w-[300px] flex flex-col justify-center">
          <h4 className="font-bold mb-4 text-lg text-slate-200">Platinum Tier Benefits</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-[14px] font-bold text-slate-100">
              <CheckCircle2 size={18} className="text-green-400 fill-green-400/20" /> Free Room Upgrade
            </li>
            <li className="flex items-center gap-3 text-[14px] font-bold text-slate-100">
              <CheckCircle2 size={18} className="text-green-400 fill-green-400/20" /> Late Check-out
            </li>
            <li className="flex items-center gap-3 text-[14px] font-bold text-slate-100">
              <CheckCircle2 size={18} className="text-green-400 fill-green-400/20" /> Priority Support
            </li>
          </ul>
        </div>
      </div>

      {/* Optional: Subtle background glow to match the image depth */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
    </div>

      {/* Guest Preferences Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Guest Preferences</h3>
        
        {/* Preference Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1 */}
          <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col gap-4">
            <div className="bg-white w-fit p-2 rounded-lg border border-blue-100 shadow-sm">
              <BedDouble className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">Most Booked Room</p>
              <p className="text-[15px] font-extrabold text-slate-800">Deluxe Bungalow</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col gap-4">
            <div className="bg-white w-fit p-2 rounded-lg border border-blue-100 shadow-sm">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">Total Bookings</p>
              <p className="text-[15px] font-extrabold text-slate-800">3 Bookings</p>
            </div>
          </div>

          {/* Card 3 - Highlighted (Matching your blue selection in screenshot) */}
          <div className="p-5 rounded-xl border-2 border-blue-500 bg-white flex flex-col gap-4 shadow-md ring-4 ring-blue-50">
            <div className="bg-slate-100 w-fit p-2 rounded-lg border border-slate-200">
              <Clock className="text-slate-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">Average Stay Duration</p>
              <p className="text-[15px] font-extrabold text-slate-800">3 Nights</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-xl border border-green-200 bg-green-50/30 flex flex-col gap-4">
            <div className="bg-white w-fit p-2 rounded-lg border border-green-100 shadow-sm">
              <CircleDollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold mb-1">Average Spend Amount</p>
              <p className="text-[15px] font-extrabold text-slate-800">900,000 MMK</p>
            </div>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-3">
          <PreferenceTag icon={<CigaretteOff size={14} className="rotate-45" />} text="Non-smoking" />
          <PreferenceTag icon={<Clock size={14} />} text="Late Check-in" />
          <PreferenceTag icon={<VolumeX size={14} />} text="Quiet Room" />
        </div>
      </div>
    </div>
  );
};

// Internal Helper Component for Tags
const PreferenceTag = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
    {icon} {text}
  </div>
);

export default PreferencesAndLoyalty;