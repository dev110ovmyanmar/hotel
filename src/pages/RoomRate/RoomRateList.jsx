import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { PERMISSIONS } from "../../variables/permission";
import {fetchRoomRate} from "../../api/roomRateApi";
import RoomRateForm from "./Components/RoomRateForm/RoomRateForm";
import RoomRateTable from "./Components/RoomRateTable";

const RoomRateList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "room-rates",
    fetchQueryFunction: fetchRoomRate,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, status, perPage]);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search Room Rate ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Room Rate"
          onAdd={handleAdd}
          // permission={PERMISSIONS.ROOM_RATE_CREATE}
        />
      </div>

      <RoomRateTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <RoomRateForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default RoomRateList;
