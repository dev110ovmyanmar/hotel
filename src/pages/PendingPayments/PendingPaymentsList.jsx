import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getfolioPaymentList } from "../../api/paymentAndBillingApi";
import PendingPaymentTable from "./Components/PendingPaymentTable";
import { queryClient } from "../../app/queryClient";


// PaymentList
const PedingPaymentsList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const paymentStautuses = initData?.statuses?.payment_status;
  const paymentStatus = paymentStautuses?.find((item)=>item.code === "pending").uuid;

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "payments",
    fetchQueryFunction: getfolioPaymentList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      paymentStatus: {
        uuid: paymentStatus
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
          title="Pending Payment List"
          searchPlaceholder="Search Pending Payment..."
          keyword={keyword}
          setKeyword={setKeyword}
          showCreateButton={false}
        />
      </div>

      <PendingPaymentTable
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

export default PedingPaymentsList;
