import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { IoPrintOutline } from "react-icons/io5";
import React, { useState } from "react";
import { Button, Drawer, Dropdown, Form, Select } from "antd";
import FoodBeverageOrder from "../FolioOperationsForms/FoodBeverageOrder.JSX";
import ServiceAddOnForm from "../../../ServiceAddOn/Components/ServiceAddOnForms/ServiceAddOnForm";

const FolioOperationsButtons = ({ reservationId, onFolioOperationClick }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const addOrder = [
    {
      key: "service",
      label: "Add New Service Order",
    },
    {
      key: "facility",
      label: "Add New Facility Order",
    },
  ];
  const food = [
    {
      key: "food",
      label: "Food Beverage Order",
      onClick: () => setOpen(true),
    },
  ];

  return (
    <div>
      <div className="flex flex-row gap-2 items-center w-full mb-4">
        <Button onClick={onFolioOperationClick} className="custom-blue-btn">
          Folio Operation
        </Button>

        <Dropdown
          menu={{ items: addOrder }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button className="custom-blue-btn flex items-center gap-1">
            Add Orders <DownOutlined />
          </Button>
        </Dropdown>

        <Button className="custom-blue-btn">
          Add Payment <PlusOutlined />
        </Button>

        <Button className="custom-blue-btn" icon={<IoPrintOutline />}>
          Print Invoice
        </Button>

        <Dropdown
          menu={{ items: food }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button className="custom-blue-btn flex items-center gap-1">
            More <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <FoodBeverageOrder
        open={open}
        onClose={() => setOpen(false)}
        reservationId={reservationId}
      />
    </div>
  );
};

export default FolioOperationsButtons;
