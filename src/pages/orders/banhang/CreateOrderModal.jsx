// src/pages/orders/CreateOrderModal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateOrderModal.css';

const CreateOrderModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    phone: '',
    address: '',
    note: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const handleNextStep = () => {
    if (!customerInfo.customerName || !customerInfo.phone) {
      alert("Vui lòng nhập Tên và SĐT khách hàng!");
      return;
    }

    // Chuyển sang POS và mang theo dữ liệu khách
    navigate('/pos', { 
      state: { 
        deliveryCustomer: customerInfo 
      } 
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-large" style={{ width: '500px' }}>
        <h2 className="modal-title">Thông tin giao hàng</h2>

        <div className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Tên khách hàng *</label>
              <input 
                type="text" name="customerName" 
                placeholder="Nhập tên khách..." 
                value={customerInfo.customerName} onChange={handleChange}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input 
                type="text" name="phone" 
                placeholder="Nhập SĐT..." 
                value={customerInfo.phone} onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Địa chỉ giao hàng</label>
            <input 
              type="text" name="address" 
              placeholder="Số nhà, đường, phường, quận..." 
              value={customerInfo.address} onChange={handleChange}
            />
          </div>
          
          <div className="form-group full-width">
            <label>Ghi chú đơn hàng</label>
            <textarea 
              name="note"
              placeholder="Ví dụ: Giao giờ hành chính, ít đá..."
              value={customerInfo.note} onChange={handleChange}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', width: '100%', height: '80px' }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
          <button className="btn-submit" onClick={handleNextStep}>
            Tiếp tục: Chọn món &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;