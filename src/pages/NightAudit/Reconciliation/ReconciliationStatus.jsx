import React from "react";
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

const { Text } = Typography;

const ReconciliationStatus = ({
  data,
  hasBlockingDifferences,
}) => {

  const isBalanced = hasBlockingDifferences === false;

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
                    Can Confirm
                  </Text>
                </>
              ) : (
                <>
                  <WarningOutlined style={{ color: "#ff4d4f" }} />
                  <Text style={{ color: "#a8071a" }}>Cannot Confirm</Text>
                </>
              )}
            </Space>

            <Button
              type="primary"
              danger={!isBalanced}
              disabled={!isBalanced}
              icon={
                isBalanced ? <CheckOutlined /> : <WarningOutlined />
              }
            >
              {isBalanced
                ? "Confirm Reconciliation"
                : "Resolve Differences"}
            </Button>
          </Space>
        }
        style={{ alignItems: "center" }}
      />
    </div>
  );
};

export default ReconciliationStatus;

