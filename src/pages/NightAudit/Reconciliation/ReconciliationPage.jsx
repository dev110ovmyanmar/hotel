import { useNavigate } from "react-router-dom";
import { reconciliation } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { Spin } from "antd";
import ReconciliationStatus from "./ReconciliationStatus";
import CheckBookingHeader from "../CheckBookingHeader";
import ReconciliationTable from "./ReconciliationTable";
import { getNightAuditData } from "../../../variables/constants";
import { useEffect } from "react";

const ReconciliationPage = ({ stepValue }) => {
  const navigate = useNavigate();

  const nightAuditData = getNightAuditData();

  const businessDate = nightAuditData?.businessDate;

  useEffect(() => {
    const nightAudit = localStorage.getItem("nightAudit");

    if (!nightAudit) {
      navigate("/night-audit", { replace: true });
    }
  }, [navigate]);

  const { data, isFetching } = useApiQuery({
    fetchQueryName: "folio-review",
    fetchQueryFunction: reconciliation,
    params: {
      businessDate,
    },
  });

  if (isFetching) {
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-2">
      <CheckBookingHeader />
      <ReconciliationStatus
        data={data?.summary}
        hasBlockingDifferences={data?.hasBlockingDifferences}
      />
      <ReconciliationTable
        colorCheckBooking={() => {
          window.dispatchEvent(
            new CustomEvent("breadcrumb_updated", {
              detail: {
                stepValue: Number(stepValue),
              },
            }),
          );
          navigate("/night-audit/close-business-date");
        }}
        data={data}
      />
    </div>
  );
};

export default ReconciliationPage;
