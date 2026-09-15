import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { reloadDailyPostCharges } from "../../../api/nightAuditApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { getNightAuditData} from "../../../variables/constants";
import RunPostingModal from "./RunPostingModal";
import { CONSOLIDATED_CARD_CONFIGS, DailyStatusCard } from "../../../component/NightAuditCard/DailyChargeCard";

const DailyChargeStatus = ({ dailyChargePostingData, preNightAudit }) => {
  const [runPostingModalOpen, setRunPostingModalOpen] = useState(false);

  const dailyChargeDisabled = dailyChargePostingData?.charges.length <= 0;

  const nightAuditData = getNightAuditData();
  const businessDate = nightAuditData?.businessDate;

  const reloadPostCharge = useApiMutation({
    mutationFn: reloadDailyPostCharges,
    invalidateKeys: [["daily-charge-postings"]],
  });

  const retryPostCharge = () => {
    reloadPostCharge.mutate(
      { businessDate },
      {
        onSuccess: () => setRunPostingModalOpen(false),
      }
    );
  };

  const summary = dailyChargePostingData?.summary;

  const getCardValues = (key) => {
    switch (key) {
      case "posted":
        return {
          count: summary?.posted ?? 0,
          amount: summary?.postedAmount ?? "0.00",
        };
      case "total":
        return {
          count: summary?.total ?? 0,
          amount: summary?.totalAmount ?? "0.00",
        };
      case "unposted":
        return {
          count: summary?.unposted ?? 0,
          amount: summary?.unpostedAmount ?? "0.00",
        };
      default:
        return { count: 0, amount: "0.00" };
    }
  };

  return (
    <div>
      <div>
        <div className="items-center grid xl:grid-cols-3 md:grid-cols-2 gap-x-5 !my-3 gap-y-3">

          {CONSOLIDATED_CARD_CONFIGS.map((config) => {
            const { count, amount } = getCardValues(config.key);
            return (
              <DailyStatusCard
                key={config.key}
                config={config}
                count={count}
                amount={amount}
                currency="MMK"
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-end my-4">
        <Button
          type="primary"
          onClick={() => setRunPostingModalOpen(true)}
          disabled={dailyChargeDisabled}
        >
          <ReloadOutlined /> Run Posting
        </Button>
      </div>

      <RunPostingModal
        onCancel={() => setRunPostingModalOpen(false)}
        onOk={retryPostCharge}
        open={runPostingModalOpen}
        confirmLoading={reloadPostCharge?.isPending}
      />
    </div>
  );
};

export default DailyChargeStatus;