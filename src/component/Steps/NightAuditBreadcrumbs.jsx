// import React from "react";
// import { Steps } from "antd";
// import { FaMoon } from "react-icons/fa";

// const NightAuditBreadcrumbs = ({ stepValue = 0 }) => {
// //   const steps = [
// //     {
// //       title: "Pre-Audit Check",
// //       description: "Check bookings & rooms",
// //     },
// //     {
// //       title: "Check Booking",
// //       description: "Review reservations",
// //     },
// //     {
// //       title: "Room Charge",
// //       description: "Review & post charges",
// //     },
// //     {
// //       title: "Unsettled Folios",
// //       description: "Check folios & payments",
// //     },
// //     {
// //       title: "Night Audit Posting",
// //       description: "Process night audit",
// //     },
// //     {
// //       title: "Create New Day",
// //       description: "Open next business day",
// //     },
// //   ];

// //   const currentStep = steps[stepValue];

//   return (
//     <div className="w-full bg-white dark:bg-gray-900">
      
//       <div className="flex items-center gap-4 px-6 py-4">
        
//         <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100">
//           <FaMoon className="text-blue-600 text-xl" />
//         </div>

//         <div className="flex items-center gap-4">
//           <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
//             Night Audit
//           </h1>

          
//         </div>

//       </div>

//     </div>
//   );
// };

// export default NightAuditBreadcrumbs;

import { Card } from "antd";
import dayjs from "dayjs";
import { Calendar1, Clock1 } from "lucide-react";
import { FaMoon } from "react-icons/fa";

const NightAuditBreadcrumbs = ({
    preAuditChecksData
}) => {
    const cardDesign = `!shadow-md !m-0 !p-0`;
    const textStyleFromCard = `!text-gray-400`;
    return (
        <div className="flex justify-between items-center my-2">
            <div className="flex items-center gap-4 px-6 py-4">

                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100">
                    <FaMoon className="text-blue-600 text-xl" />
                </div>

                <div className="flex items-center gap-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        Night Audit
                    </h1>

                    {/* <span className="text-gray-400 text-xl">/</span> */}

                    {/* <span className="text-blue-700 dark:text-blue-400 font-semibold">
                        {stepValue + 1}. {currentStep?.title}
                      </span> */}
                </div>

            </div>
            <div className="flex gap-x-3">
                {/* <div> */}
                <Card className={cardDesign}>
                    <div className="flex items-center justify-around gap-x-2">
                        <Calendar1 className="text-blue-500" />
                        <div>
                            <div className={textStyleFromCard}>
                                Current Date
                            </div>
                            <div>
                                {dayjs(preAuditChecksData?.businessDate).format("DD MMMM YYYY")}
                            </div>
                        </div>
                    </div>
                </Card>
                {/* </div> */}

                {/* <div> */}
                <Card className={cardDesign}>
                    <div className="flex items-center justify-around gap-x-2">
                        <Clock1 className="text-green-500" />
                        <div>
                            <div className={textStyleFromCard}>
                                Audit Time
                            </div>
                            <div>
                                {dayjs().format("HH:mm A")}
                            </div>
                        </div>
                    </div>
                </Card>
                {/* </div> */}
            </div>
        </div>

    )
}

export default NightAuditBreadcrumbs;
