import React, { useState } from 'react';
import { Button, Modal, Space } from 'antd';
const RefreshConfirmModal = ({
    refreshConfirmModalOpen,
    setRefreshConfirmModalOpen,
    refreshDataCleanOk,
    createContactFinish
}) => {
    const handleCancel = () => {
        setRefreshConfirmModalOpen(false)
    };

    const handleOk = () => {
        refreshDataCleanOk()
    };

  return (
    <>
      <Modal
        open={refreshConfirmModalOpen}
        title="Refresh Confirmation"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        okText="Refresh"
        
      >
        {
            createContactFinish 
            ? <p>Unsaved data will be lost if you refresh the current page. Please click <strong className='text-red-500'>Submit</strong> first if you want to save your changes. Continue?</p>
            : <p>This action will reset all input fields. Are you sure you want to continue?</p>

        }
        
      </Modal>
    </>
  );
};
export default RefreshConfirmModal;