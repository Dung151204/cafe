// src/pages/orders/lichsu/OrderDetailModal.jsx
import React from 'react';
import { FaTimes, FaPrint, FaStore, FaMoneyBillWave } from 'react-icons/fa';
import './OrderDetailModal.css'; 

const OrderDetailModal = ({ order, onClose, onPayOrder }) => {
  if (!order) return null;

  const formatPrice = (price) => price?.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="modal-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <div className="brand-info">
            <FaStore className="brand-icon"/>
            <div><h4>The Coffee House</h4><span>Chi nhánh Trung tâm</span></div>
          </div>
          <button className="btn-close-modal" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="receipt-info">
          <div className="info-row"><span>Mã đơn:</span> <strong>{order.id}</strong></div>
          <div className="info-row"><span>Ngày:</span> <span>{order.date}</span></div>
          <div className="info-row"><span>Khách hàng:</span> <strong>{order.customer.name}</strong></div>
        </div>

        <div className="divider-dashed"></div>

        <div className="receipt-items">
          <table>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name} x {item.quantity}</td>
                  <td style={{textAlign: 'right'}}>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divider-solid"></div>

        <div className="receipt-summary">
           <div className="sum-row total"><span>Tổng cộng:</span><span>{formatPrice(order.totalAmount)}</span></div>
           <div className="sum-row method"><span>Phương thức:</span><span>{order.paymentMethod}</span></div>
           
           <div className="sum-row" style={{marginTop: 10, alignItems: 'center'}}>
             <span>Trạng thái:</span>
             <span style={{ fontWeight: 'bold', color: order.status === 'completed' ? 'green' : '#F59E0B' }}>
               {order.status === 'completed' ? '✅ Đã thanh toán' : '⚠️ Chưa thanh toán'}
             </span>
           </div>
        </div>

        <div className="receipt-footer">
           {order.status === 'pending' ? (
             <button className="btn-print-receipt" onClick={onPayOrder} style={{backgroundColor: '#F59E0B'}}>
               <FaMoneyBillWave /> Thanh toán ngay
             </button>
           ) : (
             <button className="btn-print-receipt"><FaPrint /> In hóa đơn</button>
           )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;