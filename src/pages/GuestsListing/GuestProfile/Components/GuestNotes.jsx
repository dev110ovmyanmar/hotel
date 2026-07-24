import React from 'react';
import { 
  X, 
  MessageSquare, 
  Heart, 
  AlertCircle, 
  Star, 
  Plus, 
  Pencil, 
  Trash2 
} from 'lucide-react';

const GuestNotes = () => {
  return (
    <div className="w-full mx-auto py-6 space-y-6 bg-slate-50 dark:bg-[#141414]">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-1">Guest Notes</h2>

      {/* --- CREATE NEW NOTE SECTION --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
        <button className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Create New Note</h3>

        {/* Note Type Selector */}
        <div className="space-y-3 mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note Type</p>
          <div className="flex flex-wrap gap-3">
            <TypeButton icon={<MessageSquare size={14} />} label="General" active color="bg-slate-100 text-slate-700 border-slate-300" />
            <TypeButton icon={<Heart size={14} />} label="Preference" color="text-pink-500 bg-pink-50 border-pink-100" />
            <TypeButton icon={<AlertCircle size={14} />} label="Complaint" color="text-red-500 bg-red-50 border-red-100" />
            <TypeButton icon={<Star size={14} />} label="Special Request" color="text-orange-500 bg-orange-50 border-orange-100" />
          </div>
        </div>

        {/* Note Content Input */}
        <div className="space-y-3 mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Note Content</p>
          <textarea 
            placeholder="Enter note details..."
            className="w-full h-32 p-4 bg-slate-50 dark:bg-[#141414] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
            Add New Note <Plus size={18} />
          </button>
        </div>
      </div>

      {/* --- NOTES LIST SECTION --- */}
      <div className="space-y-4">
        
        {/* Preference Note */}
        <NoteCard 
          borderColor="border-orange-300"
          tags={[
            { label: "Preference", color: "text-pink-500 bg-pink-50 border-pink-100", icon: <Heart size={12} /> },
            { label: "Special Request", color: "text-orange-500 bg-orange-50 border-orange-100", icon: <Star size={12} /> }
          ]}
          content="Guest prefers high floor rooms with city view. Allergic to feather pillows - always provide hypoallergenic bedding."
          meta="Jan 2, 2026 at 9:45 AM"
          isStarred={true}
          
        />

        {/* General Note */}
        <NoteCard 
          borderColor="border-slate-200"
          tags={[
            { label: "General", color: "bg-slate-100 text-slate-700 border-slate-200", icon: <MessageSquare size={12} /> }
          ]}
          content="Guest requested late check-out for the departure on the 28th. Noted in the booking calendar for Housekeeping awareness."
          meta="Jan 2, 2026 at 9:45 AM"
          isStarred={false}
        />

        {/* Complaint Note */}
        <NoteCard 
          borderColor="border-red-200"
          tags={[
            { label: "Complaint", color: "text-red-500 bg-red-50 border-red-100", icon: <AlertCircle size={12} /> }
          ]}
          content="Previously complained about noise from elevator on Floor 3 during Nov stay. Provided complimentary room upgrade and breakfast. Issue resolved satisfactorily."
          meta="Jan 2, 2026 at 9:45 AM"
          isStarred={false}
        />

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TypeButton = ({ icon, label, color, active }) => (
  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${color} ${active ? 'ring-2 ring-slate-400' : 'opacity-80 hover:opacity-100'}`}>
    {icon} {label}
  </button>
);

const NoteCard = ({ borderColor, tags, content, meta, isStarred }) => (
  <div className={`bg-white rounded-xl ${borderColor} border shadow-sm p-5`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, idx) => (
          <div key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold ${tag.color}`}>
            {tag.icon} {tag.label}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <button className={isStarred ? "text-orange-400" : "hover:text-slate-600"}>
          <Star size={18} fill={isStarred ? "currentColor" : "none"} />
        </button>
        <button className="hover:text-slate-600"><Pencil size={18} /></button>
        <button className="hover:text-red-500"><Trash2 size={18} /></button>
      </div>
    </div>
    
    <p className="text-sm  leading-relaxed font-medium mb-4">
      {content}
    </p>
    
    <p className="text-[11px] text-slate-400 font-semibold tracking-tight">
      {meta}
    </p>
  </div>
);

export default GuestNotes;