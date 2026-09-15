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
  folioAdjust,
  folioRebate,
  folioVoid,
  getfolioPrint
} from "../../../../api/folioApi";
import { LIMITS } from "../../../../variables/constants";
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [printingFolioUuid, setPrintingFolioUuid] = useState(null);
  const [isPrintAllLoading, setIsPrintAllLoading] = useState(false);
  const [isSinglePrint, setIsSinglePrint] = useState(false);

  // get login admin details
  const adminUuid = loadState(LOCAL_STORAGE_KEYS.loginAdminDetails)?.uuid;

  const { data: loginAdminDetails } = useApiQuery({
    fetchQueryName: "login-admin-details",
    fetchQueryFunction: adminDetails,
    params: { uuid: adminUuid },
  });
  const adminName = `${loginAdminDetails?.name}`;
  const adminRole = `${loginAdminDetails?.role?.name}`;

  // Property image
  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const propertyData = initData?.property;

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
    options: {
      enabled: !!uuid,
    }
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

  const adjustLineMutation = useApiMutation({
    mutationFn: folioAdjust,
    invalidateKeys: [["folios"]],
  });

  const rebateLineMutation = useApiMutation({
    mutationFn: folioRebate,
    invalidateKeys: [["folios"]],
  })

  const voidLineMutation = useApiMutation({
    mutationFn: folioVoid,
    invalidateKeys: [["folios"]],
  })

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

  // Opens the preview modal when printTarget is set
  useEffect(() => {
    if (printTarget) {
      setPreviewOpen(true);
    }
  }, [printTarget]);

  // Triggers native browser print on the preview content
  const handlePrintPreview = () => {
    const originalTitle = document.title;
    document.title = `Invoice_${printTarget?.reservation?.reservationNo || "Receipt"}`;

    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  // Closes the preview modal and clears print target
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPrintTarget(null);
  };

  //Print All Folios
  const handlePrintAll = useCallback(async () => {
    if (!folioList?.data || folioList.data.length === 0) return;

    setIsPrintAllLoading(true);
    setIsSinglePrint(false);
    try {
      const printData = await queryClient.fetchQuery({
        queryKey: ["allFolioPrintData", { reservation: { uuid: reservationUuid } }],
        queryFn: () => getfolioPrint({ reservation: { uuid: reservationUuid } }),
      });

      setPrintTarget(printData);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setIsPrintAllLoading(false);
    }
  }, [folioList, reservationUuid, queryClient]);

  //Print Single Folio
  const handlePrintSingleFolio = useCallback(async (folio) => {
          setPrintingFolioUuid(folio.uuid);
          setIsSinglePrint(true);
          try {
            const printData = await queryClient.fetchQuery({
              queryKey: ["folioPrintData", { reservation: { uuid: reservationUuid }, folio: { uuid: folio.uuid } }],
              queryFn: () => getfolioPrint({ reservation: { uuid: reservationUuid }, folio: { uuid: folio.uuid } }),
            });
            setPrintTarget(printData);
          } catch (err) {
            console.log("Error", err);
          }
          finally {
            setPrintingFolioUuid(null);
          }
        }, [reservationUuid, queryClient, folioList])

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
        isPrintAllLoading={isPrintAllLoading}
        reservationUuid={reservationUuid}
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
        onAdjustLine={adjustLineMutation.mutateAsync}
        isAdjusting={adjustLineMutation.isPending}
        onRebateLine={rebateLineMutation.mutateAsync}
        isRebating={rebateLineMutation.isPending}
        onVoidLine={voidLineMutation.mutateAsync}
        isVording={voidLineMutation.isPending}
        printingFolioUuid={printingFolioUuid}
        onPrintFolio={handlePrintSingleFolio}
      />

      {/* Hidden container for window.print() to capture */}
      {printTarget &&
        createPortal(
          <div id="native-print-container">
            <FolioInvoicePrint
              printData={printTarget}
              adminName={adminName}
              adminRole={adminRole}
              propertyData={propertyData}
              isSinglePrint={isSinglePrint}
            />
          </div>,
          document.body,
        )}

      {/* Print Preview Modal */}
      <Modal
        title="Invoice Preview"
        open={previewOpen}
        onCancel={handleClosePreview}
        width={900}
        centered
        footer={
          <div className="flex justify-end gap-2">
            <button
              key="close"
              onClick={handleClosePreview}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              key="print"
              onClick={handlePrintPreview}
              style={{
                padding: "8px 16px",
                backgroundColor: "#1677ff",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Print
            </button>
          </div>
        }
        styles={{ body: { padding: 0, overflow: "auto", maxHeight: "80vh" } }}
      >
        {printTarget && (
          <div className="p-4">
            <FolioInvoicePrint
              printData={printTarget}
              adminName={adminName}
              adminRole={adminRole}
              propertyData={propertyData}
              hideLetterhead
              isSinglePrint={isSinglePrint}
            />
          </div>
        )}
      </Modal>

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
