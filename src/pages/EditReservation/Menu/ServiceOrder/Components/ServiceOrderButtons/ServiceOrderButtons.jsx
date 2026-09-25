import React, { useState } from "react";
import { Button } from "antd";
import ServiceAddonDrawer from "../ServiceOrderForms/ServiceAddonDrawer";

const ServiceOrderButtons = ({ reservationId }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-row gap-2 items-center w-full mb-4">
        <Button className="custom-blue-btn"
          onClick={() => setDrawerOpen(true)}
        >
          View Service Add On
        </Button>
      </div>

      <ServiceAddonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        reservationId={reservationId}
      />
    </div>
  );
};

export default ServiceOrderButtons;
