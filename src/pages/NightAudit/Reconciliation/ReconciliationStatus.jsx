import React, { useEffect } from "react";
import {
  CARD_CONFIGS,
  StatusCard,
} from "../../../component/NightAuditCard/ReconciliationStatusCards";
import { Alert, Button, Space, Typography } from "antd";
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  WarningOutlined,
} from "@ant-design/icons";
import { reconciliationConfirm } from "../../../api/nightAuditApi";
import { getNightAuditData } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ReconciliationStatus = ({
  data,
  hasBlockingDifferences,
  confirm,
}) => {
  const navigate = useNavigate();

  const canConfirm = confirm === true;
  const hasBlockingDifference = hasBlockingDifferences === false;

  const nightAuditData = getNightAuditData();
  const businessDate = nightAuditData?.businessDate;

  const nightAudit = JSON.parse(
    localStorage.getItem("nightAudit") || "{}"
  );

  const isConfirmed = nightAudit?.isConfirm === true;

  const isBalanced =
    hasBlockingDifference && canConfirm && !isConfirmed;

  useEffect(() => {
    if (!localStorage.getItem("nightAudit")) {
      navigate("/night-audit", { replace: true });
    }
  }, [navigate]);

  const reconciliationConfirmed = useApiMutation({
    mutationFn: reconciliationConfirm,
  });

  const reconciliation = () => {
    reconciliationConfirmed.mutate({
      businessDate,
    });
  };

  const recConfirmed = reconciliationConfirmed.isSuccess;

  useEffect(() => {
    if (recConfirmed) {
      const currentNightAudit = JSON.parse(
        localStorage.getItem("nightAudit") || "{}"
      );

      localStorage.setItem(
        "nightAudit",
        JSON.stringify({
          ...currentNightAudit,
          isConfirm: true,
        })
      );

      window.dispatchEvent(
        new CustomEvent("reconciliation_confirmed", {
          detail: {
            isConfirmed: true,
          },
        })
      );
    }
  }, [recConfirmed]);

  return (
    <div className="mb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 items-stretch !my-3 w-full">
        {CARD_CONFIGS.map((config) => (
          <StatusCard
            key={config.key}
            config={config}
            value={data?.[config.key]}
            currency="MMK"
          />
        ))}
      </div>

      <Alert
        type={isBalanced ? "success" : "error"}
        showIcon
        icon={
          isBalanced ? (
            <CheckCircleFilled style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleFilled style={{ color: "#ff4d4f" }} />
          )
        }
        message={
          isBalanced
            ? "Reconciliation is balanced. No blocking differences found."
            : "Reconciliation cannot be confirmed. Blocking differences were found."
        }
        action={
          <Space size={16}>
            <Space size={4}>
              {isBalanced ? (
                <>
                  <CheckCircleFilled style={{ color: "#52c41a" }} />
                  <Text className="text-[#274916] dark:text-[#A8D58D]">
                    {recConfirmed || isConfirmed
                      ? "Confirmed"
                      : "Can Confirm"}
                  </Text>
                </>
              ) : (
                <>
                  <WarningOutlined style={{ color: "#ff4d4f" }} />
                  <Text style={{ color: "#a8071a" }}>
                    Cannot Confirm
                  </Text>
                </>
              )}
            </Space>

            {!recConfirmed && !isConfirmed && (
              <Button
                type="primary"
                danger={!isBalanced}
                disabled={!isBalanced}
                loading={reconciliationConfirmed.isPending}
                onClick={reconciliation}
                icon={
                  isBalanced ? <CheckOutlined /> : <WarningOutlined />
                }
              >
                {isBalanced
                  ? "Confirm Reconciliation"
                  : "Resolve Differences"}
              </Button>
            )}
          </Space>
        }
        style={{ alignItems: "center" }}
      />
    </div>
  );
};

export default ReconciliationStatus;
