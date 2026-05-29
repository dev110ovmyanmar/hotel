import React, { useState } from 'react';
import { Modal } from 'antd';

const SearchByModal = ({
    open,
    onOk,
    onCancel
}) => {
 
  return (
    <>
      <Modal
        title="Confirmation"
        open={open}
        onOk={onOk}
        onCancel={onCancel}
      >
        Are you sure you want to add this item?
      </Modal>
    </>
  );
};
export default SearchByModal;