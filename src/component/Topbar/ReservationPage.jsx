import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const ReservationPage = () => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Sample data based on your page context
  const reservationData = {
    reservationNo: "RES-2026-0622093325002",
    guestName: "Testing",
    arrival: "22 Jun 2026 ( 2:00 PM )",
    departure: "27 Jun 2026 ( 12:00 PM )",
    nights: 5,
    amount: "150,000 MMK"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* 1. Your Print Trigger Button */}
      <Button
        type="default"
        icon={<PrinterOutlined />}
        size="middle"
        className="bg-gray-200 hover:bg-gray-300 border-none text-gray-700"
        onClick={() => setIsPrintModalOpen(true)}
      >
        Print Reservation
      </Button>

      {/* 2. The Print Preview Form Modal */}
      <Modal
        title="Print Reservation Receipt"
        open={isPrintModalOpen}
        onCancel={() => setIsPrintModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsPrintModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            Print
          </Button>,
        ]}
        width={600}
      >
        {/* Printable Form Content Area */}
        <div id="printable-form-content" className="p-4 border border-gray-100 rounded-md my-2">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800 border-b pb-2">
            AZURA HOTEL RESERVATION
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Reservation No:</p>
              <p className="font-semibold text-gray-800">{reservationData.reservationNo}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Guest Name:</p>
              <p className="font-semibold text-gray-800">{reservationData.guestName}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Arrival:</p>
              <p className="text-gray-800">{reservationData.arrival}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Departure:</p>
              <p className="text-gray-800">{reservationData.departure}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Duration:</p>
              <p className="text-gray-800">{reservationData.nights} Nights</p>
            </div>
            <div className="border-t pt-2 mt-2 col-span-2 flex justify-between items-center">
              <span className="font-bold text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-blue-600">{reservationData.amount}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReservationPage;