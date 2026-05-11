import React, { useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import FolioOperationsButtons from "./Components/FolioOperationsButtons/FolioOperationsButtons";
import FolioOperationsTable from "./Components/FolioOperationsTable";
import FolioOperationsForm from "./Components/FolioOperationsForms/FolioOperationsForm";
import { Card, Divider, Modal } from "antd";

const FolioOperationsList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddFolioOperations = () => {
    setSelectedData(null);
    setMode("add");
    setModalOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader />
      <ReservationMenu />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <ReservationListHeader
          reservationId="123212321"
          onAddreservation={handleAddFolioOperations}
          addButtonText={"Add Folio Operations"}
        />
      </div>

      <FolioOperationsButtons />

      {/* <FolioOperationsTable /> */}

      <Modal
        title="
        Create New Folio"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        okText="Create Folio"
        closable={false}
        centered
        className="custom-ant-modal"
      >
        <p className="ml-5 mt-5">
          Do you want to create a new Folio for Reservation Id: 1234567890?
        </p>
        <Divider />
      </Modal>
    </div>
  );
};

export default FolioOperationsList;
