// src/components/pos/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaWallet, FaCreditCard, FaMobileAlt, FaCheck, FaPrint, FaClock } from 'react-icons/fa';
import './PaymentModal.css';
import './CategorySidebar.css';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess, tableName }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [cashGiven, setCashGiven] = useState(''); 
  const [isSuccess, setIsSuccess] = useState(false);

  // Tính tiền thừa
  const changeAmount = cashGiven ? parseInt(cashGiven) - totalAmount : 0;

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setPaymentMethod('cash');
      setCashGiven(''); 
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatPrice = (price) => price.toLocaleString('vi-VN') + 'đ';

  const handleConfirm = () => {
    // Nếu chọn Tiền mặt mà đưa thiếu
    if (paymentMethod === 'cash' && changeAmount < 0) {
      alert("Khách đưa chưa đủ tiền!");
      return;
    }

    // Chuyển sang màn hình thành công
    setIsSuccess(true);
    
    setTimeout(() => {
      onPaymentSuccess(); 
      onClose(); 
    }, 2000);
  };

  // --- MÀN HÌNH THÀNH CÔNG (Có xử lý riêng cho Thanh toán sau) ---
  if (isSuccess) {
    const isPayLater = paymentMethod === 'later';
    return (
      <div className="modal-overlay">
        <div className="modal-content success-mode">
          <div className={`success-icon ${isPayLater ? 'pending-icon' : ''}`}>
             {isPayLater ? <FaClock /> : <FaCheck />}
          </div>
          
          <h2>{isPayLater ? "Đã lưu đơn hàng!" : "Thanh toán thành công!"}</h2>
          <p>{tableName}</p>
          
          {isPayLater ? (
             <p className="note-text">Đơn hàng đang ở trạng thái <b>Chờ thanh toán</b></p>
          ) : (
             <div className="success-total">{formatPrice(totalAmount)}</div>
          )}
          
          {/* Chỉ hiện tiền thừa nếu là Tiền mặt */}
          {paymentMethod === 'cash' && changeAmount > 0 && (
             <p className="change-note">Trả lại khách: <strong>{formatPrice(changeAmount)}</strong></p>
          )}
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHỌN PHƯƠNG THỨC ---
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Thanh toán: {tableName}</h3>
          <button className="btn-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="payment-summary">
          <div className="summary-row total">
            <span>Tổng phải thu:</span>
            <span className="big-text">{formatPrice(totalAmount)}</span>
          </div>
        </div>

        <div className="payment-methods">
          <p className="section-label">Hình thức thanh toán</p>
          <div className="methods-grid">
            <div className={`method-card ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>
              <FaWallet className="method-icon"/><span>Tiền mặt</span>
            </div>
            <div className={`method-card ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>
              <FaCreditCard className="method-icon"/><span>Thẻ</span>
            </div>
            <div className={`method-card ${paymentMethod === 'transfer' ? 'active' : ''}`} onClick={() => setPaymentMethod('transfer')}>
              <FaMobileAlt className="method-icon"/><span>Chuyển khoản</span>
            </div>
            {/* THÊM NÚT THANH TOÁN SAU */}
            <div className={`method-card ${paymentMethod === 'later' ? 'active' : ''}`} onClick={() => setPaymentMethod('later')}>
              <FaClock className="method-icon"/><span>Thanh toán sau</span>
            </div>
          </div>
        </div>

        {/* LOGIC TÍNH TIỀN THỪA (Chỉ hiện khi chọn Tiền mặt) */}
        {paymentMethod === 'cash' && (
          <div className="cash-calculation">
            <div className="input-row">
              <label>Khách đưa:</label>
              <div className="money-input-wrapper">
                <input 
                  type="number" placeholder="0" 
                  value={cashGiven} onChange={(e) => setCashGiven(e.target.value)}
                  autoFocus
                />
                <span className="currency-unit">đ</span>
              </div>
            </div>

            <div className={`change-row ${changeAmount >= 0 ? 'positive' : 'negative'}`}>
              <span>Tiền thừa trả khách:</span>
              <strong className="change-value">
                {changeAmount >= 0 ? formatPrice(changeAmount) : "Thiếu " + formatPrice(Math.abs(changeAmount))}
              </strong>
            </div>

            <div className="quick-money-suggestions">
               {[totalAmount, 50000, 100000, 200000, 500000].map(amount => (
                 amount >= totalAmount && (
                   <button key={amount} onClick={() => setCashGiven(amount)}>
                     {amount / 1000}k
                   </button>
                 )
               ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-confirm" onClick={handleConfirm}>
            {/* Đổi chữ nút bấm tùy theo phương thức */}
            {paymentMethod === 'later' ? (
               <> <FaClock style={{ marginRight: 8 }}/> Lưu đơn </>
            ) : (
               <> <FaPrint style={{ marginRight: 8 }}/> Hoàn tất </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;