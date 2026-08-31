import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import Loader from "../../../../component/Loader/Loader";

const GuestList = () => {
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

  const reservationInfo = data?.reservation ?? null;

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
          // onAddreservation={handleAddGuest}
          addButtonText={null}
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
        reservationUuid={data?.data}
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
          roomuuid={selectedData?.uuid}
        />
      )}
    </div>
  );
};

export default GuestList;
