import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FolderOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

const FolioAndPaymentReviewStatus = ({ data }) => {
  const folioCounts = data?.reviewSummary

  const cardDesign = `!w-full !h-full !shadow-md !m-0 !p-0 `;

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center !my-3">
          {/* Total Card */}
          <Card
            className={`!bg-[#E6F4FF] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#BAE0FF] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E6F4FF]">
                  <FolderOutlined className="!text-[#003EB3] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#002C8C] mb-1 ml-3">
                  Passed
                </div>

                <div className="text-base font-bold text-[#003EB3]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.clearFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Fully Paid Card */}
          <Card
            className={`!bg-[#F6FFED] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#B7EB8F] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6FFED]">
                  <CheckCircleOutlined className="!text-[#389E0D] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#389E0D] mb-1 ml-3">
                  Warning
                </div>

                <div className="text-base font-bold text-[#389E0D]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.warningFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Partially Paid Card */}
          <Card
            className={`!bg-[#FFF4F1]  !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFBD9F] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF4F1]">
                  <PieChartOutlined className="!text-[#FF7800] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#FF7800] mb-1 ml-3">
                  Blocked
                </div>

                <div className="text-base font-bold text-[#FF7800]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.blockingFolios}
                  </div>
                </div>
              </div>
            </div>
          </Card>


          {/* Unpaid Card */}
          <Card
            className={`!bg-[#FDFFE0] !rounded-lg ${cardDesign}`}
            styles={{ body: { padding: "10px 6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF8B3] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FDFFE0]">
                  <ExclamationCircleOutlined className="!text-[#D4A106] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#D4A106] mb-1 ml-3">
                  Total
                </div>

                <div className="text-base font-bold text-[#D4A106]">
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
