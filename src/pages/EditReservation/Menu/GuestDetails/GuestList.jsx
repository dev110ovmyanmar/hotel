import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Form } from "antd";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import GuestTable from "./Components/GuestTable";
import GuestForm from "./Components/GuestForms/GuestForm";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import { reservationGuestList } from "../../../../api/reservationSectionApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { LIMITS } from "../../../../variables/constants";
import GuestUploadDrawer from "./Components/GuestForms/GuestUploadDrawer";

const GuestList = () => {
  const location = useLocation();
  const uuid = location.state?.bookingId;
  const [form] = Form.useForm();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "reservation-guest",
    fetchQueryFunction: reservationGuestList,
    params: {
      pagination: {
        page,
        perPage,
      },
      keyword,
      reservation: { uuid },
    },
  });

  const handleAddGuest = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  const reservationInfo = data?.reservation ?? null;

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data ?? {}} />
      <ReservationMenu />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={reservationInfo?.reservationNo}
          onAddreservation={handleAddGuest}
          addButtonText={
            ["pending", "confirmed", "booked", "checked_in"].includes(
              data?.reservation?.reservationStatus?.code?.toLowerCase(),
            )
              ? "Add New Guest"
              : null
          }
          onSearch={setKeyword}
        />
      </div>

      <GuestTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isLoading}
        reservationUuid={reservationInfo}
      />

      {drawerOpen && (
        <GuestForm
          form={form}
          mode={mode}
          onSuccess={refetch}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          reservationUuid={reservationInfo}
        />
      )}
    </div>
  );
};

export default GuestList;
