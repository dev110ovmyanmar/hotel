import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import { IoPrintOutline } from "react-icons/io5";
import React, { useState } from "react";
import { Button, Drawer, Dropdown, Form, Select } from "antd";
import FoodBeverageOrder from "../FolioOperationsForms/FoodBeverageOrder.JSX";
import AddNewServiceOrderForm from "../FolioOperationsForms/AddNewServiceOrderForm";
import AddNewFacilityOrderForm from "../FolioOperationsForms/AddNewFacilityOrderForm";
import AddDepositForm from "../../../../../BookingDetail/Components/BookingDetailForms/AddDepoistForm";

const FolioOperationsButtons = ({ data, folioUuid, reservationId, onPrintAllFolios }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [folioOpen, setFolioOpen] = useState(false);

  const foliosList = folioUuid?.data || [];

  const addOrder = [
    {
      key: "service",
      label: "Add New Service Order",
      onClick: () => {
        console.log("Service order button clicked!");
        setServiceOpen(true);
      },
    },
    {
      key: "facility",
      label: "Add New Facility Order",
      onClick: () => setFacilityOpen(true),
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
        {/* <Button onClick={() => setFolioOpen(true)} type="primary">
          Folio Operation
        </Button> */}

        <Dropdown
          menu={{ items: addOrder }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button className="custom-blue-btn flex items-center gap-1">
            Add Orders <DownOutlined />
          </Button>
        </Dropdown>

        <Button
          className="custom-blue-btn"
          onClick={() => setPaymentOpen(true)}
          icon={<PlusOutlined style={{ fontSize: "12px" }} />}
        >
          Add Deposit
        </Button>

        <Button
          className="custom-blue-btn"
          icon={<IoPrintOutline />}
          disabled={foliosList.length === 0}
          onClick={onPrintAllFolios}
        >
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

      {serviceOpen && (
        <AddNewServiceOrderForm
          serviceData={data || []}
          open={serviceOpen}
          onClose={() => setServiceOpen(false)}
          reservationId={reservationId}
          folioUuid={folioUuid?.data || []}
        />
      )}

      <AddNewFacilityOrderForm
        open={facilityOpen}
        onClose={() => setFacilityOpen(false)}
        reservationId={reservationId}
      />

      <AddDepositForm
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        reservationId={reservationId}
      />
    </div>
  );
};

export default FolioOperationsButtons;
