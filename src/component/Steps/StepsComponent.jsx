import React, { useState } from 'react';
import { Divider, Steps } from 'antd';
const StepsComponent = ({
  stepValue
}) => {
  
  return (
    <>
      <Steps
        current={stepValue}
        items={[
          {
            title:'Check Booking',
          },
          {
            title: 'Room Charge',
          },
          {
            title:"Unsettled Folios",
          },
          {
            title: 'Night Audit Posting',
          },
          {
            title: 'Create New Day',
          },
        ]}
      />

    </>
  );
};
export default StepsComponent;