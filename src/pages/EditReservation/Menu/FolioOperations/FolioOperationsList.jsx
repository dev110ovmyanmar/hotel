// import React, { useState } from "react";
// import ReservationHeader from "../../Components/ReservationHeader";
// import ReservationMenu from "../../Components/ReservationMenu";
// import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
// import FolioOperationsButtons from "./Components/FolioOperationsButtons/FolioOperationsButtons";
// import FolioOperationsTable from "./Components/FolioOperationsTable";
// import FolioOperationsForm from "./Components/FolioOperationsForms/FolioOperationsForm";
// import { Card, Divider, Modal } from "antd";
// import useApiQuery from "../../../../hooks/useApiQuery";
// import { getFolioList, createFolio } from "../../../../api/folioApi";
// import { LIMITS } from "../../../../variables/constants";
// import { useLocation } from "react-router-dom";
// import { useApiMutation } from "../../../../hooks/useApiMutation";
// import { serviceOrderList } from "../../../../api/reservationSectionApi";

// const FolioOperationsList = () => {
//   const [keyword, setKeyword] = useState("");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [mode, setMode] = useState("add");
//   const [selectedData, setSelectedData] = useState(null);
//   const [isTableVisible, setIsTableVisible] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);

//   const location = useLocation();
//   const uuid = location.state?.bookingId;

//   const {
//     folioList: data,
//     isLoading,
//     error,
//   } = useApiQuery({
//     fetchQueryName: "folios",
//     fetchQueryFunction: getFolioList,
//     params: {
//       pagination: {
//         page: page,
//         perPage: perPage,
//       },
//       keyword,
//       reservation: {
//         uuid: uuid,
//       },
//     },
//   });
//   console.log(folioList, "folioList");

//   const { serviceData: data, refetch } = useApiQuery({
//     fetchQueryName: "service-order",
//     fetchQueryFunction: serviceOrderList,
//     params: {
//       pagination: {
//         page,
//         perPage,
//       },
//       keyword,
//       reservation: { uuid },
//     },
//   });

//   const isFolioEmpty = folioList?.data?.length === 0;
//   const isFolioLineIsEmpty = folioList?.data?.every(
//     (folio) => !folio.folioLines || folio.folioLines.length === 0,
//   );

//   const createFolioMutation = useApiMutation({
//     mutationFn: createFolio,
//     invalidateKeys: [["folios"]],
//     shouldInvalidate: page === 1,
//   });

//   const handleAddFolioOperations = () => {
//     setSelectedData(null);
//     setMode("add");
//     setModalOpen(true);
//   };

//   const handleCreateFolio = () => {
//     createFolioMutation.mutate(
//       { reservation: { uuid: uuid } },
//       {
//         onSuccess: () => {
//           setModalOpen(false);
//         },
//       },
//     );
//   };

//   return (
//     <div className="w-full px-6 py-2">
//       <ReservationHeader data={folioList ?? {}} />
//       <ReservationMenu />
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <ReservationListHeader
//           reservationId={folioList?.reservation?.reservationNo}
//           onAddreservation={handleAddFolioOperations}
//           addButtonText={!isFolioEmpty ? "Split New Folio" : ""}
//         />
//       </div>

//       {/* <FolioOperationsButtons data={folioList || {}} /> */}

//       <FolioOperationsTable
//         setSelectedData={setSelectedData}
//         setMode={setMode}
//         setDrawerOpen={setDrawerOpen}
//         dataSource={folioList?.data}
//         onCreateFolio={handleAddFolioOperations}
//         isFolioLineIsEmpty={isFolioLineIsEmpty}
//       />

//       <Modal
//         title="Create New Folio"
//         open={modalOpen}
//         onCancel={() => setModalOpen(false)}
//         onOk={handleCreateFolio}
//         okText="Create Folio"
//         confirmLoading={createFolioMutation.isPending}
//         closable={false}
//         centered
//         className="custom-ant-modal"
//       >
//         <p className="ml-5 mt-5">
//           {/* Do you want to create a new Folio for Reservation Id: <strong>{folioList?.reservation?.reservationNo}</strong>
//            */}
//           Are you sure you want to split into a new folio?
//         </p>
//         <Divider />
//       </Modal>
//     </div>
//   );
// };

// export default FolioOperationsList;
import React, { useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import FolioOperationsButtons from "./Components/FolioOperationsButtons/FolioOperationsButtons";
import FolioOperationsTable from "./Components/FolioOperationsTable";
import FolioOperationsForm from "./Components/FolioOperationsForms/FolioOperationsForm";
import { Card, Divider, Modal } from "antd";
import useApiQuery from "../../../../hooks/useApiQuery";
import { getFolioList, createFolio } from "../../../../api/folioApi";
import { LIMITS } from "../../../../variables/constants";
import { useLocation } from "react-router-dom";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { serviceOrderList } from "../../../../api/reservationSectionApi";
import AddNewServiceOrderForm from "./Components/FolioOperationsForms/AddNewServiceOrderForm";

const FolioOperationsList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const location = useLocation();
  const uuid = location.state?.bookingId;

  // FIX 1: Syntax is data: folioList (originalName: newName)
  const {
    data: folioList,
    isLoading,
    error,
  } = useApiQuery({
    fetchQueryName: "folios",
    fetchQueryFunction: getFolioList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      reservation: {
        uuid: uuid,
      },
    },
  });

  // FIX 2: Syntax is data: serviceData to avoid using the name 'data' twice
  const { data: serviceData, refetch } = useApiQuery({
    fetchQueryName: "service-order",
    fetchQueryFunction: serviceOrderList,
    params: {
      pagination: {
        page,
        perPage,
      },
      keyword,
      reservation: { uuid },
    },
  });

  // Safe to log here now that variables are properly initialized
  console.log(folioList, "folioList");
  console.log(serviceData, "serviceData");

  const isFolioEmpty = folioList?.data?.length === 0;
  const isFolioLineIsEmpty = folioList?.data?.every(
    (folio) => !folio.folioLines || folio.folioLines.length === 0,
  );

  const createFolioMutation = useApiMutation({
    mutationFn: createFolio,
    invalidateKeys: [["folios"]],
    shouldInvalidate: page === 1,
  });

  const handleAddFolioOperations = () => {
    setSelectedData(null);
    setMode("add");
    setModalOpen(true);
  };

  const handleCreateFolio = () => {
    createFolioMutation.mutate(
      { reservation: { uuid: uuid } },
      {
        onSuccess: () => {
          setModalOpen(false);
        },
      },
    );
  };

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
      />

      <FolioOperationsTable
        setSelectedData={setSelectedData}
        setMode={setMode}
        setDrawerOpen={setDrawerOpen}
        dataSource={folioList?.data}
        onCreateFolio={handleAddFolioOperations}
        isFolioLineIsEmpty={isFolioLineIsEmpty}
      />

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
