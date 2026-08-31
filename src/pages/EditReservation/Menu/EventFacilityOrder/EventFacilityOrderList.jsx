import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import EventFacilityOrderTable from "./Components/EventFacilityOrderTable";
import EventFacilityOrderForm from "./Components/EventFacilityOrderForms/EventFacilityOrderForm";
import useApiQuery from "../../../../hooks/useApiQuery";
import { fetchFacilityBooking } from "../../../../api/booking";
import { LIMITS } from "../../../../variables/constants";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReservationMenu from "../../Components/ReservationMenu.jsx";
import Loader from "../../../../component/Loader/Loader.jsx";

const EventFacilityOrderList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const uuid = bookingId;

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cleanId = bookingId ? bookingId.trim() : "";

    if (
      !cleanId ||
      cleanId === "" ||
      cleanId === ":bookingId" ||
      cleanId.length < 32
    ) {
      navigate("/404", { replace: true });
    }
  }, [bookingId, navigate]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [searchOpen, setSearchOpen] = useState(false);
  const selectedRoomUuid = searchParams.get("selectedRoomUuid") || bookingId;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "facility-booking-list",
    fetchQueryFunction: fetchFacilityBooking,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid: selectedRoomUuid },
    },
    options: {
      enabled: !!selectedRoomUuid,
    }
  });

  useEffect(() => {
    if (bookingId && data?.reservation?.reservationNo) {
      sessionStorage.setItem(
        `breadcrumb_${bookingId}`,
        data.reservation.reservationNo,
      );
      window.dispatchEvent(new Event("breadcrumb_updated"));
    }
  }, [data, bookingId]);

  const handleAddEvent = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data || {}} />
      <ReservationMenu data={data} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleAddEvent}
          addButtonText={"Add Facility"}
        />
      </div>

      <EventFacilityOrderTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isLoading}
      />

      {
        drawerOpen && (
          <EventFacilityOrderForm
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            mode={mode}
            reservationId={data?.reservation?.uuid}
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
          />
        )
      }
    </div>
  );
};

export default EventFacilityOrderList;
