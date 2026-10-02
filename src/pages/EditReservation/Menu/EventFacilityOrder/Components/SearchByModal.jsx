import React, { useState } from 'react';
import { Modal } from 'antd';
import { MdEventAvailable } from 'react-icons/md';

const SearchByModal = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  record
}) => {
  console.log(record,"RecordInSearch")
  return (
    <>
      <Modal
        title="Event Confirmation"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <div className="space-y-3 py-2">
          <p className="text-gray-700">
            Are you sure you want to create this event?
          </p>
          <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
            <MdEventAvailable className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-blue-700">
              {record?.eventName} {" "} ( {record?.guestName} - {record?.eventDate} )
            </span>
          </div>
        </div>

      </Modal>
    </>
  );
};
export default SearchByModal;