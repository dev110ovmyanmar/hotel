import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { fetchRoomType } from "../../api/roomApi";
import RoomTypeTable from "./components/RoomTypeTable";
import RoomTypeForm from "./components/RoomTypeForm/RoomTypeForm";
import { PERMISSIONS } from "../../variables/permission";

const RoomTypeList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roomTypeData",
    fetchQueryFunction: fetchRoomType,
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
          title="Room Type List"
          searchPlaceholder="Search Room Types ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Room Type"
          onAdd={handleAdd}
          permission={PERMISSIONS.ROOM_TYPE_CREATE}
        />
      </div>

      <RoomTypeTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isLoading}
      />

      <RoomTypeForm
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default RoomTypeList;
