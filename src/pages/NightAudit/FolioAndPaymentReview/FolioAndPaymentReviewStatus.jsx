import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  FolderOutlined,
  PieChartOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card } from "antd";
import { CircleCheck } from "lucide-react";

const FolioAndPaymentReviewStatus = ({ data }) => {
  const folioCounts = data?.reviewSummary

  const cardDesign = `!w-full !h-full !shadow-md !m-0 !p-0 `;

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center !my-3">

           <Card
            className={`!bg-[#F6FFED] !text-[#389E0D] !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D9F7BE] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6FFED]">
                  <CircleCheck className="!text-[#389E0D] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#389E0D] mb-1 ml-3">
                  Passed
                </div>

                <div className="text-base font-bold text-[#389E0D]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.clearFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>

         
          <Card
            className={`!bg-[#FFF4F1] !text-[#FF7800] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD8BF] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF4F1]">
                  <WarningOutlined className="!text-[#FF7800] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#FF7800] mb-1 ml-3">
                  Warning
                </div>

                <div className="text-base font-bold text-[#FF7800]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.warningFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>

         
          <Card
            className={`!bg-[#FFF1F0] !text-[#CF1322]  !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD8D6] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF1F0]">
                  <CloseCircleOutlined className="!text-[#CF1322] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#CF1322] mb-1 ml-3">
                  Blocked
                </div>

                <div className="text-base font-bold text-[#CF1322]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.blockingFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className={`!bg-[#F0F5FF] !text-[#1D39C4] !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D6E4FF] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F0F5FF]">
                  <FileTextOutlined className="!text-[#1D39C4] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#1D39C4] mb-1 ml-3">
                  Total
                </div>

                <div className="text-base font-bold text-[#1D39C4]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.totalFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default FolioAndPaymentReviewStatus;
