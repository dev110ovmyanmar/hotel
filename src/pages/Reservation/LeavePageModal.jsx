import React, { useState } from 'react';
import { Button, Modal, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { setHasUnsavedForm } from '../../services/createReservationSlice';
import { useNavigate } from 'react-router-dom';
const LeavePageModal = ({
  leavePageModalOpen,
  setLeavePageModalOpen,
  pendingPath
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLeave = () => {
    dispatch(setHasUnsavedForm(false));
    setLeavePageModalOpen(false);
    navigate(pendingPath);
  };

  const handleStay = () => {
    setLeavePageModalOpen(false);
    dispatch(setHasUnsavedForm(true));
  };

  return (
    <>
      <Modal
        open={leavePageModalOpen}
        title="Leave Page Confirmation"
        onOk={handleStay}
        onCancel={handleLeave}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        cancelText="Leave"
        okText="Stay"

      >
        <p>
          You have unsaved changes. If you leave this page, all entered
          information will be lost. If you want to keep your changes,
          please click <strong>Submit</strong> before leaving.
        </p>

      </Modal>
    </>
  );
};
export default LeavePageModal;