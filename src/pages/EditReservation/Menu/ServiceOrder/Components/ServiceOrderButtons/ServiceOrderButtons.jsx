import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Button, Drawer, Dropdown, Form, Select } from "antd";
import { queryClient } from "../../../../../../app/queryClient";
import ServiceAddonDrawer from "../ServiceOrderForms/ServiceAddonDrawer";

const ServiceOrderButtons = ({ data, reservationId }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  return (
    <div>
      <div className="flex flex-row gap-2 items-center w-full mb-4">
        <Button className="custom-blue-btn" onClick={() => setDrawerOpen(true)}>
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
