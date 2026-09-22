import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { facilityBookingDetails, fetchFacilityBooking } from "../../api/booking";
import FacilityBookingTable from "./Components/FacilityBookingTable";
import FacilityBookingForm from "./Components/FacilityBookingForm/FacilityBookingForm";
import { PERMISSIONS } from "../../variables/permission";

const FacilityBookingList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "facility-booking-list",
    fetchQueryFunction: fetchFacilityBooking,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      // status: normalStatus,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search Facility Booking ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Facility Booking"
          onAdd={handleAdd}
          permission={PERMISSIONS.FACILITY_BOOKING_CREATE}
        />
      </div>

      <FacilityBookingTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isFetching}
      />

      <FacilityBookingForm
        mode={mode}
        setMode={setMode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default FacilityBookingList;
