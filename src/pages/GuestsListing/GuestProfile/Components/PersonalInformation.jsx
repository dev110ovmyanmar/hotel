import React from 'react'
import { User, CreditCard, MapPin, Asterisk } from 'lucide-react';

export const InfoSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700 bg-slate-50/50">
      {icon} {title}
    </div>
    {/* Add flex-1 to the children container so it pushes the height */}
    <div className="p-6 space-y-4 flex-1">{children}</div>
  </div>
);

export const DataRow = ({ label, value, color = "text-slate-700" }) => (
  <div className="flex justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium ${color}`}>{value}</span>
  </div>
);

const PersonalInformation = () => {
  return (
    <div className="grid grid-cols-2 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-2 duration-500">
    <InfoSection title="Basic Information" icon={<User size={18} />}>
      <DataRow label="Full Name" value="Liam John Smith" />
      <DataRow label="Name Other Language" value="John Smith" />
      <DataRow label="Phone No 1" value="+95 9 123 456 789" />
      <DataRow label="Phone No 2" value="+1 (555) 123-4567" />
      <DataRow label="Email" value="liamjohn123@gmail.com" />
      <DataRow label="Gender" value="Male" />
      <DataRow label="Date of Birth" value="Jan 12, 2000" />
      <DataRow label="Nationality" value="Myanmar" />
      <DataRow label="Father Name" value="U Tin Lin" />
    </InfoSection>

    <InfoSection title="Identification" icon={<CreditCard size={18} />}>
      <DataRow label="ID Type" value="NRC" />
      <DataRow label="ID Number" value="12/TAMANA(N)123000" />
      <DataRow label="Passport Number" value="A12345678" />
      <DataRow label="Issued Date" value="Oct 12, 2025" />
      <DataRow label="Passport Expire Date" value="Oct 11, 2030" color="text-red-400" />
    </InfoSection>

    <InfoSection title="Address" icon={<MapPin size={18} />}>
      <DataRow label="Address" value="No. 221, Pyay Road, Hlaing Township" />
      <DataRow label="City" value="Yangon" />
      <DataRow label="State" value="MM" />
      <DataRow label="ZIP Code" value="10022" />
      <DataRow label="Country" value="Myanmar" />
    </InfoSection>

    <InfoSection title="Emergency Contact" icon={<Asterisk size={18} />}>
      <DataRow label="Contact Name" value="John Doe" />
      <DataRow label="Phone" value="+95 9 123 456 789" />
      <DataRow label="Relationship" value="Friend" />
    </InfoSection>
  </div>
  )
}

export default PersonalInformation