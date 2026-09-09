import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FolderOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

const FolioAndPaymentReviewStatus = ({ data }) => {
  const folioCounts = (data?.folios || []).reduce(
    (acc, folio) => {
      const status = folio?.financialStatus?.trim()?.toLowerCase();

      if (status === "fully paid") {
        acc.fullyPaid += 1;
      } else if (status === "partially paid") {
        acc.partiallyPaid += 1;
      } else if (status === "unpaid") {
        acc.unpaid += 1;
      }
      return acc;
    },
    { fullyPaid: 0, partiallyPaid: 0, unpaid: 0 },
  );

  const cardDesign = `!w-full !max-w-[500px] !shadow-md !m-0 !p-0 `;
  const total = data?.totalFolios || data?.folios?.length || 0;

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center !my-3">
          {/* Total Card */}
          <Card
            className={`!bg-[#E6F4FF] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { paddingTop: "10px", paddingLeft: "6px" } }}
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
                  Total Folio
                </div>

                <div className="text-base font-bold text-[#003EB3]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {total}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Fully Paid Card */}
          <Card
            className={`!bg-[#F6FFED] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { paddingTop: "10px", paddingLeft: "6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D9F7BE] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F6FFED]">
                  <CheckCircleOutlined className="!text-[#389E0D] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#135200] mb-1 ml-3">
                  Fully Paid
                </div>

                <div className="text-base font-bold text-[#389E0D]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.fullyPaid}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Partially Paid Card */}
          <Card
            className={`!bg-[#FFFBE6] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { paddingTop: "10px", paddingLeft: "6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFE58F] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFFBE6]">
                  <PieChartOutlined className="!text-[#D48806] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#874D00] mb-1 ml-3">
                  Partially Paid
                </div>

                <div className="text-base font-bold text-[#D48806]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.partiallyPaid}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Unpaid Card */}
          <Card
            className={`!bg-[#FFF0F6] !border-none !rounded-lg ${cardDesign}`}
            styles={{ body: { paddingTop: "10px", paddingLeft: "6px" } }}
          >
            <div className="flex items-center p-3">
              {/* Icon Container */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD6E7] shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF0F6]">
                  <ExclamationCircleOutlined className="!text-[#C41D7F] !text-lg" />
                </div>
              </div>

              {/* Content Container */}
              <div className="ml-3 flex-1">
                <div className="text-xs font-medium text-[#780650] mb-1 ml-3">
                  Unpaid
                </div>

                <div className="text-base font-bold text-[#C41D7F]">
                  <div className="flex gap-1 text-xl font-semibold ml-3">
                    {folioCounts.unpaid}
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
