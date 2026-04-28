import React, { useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import FolioOperationsButtons from "./Components/FolioOperationsButtons/FolioOperationsButtons";
import FolioOperationsTable from "./Components/FolioOperationsTable";
import FolioOperationsForm from "./Components/FolioOperationsForms/FolioOperationsForm";

const FolioOperationsList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true);

  const handleAddFolioOperations = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader />
      <ReservationMenu />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <ReservationListHeader
          reservationId="123212321"
          onAddreservation={handleAddFolioOperations}
          addButtonText={"Add Folio Operations"}
        />
      </div>

      <FolioOperationsButtons />

      {/* <FolioOperationsTable /> */}
    </div>
  );
};

export default FolioOperationsList;
