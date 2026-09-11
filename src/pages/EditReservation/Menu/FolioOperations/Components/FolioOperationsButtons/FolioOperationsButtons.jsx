import { DownOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { IoPrintOutline } from "react-icons/io5";
import React, { useState } from "react";
import { Button, Drawer, Dropdown, Form, Select } from "antd";
// import FoodBeverageOrder from "../FolioOperationsForms/FoodBeverageOrder";
import AddNewServiceOrderForm from "../FolioOperationsForms/AddNewServiceOrderForm";
import AddNewFacilityOrderForm from "../FolioOperationsForms/AddNewFacilityOrderForm";
import AddPaymentForm from "../../../../../BookingDetail/Components/BookingDetailForms/AddPaymentForm";
import AddDepoistForm from "../../../../../BookingDetail/Components/BookingDetailForms/AddDepoistForm";
import { queryClient } from "../../../../../../app/queryClient";

const FolioOperationsButtons = ({
    data,
    folioUuid,
    reservationId,
    onPrintAllFolios,
    isPrintAllLoading = false,
    reservationUuid
  }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [addDepositOpen, setAddDepositOpen] = useState(false);
  const [folioOpen, setFolioOpen] = useState(false);

  const foliosList = folioUuid?.data || [];

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const providerTypes = initData?.statuses.provider_type;
  const paymentStatuses = initData?.statuses?.payment_status;
  const paymentCompletedStatus = paymentStatuses.find((item) => item?.code == "completed");

  const addOrder = [
    {
      key: "service",
      label: "Add New Service Order",
      onClick: () => {
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

        {/* <Dropdown
          menu={{ items: addOrder }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button className="custom-blue-btn flex items-center gap-1">
            Add Orders <DownOutlined />
          </Button>
        </Dropdown> */}

        <Button
          className="custom-blue-btn"
          onClick={() => setPaymentOpen(true)}
          icon={<PlusOutlined style={{ fontSize: "12px" }} />}
        >
          Add Payment
        </Button>

        <Button
        className="custom-blue-btn"
        onClick={() => setAddDepositOpen(true)}
        icon={<PlusOutlined style={{ fontSize: "12px"}}/>}
        >
          Add Deposit
        </Button>

        <Button
          className="custom-blue-btn"
          icon={isPrintAllLoading ? <LoadingOutlined spin /> : <IoPrintOutline />}
          disabled={foliosList.length === 0 || isPrintAllLoading}
          loading={isPrintAllLoading}
          onClick={onPrintAllFolios}
        >
          Print Invoice
        </Button>

        {/* <Dropdown
          menu={{ items: food }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button className="custom-blue-btn flex items-center gap-1">
            More <DownOutlined />
          </Button>
        </Dropdown> */}
      </div>

      {/* <FoodBeverageOrder
        open={open}
        onClose={() => setOpen(false)}
        reservationId={reservationId}
        reservationUuid={reservationUuid}
      /> */}

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

      <AddPaymentForm
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        bookingDetails={data}
        providerTypes={providerTypes}
        paymentCompletedStatus={paymentCompletedStatus}
        reservationUuid={data?.uuid}
      />

      <AddDepoistForm
        open={addDepositOpen}
        onClose={() => setAddDepositOpen(false)}
        bookingDetails={data}
        providerTypes={providerTypes}
        paymentCompletedStatus={paymentCompletedStatus}
        reservationUuid={reservationUuid}
      /> 
    </div>
  );
};

export default FolioOperationsButtons;