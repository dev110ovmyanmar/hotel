import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import usePermission from "../../hooks/usePermission";
import { PERMISSIONS } from "../../variables/permission";

const ReservationListHeader = ({
  reservationId,
  onAddreservation,
  addButtonText
}) => {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission(PERMISSIONS.RESERVATION_ROOM_CREATE);
  
  return (
    <div className="flex flex-row justify-between items-center w-full gap-2">
      <span>
        Reservation No:{" "}
        <strong className="text-indigo-700 dark:text-indigo-500">{reservationId}</strong>
      </span>

      {addButtonText
        ?
        canCreate &&
        (
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
        )
        : null
      }
    </div>
  );
};

export default ReservationListHeader;
