import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { PERMISSIONS } from "../../variables/permission";
import { fetchPartnerContract } from "../../api/partnerContractApi";
import AgencyContractTable from "./Components/AgencyContractTable";
import AgencyContractForm from "./Components/AgencyContractForm/AgencyContractForm";
import { capitalizeFirstLetter } from '../../utils/Utils';


const AgencyContractList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const { state } = useLocation();

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "partner-contracts",
    fetchQueryFunction: fetchPartnerContract,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
      partnerType: "Agency",
      uuid: state?.agencyRecord?.uuid
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, status, perPage]);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search  ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add Contract "
          onAdd={handleAdd}
        // permission={PERMISSIONS.ROOM_RATE_CREATE}
        />
      </div>

      <AgencyContractTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isLoading}
      />

      <AgencyContractForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default AgencyContractList;
