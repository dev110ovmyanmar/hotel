import React, { useState, useEffect } from "react";
import { getGuestNotes } from "../../../api/guestNoteApi";
import useApiQuery from "../../../hooks/useApiQuery";
import ListHeader from "../../../component/ListHeader/ListHeader";
import GuestNotesTable from "./components/GuestNotesTable";
import GuestNoteForm from "./components/GuestNoteForm";
import { LIMITS } from "../../../variables/constants";
import { useParams } from "react-router-dom";

const GuestNotesListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { guestId: guestUuid } = useParams();

  // Fetch List Data
const { data, isLoading } = useApiQuery({
    fetchQueryName: "guestNotes",
    fetchQueryFunction: getGuestNotes,
    params: { 
      pagination: {
        page: page,
        perPage: perPage
      },
      keyword, 
      guest: { uuid: guestUuid } },
  });

  const guestNotes = data?.data || [];

  // Reset page to 1 when searching
  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  // Handlers
  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setDrawerOpen(true);
  };

  const handleView = (record) => {
    setSelectedRow(record);
    setCurrentMode("view");
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRow(record);
    setCurrentMode("edit");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full">
      <div className="px-6 py-4">
        <ListHeader
          title="Guest Note List"
          searchPlaceholder="Search Guest Note ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Guest Note"
          onAdd={handleAdd}
        />
      </div>

      <GuestNotesTable
        dataSource={guestNotes}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <GuestNoteForm
        mode={currentMode}
        setMode={setCurrentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setPage={setPage}
        page={page}
        // page={data?.pagination?.currentPage}
        guestUuid={guestUuid}
        // guestName={guestName}
      />
    </div>
  );
};

export default GuestNotesListing;
