import React, { useState } from 'react';
import { FaTimes, FaCalendarCheck, FaClock, FaUser } from 'react-icons/fa';
import './ReservationModal.css';

const ReservationModal = ({ isOpen, onClose, tableName, onConfirm }) => {
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!guestName || !time) {
      alert("Vui lòng nhập tên khách và giờ đến!");
      return;
    }
    onConfirm({ resName: guestName, resPhone: guestPhone, resTime: time, guests: people });
    // Reset form
    setGuestName('');
    setGuestPhone('');
    setTime('');
    setPeople(2);
  };

  return (
    <div className="modal-overlay">
      <div className="res-modal">
        <div className="modal-header">
          <h3>Đặt bàn: {tableName}</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label><FaUser /> Tên khách hàng *</label>
            <input type="text" placeholder="Ví dụ: Anh Tuấn..." value={guestName} onChange={e => setGuestName(e.target.value)} autoFocus />
          </div>
          
          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="text" placeholder="09xxxx..." value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label><FaClock /> Giờ đến *</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
            <div className="form-group half">
              <label>Số người</label>
              <input type="number" min="1" value={people} onChange={e => setPeople(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-confirm-res" onClick={handleSubmit}>
            <FaCalendarCheck /> Xác nhận đặt bàn
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;