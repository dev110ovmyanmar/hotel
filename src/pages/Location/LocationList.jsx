import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import { fetchLocation } from "../../api/locationApi";
import LocationTable from "./Components/LocationTable";
import LocationForm from "./Components/LocationForm/LocationForm";
import ListHeader from "../../component/ListHeader/ListHeader";
import { PERMISSIONS } from "../../variables/permission";

const LocationList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "locations",
    fetchQueryFunction: fetchLocation,
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
    setModalOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Location List"
          searchPlaceholder="Search Location ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Location"
          onAdd={handleAdd}
          permission={PERMISSIONS.LOCATION_CREATE}
        />
      </div>

      <LocationTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        setPage={setPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <LocationForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
        mode={mode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default LocationList;
