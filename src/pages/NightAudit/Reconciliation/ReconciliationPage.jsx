import { useNavigate } from "react-router-dom";
import { reconciliation } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import ReconciliationStatus from "./ReconciliationStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import ReconciliationTable from "./ReconciliationTable";
import { getNightAuditData, spinLoadingCenter } from "../../../variables/constants";
import { useEffect } from "react";
import Loader from "../../../component/Loader/Loader";

const ReconciliationPage = ({ stepValue }) => {

  const navigate = useNavigate();
  const nightAuditData = getNightAuditData();
  const businessDate = nightAuditData?.businessDate;
  const nightAudit = localStorage.getItem("nightAudit");

  useEffect(() => {
    if (!nightAudit) {
      navigate("/night-audit", { replace: true });
    }
  }, [navigate]);

  const { data, isFetching } = useApiQuery({
    fetchQueryName: "folio-review",
    fetchQueryFunction: reconciliation,
    params: {businessDate},
    options: { enabled: !!nightAudit},
  });

    useEffect(() => {
    if (typeof data?.isConfirmed === "boolean") {
      localStorage.setItem(
        "isConfirmed",
        JSON.stringify(data.isConfirmed)
      );
    }
  }, [data?.isConfirmed]);


  if (isFetching) {
    return (
      <div className={spinLoadingCenter}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-2">
      <CheckBookingHeader />
      <ReconciliationStatus
        data={data?.summary}
        hasBlockingDifferences={data?.hasBlockingDifferences}
        confirm={data?.canConfirm}
        isConfirm={data?.isConfirmed}
      />

      <ReconciliationTable
        isConfirm={data?.isConfirmed}
        backStep={() => {
          window.dispatchEvent(
            new CustomEvent("breadcrumb_updated", {
              detail: {
                stepValue: Number(stepValue) - 1,
              },
            })
          );
          navigate("/night-audit/folio-&-payment-review");
        }}
        
        nextStep={() => {
          window.dispatchEvent(
            new CustomEvent("breadcrumb_updated", {
              detail: {
                stepValue: Number(stepValue),
              },
            })
          );
          navigate("/night-audit/close-business-date")
        }}
        data={data}
      />
    </div>
  );
};
export default ReconciliationPage;
