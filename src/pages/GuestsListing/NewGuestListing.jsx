import React, { useState, useEffect } from "react";
import { getGuests } from "../../api/guestApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import GuestTable from "./Components/NewGuestTable";
import GuestForm from "./Components/NewGuestForm";
import { LIMITS } from "../../variables/constants";
import { useNavigate } from "react-router-dom";

const GuestList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();


  // Fetch List Data
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "guests",
    fetchQueryFunction: getGuests,
    params: {
      pagination: { page, perPage },
      keyword,
    },
  });

  const guests = data?.data || [];
  const pagination = data?.pagination || {};

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

  const handleViewNotes = (record) => {
    navigate(`/guest-list/guest-notes/${record.uuid}`);
  }

  return (
    <div className="w-full">
      <div className="px-6 py-4">
        <ListHeader
          title="Guest List"
          searchPlaceholder="Search Guest..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Guest"
          onAdd={handleAdd}
        />
      </div>

      <GuestTable
        dataSource={guests}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        onViewNotes={handleViewNotes}
      />

      <GuestForm
        mode={currentMode}
        setMode={setCurrentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setPage={setPage}
        page={data?.pagination?.currentPage}
      />
    </div>
  );
};

export default GuestList;
