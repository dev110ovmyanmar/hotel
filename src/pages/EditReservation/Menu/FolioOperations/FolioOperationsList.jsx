import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import FolioOperationsButtons from "./Components/FolioOperationsButtons/FolioOperationsButtons";
import FolioOperationsTable from "./Components/FolioOperationsTable";
import FolioInvoicePrint from "./Components/FolioInvoicePrint";
import { Card, Divider, Modal } from "antd";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  getFolioList,
  createFolio,
  transferFolioLines,
} from "../../../../api/folioApi";
import { LIMITS } from "../../../../variables/constants";
import { useLocation } from "react-router-dom";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { queryClient } from "../../../../app/queryClient";
import { loadState } from "../../../../utils";
import { LOCAL_STORAGE_KEYS } from "../../../../variables/constants";
import { adminDetails } from "../../../../api/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../component/Loader/Loader";

const FolioOperationsList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State holds the structured layout payload for printing
  const [printTarget, setPrintTarget] = useState(null);

  // get login admin details
  const adminUuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.uuid;
  const roleUuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.role?.uuid;

  const { data: loginAdminDetails } = useApiQuery({
    fetchQueryName: "login-admin-details",
    fetchQueryFunction: adminDetails,
    params: { uuid: adminUuid },
  });
  const adminName = `${loginAdminDetails?.name}`;

  // Property image
  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const propertyFiles = initData?.property?.propertyFiles;
  const propretyImage = propertyFiles?.find(
    (file) => file?.name === "email_photo",
  )?.file;

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

  const {
    data: folioList,
    isLoading,
    error,
  } = useApiQuery({
    fetchQueryName: "folios",
    fetchQueryFunction: getFolioList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid: uuid },
    },
  });

  useEffect(() => {
    if (bookingId && folioList?.reservation?.reservationNo) {
      sessionStorage.setItem(
        `breadcrumb_${bookingId}`,
        folioList.reservation.reservationNo,
      );
      window.dispatchEvent(new Event("breadcrumb_updated"));
    }
  }, [folioList, bookingId]);

  const reservationUuid = folioList?.reservation?.uuid;

  const isFolioEmpty = folioList?.data?.length === 0;
  const isFolioLineIsEmpty = folioList?.data?.every(
    (folio) => !folio.folioLines || folio.folioLines.length === 0,
  );

  const createFolioMutation = useApiMutation({
    mutationFn: createFolio,
    invalidateKeys: [["folios"]],
    shouldInvalidate: page === 1,
  });

  const transferLinesMutation = useApiMutation({
    mutationFn: transferFolioLines,
    invalidateKeys: [["folios"]],
  });

  const handleTransferLines = (
    { destinationFolioUuid, folioLineIds },
    onSuccess,
  ) => {
    transferLinesMutation.mutate(
      {
        reservation: { uuid: reservationUuid },
        folio: { uuid: destinationFolioUuid },
        folioLine: { ids: folioLineIds },
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const handleAddFolioOperations = () => {
    setSelectedData(null);
    setModalOpen(true);
  };

  const handleCreateFolio = () => {
    createFolioMutation.mutate(
      { reservation: { uuid: reservationUuid } },
      {
        onSuccess: () => {
          setModalOpen(false);
        },
      },
    );
  };

  // Watcher forces print trigger execution once state mounts element into DOM
  useEffect(() => {
    if (printTarget) {
      const originalTitle = document.title;
      document.title = `Invoice_${printTarget?.reservation?.reservationNo || "Receipt"}`;

      // Wait for DOM updates, then trigger native print
      setTimeout(() => {
        window.print();
        setPrintTarget(null);
        document.title = originalTitle;
      }, 100);
    }
  }, [printTarget]);

  const handlePrintAll = useCallback(() => {
    if (!folioList?.data || folioList.data.length === 0) return;
    setPrintTarget({
      folios: folioList.data,
      reservation: folioList.reservation,
    });
  }, [folioList]);

  // Global trigger event listener setup
  useEffect(() => {
    const handler = () => handlePrintAll();
    window.addEventListener("print-all-folios", handler);
    return () => window.removeEventListener("print-all-folios", handler);
  }, [handlePrintAll]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={folioList ?? {}} />
      <ReservationMenu data={folioList} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <ReservationListHeader
          reservationId={folioList?.reservation?.reservationNo}
          onAddreservation={handleAddFolioOperations}
          addButtonText={!isFolioEmpty ? "Split New Folio" : ""}
        />
      </div>

      <FolioOperationsButtons
        data={folioList?.reservation || []}
        folioUuid={folioList}
        onPrintAllFolios={handlePrintAll}
      />

      <FolioOperationsTable
        setSelectedData={setSelectedData}
        setMode={setMode}
        setDrawerOpen={setDrawerOpen}
        dataSource={folioList?.data}
        onCreateFolio={handleAddFolioOperations}
        isFolioLineIsEmpty={isFolioLineIsEmpty}
        onTransferLines={handleTransferLines}
        isTransferring={transferLinesMutation.isPending}
        // Triggers single folio extraction configurations
        onPrintFolio={(folio) =>
          setPrintTarget({ folio, reservation: folioList?.reservation })
        }
      />

      {/* Renders template outside the main DOM tree to prevent layout interference */}
      {printTarget &&
        createPortal(
          <div id="native-print-container">
            <FolioInvoicePrint
              folios={printTarget.folios}
              folio={printTarget.folio}
              adminName={adminName}
              reservation={printTarget.reservation}
              propertyImage={propretyImage}
            />
          </div>,
          document.body,
        )}

      <Modal
        title="Create New Folio"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleCreateFolio}
        okText="Create Folio"
        confirmLoading={createFolioMutation.isPending}
        closable={false}
        centered
        className="custom-ant-modal"
      >
        <p className="ml-5 mt-5">
          Are you sure you want to split into a new folio?
        </p>
        <Divider />
      </Modal>
    </div>
  );
};

export default FolioOperationsList;
