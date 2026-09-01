import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import { useApiQuery } from "./../../../../hooks/useApiQuery";
import { serviceOrderList } from "../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../variables/constants";
import ServiceOrderTable from "./Components/ServiceOrderTable";
import ServiceOrderForm from "./Components/ServiceOrderForms/ServiceOrderForm";
import Loader from "../../../../component/Loader/Loader";
import ServiceAddonDrawer from "./Components/ServiceOrderForms/ServiceAddonDrawer";
import { Button } from "antd";

const ServiceOrderList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const uuid = bookingId;
  
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
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "service-order",
    fetchQueryFunction: serviceOrderList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid: uuid },
    },
    options: {
      enabled: !!uuid,
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

  const handleAddService = () => {
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
          onAddreservation={handleAddService}
          addButtonText="Add Service Order"
        />
      </div>

      <Button className="mb-2 custom-blue-btn" onClick={() => setOpen(true)}>
        View Add On Service
      </Button>

      <ServiceOrderTable
        data={data?.data || []}
        page={page}
        perPage={perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
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

      {open && (
        <ServiceAddonDrawer
          mode={mode}
          open={open}
          onClose={() => setOpen(false)}
          reservationId={uuid}
          reservationDetails={data}
        />
      )}
    </div>
  );
};

export default ServiceOrderList;