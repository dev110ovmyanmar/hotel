import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "./../../component/ListHeader/ListHeader";
import { fetchPayment } from "./../../api/paymentApi";
import PaymentTable from "./Components/PaymentTable";
import PaymentForm from "./Components/PaymentForm/PaymentForm";
import { PERMISSIONS } from "../../variables/permission";

// PaymentList
const PaymentList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "payments",
    fetchQueryFunction: fetchPayment,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, status, perPage]);

  const handleAdd = () => {
    setDrawerOpen(true);
    setSelectedData({});
    setMode("add");
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Payment List"
          searchPlaceholder="Search Payment ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Payment"
          onAdd={handleAdd}
          permission={PERMISSIONS.TAX_CREATE}
        />
      </div>

      <PaymentTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isFetching}
      />

      <PaymentForm
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

export default PaymentList;
