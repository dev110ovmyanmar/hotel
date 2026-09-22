import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { fetchPartner } from './../../api/partnerApi';
import CompanyTable from './Components/CompanyTable';
import CompanyForm from './Components/CompanyForm/CompanyForm';
import { PERMISSIONS } from "../../variables/permission";

const CompanyList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "companys",
    fetchQueryFunction: fetchPartner ,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
      partnerType : "Company" 
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
          searchPlaceholder="Search Companies / Corporates ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Companies / Corporates"
          onAdd={handleAdd}
          permission={PERMISSIONS.PARTNER_CREATE}
        />
      </div>

      <CompanyTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isFetching}
      />

      <CompanyForm
        mode={mode}
        setMode={setMode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
      />
    </div>
  );
};

export default CompanyList;
