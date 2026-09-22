import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getfolioPaymentList } from "../../api/paymentAndBillingApi";
import PaymentHistoryAllTable from "./Components/PaymentHistoryAllTable";

// PaymentList
const PaymentList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);


  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "payments",
    fetchQueryFunction: getfolioPaymentList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Payment History List"
          searchPlaceholder="Search Payment History..."
          keyword={keyword}
          setKeyword={setKeyword}
          showCreateButton={false}
        />
      </div>

      <PaymentHistoryAllTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isFetching}
      />
    </div>
  );
};

export default PaymentList;
