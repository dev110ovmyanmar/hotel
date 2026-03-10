import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ReservationListHeader = ({
  reservationId,
  onAddGuest,
  addButtonText,
  onAdd,
}) => {
  return (
    <div className="flex flex-row justify-between items-center w-full gap-2">
      <span className="ml-5">Reservation id: {reservationId}</span>
      <div className="mr-5">
        <div className="w-full flex justify-end">
          <Button
            type="primary"
            // icon={<PlusOutlined />}
            onClick={onAdd}
            className="bg-blue-600"
          >
            {addButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReservationListHeader;
