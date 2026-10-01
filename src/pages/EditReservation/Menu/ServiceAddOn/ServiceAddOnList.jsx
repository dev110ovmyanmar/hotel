import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import { useApiQuery } from "./../../../../hooks/useApiQuery";
import {
  serviceAddonList,
} from "../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../variables/constants";
import ServiceAddOnForm from "./Components/ServiceAddOnForms/ServiceAddOnForm";
import ServiceAddOnTable from "./Components/ServiceAddOnTable";
import Loader from "../../../../component/Loader/Loader";

const ServiceAddOnList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const uuid = bookingId; // assigned directly to your uuid variable

  // ROUTING GUARD: Kick out unassigned, empty, or partial/mangled IDs instantly
  useEffect(() => {
    const cleanId = bookingId ? bookingId.trim() : "";

    if (
      !cleanId ||
      cleanId === "" ||
      cleanId === ":bookingId" ||
      cleanId.length < 32 // Checks if the user chopped or deleted characters from the ID
    ) {
      navigate("/404", { replace: true });
    }
  }, [bookingId, navigate]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const { data, isFetching, refetch, isLoading} = useApiQuery({
    fetchQueryName: "service-addon",
    fetchQueryFunction: serviceAddonList,
    params: {
      pagination: {
        page,
        perPage,
      },
      keyword,
      reservationRoom: { uuid: uuid },
    },
    options: {enabled: !!uuid}
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

  const handleServiceAddon = () => {
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
      <ReservationHeader data={data ?? {}} />
      <ReservationMenu data={data} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleServiceAddon}
          addButtonText="Add Service"
        />
      </div>

      <ServiceAddOnTable
        data={data?.data || []}
        onView={(row) => {
          setSelectedData(row);
          setMode("view");
          setDrawerOpen(true);
        }}
        onEdit={(row) => {
          setSelectedData(row);
          setMode("edit");
          setDrawerOpen(true);
        }}
        loading={isFetching}
      />

      {drawerOpen && (
        <ServiceAddOnForm
          serviceData={mode === "add" ? data?.reservation : selectedData}
          mode={mode}
          setMode={setMode}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedData(null);
          }}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default ServiceAddOnList;
