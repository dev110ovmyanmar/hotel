import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import { useApiQuery } from "./../../../../hooks/useApiQuery";
import { serviceOrderList } from "../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../variables/constants";
import ServiceOrderTable from "./Components/ServiceOrderTable";
import ServiceOrderForm from "./Components/ServiceOrderForms/ServiceOrderForm";

const ServiceOrderList = () => {
  const location = useLocation();
  const uuid = location.state?.bookingId;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const { data, refetch } = useApiQuery({
    fetchQueryName: "service-order",
    fetchQueryFunction: serviceOrderList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid },
    },
  });

  const handleAddService = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data ?? {}} />
      <ReservationMenu data={data} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleAddService}
          addButtonText="Add Service"
        />
      </div>

      <ServiceOrderTable
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
      />

      {drawerOpen && (
        <ServiceOrderForm
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

export default ServiceOrderList;
