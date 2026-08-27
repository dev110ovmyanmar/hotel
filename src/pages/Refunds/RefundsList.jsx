import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getfolioPaymentList } from "../../api/paymentAndBillingApi";
import RefundsTable from "./Components/RefundsTable";
import { queryClient } from "../../app/queryClient";


// PaymentList
const RefundsList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const paymentTypes = initData?.statuses?.payment_type;
  const paymentType = paymentTypes?.find((item)=>item.code === "refund").uuid;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "payments",
    fetchQueryFunction: getfolioPaymentList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      paymentType:{
        uuid: paymentType
      }
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Refunds List"
          searchPlaceholder="Search Refund..."
          keyword={keyword}
          setKeyword={setKeyword}
          showCreateButton={false}
        />
      </div>

      <RefundsTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isLoading}
      />
    </div>
  );
};

export default RefundsList;
