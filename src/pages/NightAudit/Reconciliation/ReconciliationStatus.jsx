// import React from "react";
// import {
//   CARD_CONFIGS,
//   StatusCard,
// } from "../../../component/NightAuditCard/ReconciliationStatusCards";
// import { Alert, Button, Space } from "antd";
// import { CheckCircleFilled, CheckOutlined } from "@ant-design/icons";
// import { Text } from "lucide-react";

// const ReconciliationStatus = ({ data, hasBlockingDifferences }) => {
//   console.log(data, "data");
//   return (
//     <div className="mb-2">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center !my-3">
//         {CARD_CONFIGS.map((config) => (
//           <StatusCard
//             key={config.key}
//             config={config}
//             value={data?.[config.key]}
//             currency="MMK"
//           />
//         ))}
//       </div>

//       <Alert
//         type="success"
//         showIcon
//         icon={<CheckCircleFilled style={{ color: "#52c41a" }} />}
//         message="All folios are balanced. No blocking differences found."
//         action={
//           <Space size={16}>
//             <Space size={4}>
//               <CheckCircleFilled style={{ color: "#52c41a" }} />
//               <p style={{ color: "#274916" }}>Can Confirm</p>
//             </Space>
//             <Button type="primary" icon={<CheckOutlined />}>
//               Confirm Reconciliation
//             </Button>
//           </Space>
//         }
//         style={{ alignItems: "center" }}
//       />
//     </div>
//   );
// };

// export default ReconciliationStatus;

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
  console.log(data, "data");

  const isBalanced = hasBlockingDifferences === false;

  return (
    <div className="mb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center !my-3">
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
                  <Text style={{ color: "#274916" }}>Can Confirm</Text>
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

