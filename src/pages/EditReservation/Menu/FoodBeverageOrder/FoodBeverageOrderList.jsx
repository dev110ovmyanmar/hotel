import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import { useApiQuery } from "./../../../../hooks/useApiQuery";
import { serviceOrderList } from "../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../variables/constants";
import Loader from "../../../../component/Loader/Loader";
import FoodBeverageOrderTable from "./Components/FoodBeverageOrderTable";
import FoodBeverageOrderForm from "./Components/FoodBeverageOrderForms/FoodBeverageOrderForm";
import { fetchFoodBeverageOrderList } from "../../../../api/foodBeverageOrder";

const FoodBeverageOrderList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const uuid = bookingId;

  const isValidBookingId =
  !!bookingId &&
  bookingId !== ":bookingId" &&
  bookingId.trim().length >= 32;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "food-beverage-orders",
    fetchQueryFunction: fetchFoodBeverageOrderList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: {
        uuid
      }
    },
    options:{
      enabled : isValidBookingId
    }

  });
  // useEffect(() => {
  //   if (bookingId && data?.reservation?.reservationNo) {
  //     sessionStorage.setItem(
  //       `breadcrumb_${bookingId}`,
  //       data.reservation.reservationNo,
  //     );
  //     window.dispatchEvent(new Event("breadcrumb_updated"));
  //   }
  // }, [data, bookingId]);

  const handleAddService = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };
  console.log(data,"DataInFoodBeverageOrderLIst")
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }
  console.log(data,"FoodBeverageOrderDataList")
  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data ?? {}} />
      <ReservationMenu data={data} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleAddService}
          addButtonText="Add F&B Order"
        />
      </div>

      <FoodBeverageOrderTable
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
        <FoodBeverageOrderForm
          reservationRoomNo={data?.reservationRoom?.room?.roomNo}
          reservationUuid={data?.reservation?.uuid}
          reservationRoomUuid={data?.reservationRoom?.uuid}
          reservationRoomId={bookingId}
          mode={mode}
          setMode={setMode}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setSelectedData(null);
          }}
          selectedData={selectedData}
        />
      )}
    </div>
  );
};

export default FoodBeverageOrderList;