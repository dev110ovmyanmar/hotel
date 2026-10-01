import React, { useState } from 'react';
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
import dayjs from 'dayjs';
import GuestNoteForm from '../../GuestNotes/components/GuestNoteForm';
import { Modal, Pagination } from 'antd';
import useApiQuery from '../../../../hooks/useApiQuery';
import { deleteGuestNote, getGuestNotes } from '../../../../api/guestNoteApi';
import { useApiMutation } from '../../../../hooks/useApiMutation';
import { LIMITS } from '../../../../variables/constants';
import Loader from '../../../../component/Loader/Loader';

const GuestNotes = ({
  guestUuid
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedRow, setSelectedRow] = useState();
  const [deleteUuid, setDeleteUuid] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  // Guest Note
  const { data: guestNoteList, isFetching: guestNoteListFetching } = useApiQuery({
    fetchQueryName: "guestNotes",
    fetchQueryFunction: getGuestNotes,
    params: {
      partnerType: "Guest",
      guest: { uuid: guestUuid },
      pagination: {
        page: page,
        perPage: perPage,
      },
    },
    options: { enabled: !!guestUuid }
  });

  const deleteGuestNotes = useApiMutation({
    mutationFn: deleteGuestNote,
    invalidateKeys: [["guestNotes", { uuid: selectedRow?.uuid }]],
  });

  const handleAdd = () => {
    setDrawerOpen(true),
      setMode("add"),
      setSelectedRow(null)
  };

  const handleUpdate = (item) => {
    setSelectedRow(item);
    setDrawerOpen(true);
    setMode("edit");
  };

  const handleDelete = (item) => {
    const payload = {
      uuid: item
    };
    deleteGuestNotes.mutate(payload, {
      onSuccess: () => {
        setDeleteModalOpen(false)
      }
    })
  }

  return (
    <div className="w-full mx-auto py-6 space-y-6 bg-slate-50 dark:bg-[#141414]">
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-5 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors cursor-pointer"
          onClick={handleAdd}
        >
          Add New Note <Plus size={18} />
        </button>
      </div>

      {/* --- NOTES LIST SECTION --- */}
      {
        guestNoteListFetching
          ?
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
          :
          <div className="space-y-4">
            {/* Preference Note */}
            {
              guestNoteList?.data?.length <= 0 ? " " : <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 ml-1">Guest Notes</h2>
            }
            {
              guestNoteList?.data?.map(item => {
                return (
                  <NoteCard
                    borderColor="border-orange-300"
                    tags={[
                      { label: "Preference", color: "text-pink-500 bg-pink-50 border-pink-100", icon: <Heart size={12} /> },
                      { label: "Special Request", color: "text-orange-500 bg-orange-50 border-orange-100", icon: <Star size={12} /> }
                    ]}
                    content={item?.note}
                    meta={dayjs(item?.createdAt).format("MMMM D, YYYY [at] h:mm A")}
                    isStarred={true}
                    onEdit={() => handleUpdate(item)}
                    deleteModal={() => {
                      setDeleteModalOpen(true);
                      setDeleteUuid(item?.uuid)
                    }}
                  />
                )
              })
            }
          </div>
      }

      <Modal
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => handleDelete(deleteUuid)}
        confirmLoading={deleteGuestNotes?.isPending}
      >
        Are you sure you want to delete this note?
      </Modal>

      {/* Pagination Section */}
      {
        guestNoteList?.pagination?.total !== 0 &&
        <div className='flex justify-end'>
          <Pagination
            current={guestNoteList?.pagination?.currentPage}
            pageSize={guestNoteList?.pagination?.perPage}
            total={guestNoteList?.pagination?.total}
            onChange={(page, pageSize) => {
              setPage(page);
              setPerPage(pageSize);
            }}
          />
        </div>
      }


      <GuestNoteForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        guestUuid={guestUuid}
        setPage={setPage}
        page={page}
      />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const TypeButton = ({ icon, label, color, active }) => (
  <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold transition-all ${color} ${active ? 'ring-2 ring-slate-400' : 'opacity-80 hover:opacity-100'}`}>
    {icon} {label}
  </button>
);

const NoteCard = ({ borderColor, tags, content, meta, isStarred, onEdit, deleteModal }) => (
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
        <button
          className="hover:text-slate-600 cursor-pointer"
          onClick={onEdit}
        >
          <Pencil size={18} />
        </button>
        <button
          className="hover:text-red-500 cursor-pointer"
          onClick={deleteModal}
        >
          <Trash2 size={18} />
        </button>

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