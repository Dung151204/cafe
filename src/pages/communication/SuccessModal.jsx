import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './SuccessModal.css';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="success-modal">
        <div className="success-icon-wrapper">
          <FaCheck />
        </div>
        <h3>Gửi phản hồi thành công!</h3>
        <p>Phản hồi của bạn đã được gửi đến người nhận.</p>
        <button className="btn-success-close" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default SuccessModal;