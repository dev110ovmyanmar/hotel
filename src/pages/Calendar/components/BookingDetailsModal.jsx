import React from 'react';
import { Button, Badge, Modal, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { STATUS_COLORS } from '../Calendar';
import { Link } from 'react-router-dom';

const BookingDetailsModal = ({ isModalOpen, handleModalClose, selectedBooking }) => (
  <Modal
    title="Booking Details"
    open={isModalOpen}
    onCancel={handleModalClose}
    footer={[
      <Button key="close" type="primary" onClick={handleModalClose} className='mr-2'>
        Close
      </Button>,
      <Link to={`/reservations/${selectedBooking?.id}/room-information`} className='ml-2'>
        <Button key="view" type="primary">
          View Reservation
        </Button>
      </Link>
    ]}
  >
    {selectedBooking && (
      <Descriptions column={1} bordered size="small" className="mt-4">
        <Descriptions.Item label="Booking ID">{selectedBooking.reservationNo}</Descriptions.Item>
        <Descriptions.Item label="Guest Name">{selectedBooking.name}</Descriptions.Item>
        <Descriptions.Item label="Phone">{selectedBooking.phone}</Descriptions.Item>
        <Descriptions.Item label="Room">{selectedBooking.roomId} ({selectedBooking.roomFloor})</Descriptions.Item>
        <Descriptions.Item label="Check-in">
          <span style={{ fontWeight: 600, color: '#198754' }}>
            {dayjs(selectedBooking.checkIn).format('DD MMM YYYY')}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Check-out">
          <span style={{ fontWeight: 600, color: '#DC3545' }}>
            {dayjs(selectedBooking.checkOut).format('DD MMM YYYY')}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Nights">{selectedBooking.nights} Night(s)</Descriptions.Item>
        <Descriptions.Item label="Guests">{selectedBooking.guests} Person(s)</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge
            color={STATUS_COLORS[selectedBooking.status]?.bg || '#ccc'}
            text={<span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{selectedBooking.status}</span>}
          />
        </Descriptions.Item>
      </Descriptions>
    )}
  </Modal>
);

export default BookingDetailsModal;
