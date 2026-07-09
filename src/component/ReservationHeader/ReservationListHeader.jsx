import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const ReservationListHeader = ({
  reservationId,
  onAddreservation,
  addButtonText,
  onAdd,
}) => {
  return (
    <div className="flex flex-row justify-between items-center w-full gap-2">
      <span>
        Reservation No:{" "}
        <strong className="text-indigo-700">{reservationId}</strong>
      </span>

      {addButtonText && (
        <div>
          <div className="w-full flex justify-end">
            <Button
              type="primary"
              onClick={onAddreservation}
              className="bg-blue-600"
            >
              {addButtonText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationListHeader;
