// import {  Steps } from 'antd';
// const StepsComponent = ({
//   stepValue
// }) => {
//   const textClass = `
//         text-md
//         sm:text-xs
//         md:text-xs
//         lg:text-sm
//         xl:text-md
//         2xl:text-lg
//     `;
//   return (
//     <div className='!my-3'>
//       <Steps
//         current={stepValue}
//         items={[
//            {
//             title: <span className={textClass}>Pre Audit Check</span>,
//           },
//           {
//             title: <span className={textClass}>Check Booking</span>,
//           },
//           {
//             title: <span className={textClass}>Room Charge</span>,
//           },
//           {
//             title: <span className={textClass}>Unsettled Folios</span>,
//           },
//           {
//             title:<span className={textClass}>Night Audit Posting</span>,
//           },
//           {
//             title: <span className={textClass}>Create New Day</span>,
//           },
//         ]}
//       />

//     </div>
//   );
// };
// export default StepsComponent;

import { Steps } from "antd";
import { useLocation } from "react-router-dom";

const StepsComponent = () => {
  const location = useLocation();

  const pathStepMap = {
    "/night-audit/pre-audit-check": 0,
    "/night-audit/check-booking": 1,
    "/night-audit/room-charge-table": 2,
    "/night-audit/unsettled-folios": 3,
    "/night-audit/night-audit-posting": 4,
    "/night-audit/create-new-day": 5,
  };

  const stepValue = pathStepMap[location.pathname] ?? 0;

  const textClass = `
    text-base
    sm:text-xs
    md:text-xs
    lg:text-sm
    xl:text-md
    2xl:text-lg
  `;

  return (
    <div className="!my-3">
      <Steps
        current={stepValue}
        items={[
          {
            title: (
              <span className={textClass}>
                Pre Audit Check
              </span>
            ),
          },
          {
            title: (
              <span className={textClass}>
                Check Booking
              </span>
            ),
          },
          {
            title: (
              <span className={textClass}>
                Room Charge
              </span>
            ),
          },
          {
            title: (
              <span className={textClass}>
                Unsettled Folios
              </span>
            ),
          },
          {
            title: (
              <span className={textClass}>
                Night Audit Posting
              </span>
            ),
          },
          {
            title: (
              <span className={textClass}>
                Create New Day
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};

export default StepsComponent;