import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaSearch, FaCalendarAlt, FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import OrderDetailModal from "./OrderDetailModal";
import PaymentModal from "../../../components/pos/PaymentModal"; 
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // State cho thanh toán đơn nợ
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payingOrder, setPayingOrder] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('all_orders')) || [];
    setOrders(data.reverse()); 
  }, []);

  const totalRevenue = orders.reduce((sum, item) => sum + (item.status === 'completed' ? item.totalAmount : 0), 0);
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const filteredOrders = orders.filter(order => 
    (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.customer && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatPrice = (price) => price?.toLocaleString('vi-VN') + 'đ';

  // Mở modal thanh toán lại
  const handleOpenPayment = (order) => {
    setSelectedOrder(null); 
    setPayingOrder(order);  
    setIsPayModalOpen(true); 
  };

  // Xử lý sau khi thanh toán xong
  const handlePaymentComplete = (methodCode) => {
    if (methodCode === 'later') {
      alert("Đơn hàng này đang nợ rồi, vui lòng chọn Tiền mặt, Thẻ hoặc Chuyển khoản!");
      return; 
    }

    let methodDisplay = 'Tiền mặt';
    if(methodCode === 'card') methodDisplay = 'Thẻ';
    if(methodCode === 'transfer') methodDisplay = 'Chuyển khoản';

    const updatedOrders = orders.map(ord => {
      if (ord.id === payingOrder.id) {
        return { ...ord, status: 'completed', paymentMethod: methodDisplay };
      }
      return ord;
    });

    setOrders(updatedOrders);
    localStorage.setItem('all_orders', JSON.stringify(updatedOrders));
    
    setIsPayModalOpen(false);
    setPayingOrder(null);
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <div className="header-left">
           <button className="btn-back" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Về Dashboard</button>
           <h2>Lịch sử Đơn hàng</h2>
        </div>
        <div className="header-actions">
           <div className="search-box">
              <FaSearch className="search-icon"/>
              <input type="text" placeholder="Tìm mã đơn, tên khách..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
           <button className="btn-filter"><FaCalendarAlt /> Lọc ngày</button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card blue">
          <div className="stat-icon"><FaFileInvoiceDollar /></div>
          <div className="stat-info"><span>Tổng doanh thu</span><h3>{formatPrice(totalRevenue)}</h3></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info"><span>Đơn hoàn thành</span><h3>{completedCount}</h3></div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><FaTimesCircle /></div>
          <div className="stat-info"><span>Đơn đã hủy</span><h3>{cancelledCount}</h3></div>
        </div>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Mã đơn</th><th>Thời gian</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.date}</td>
                  <td><div className="customer-cell"><strong>{order.customer.name}</strong><span>{order.tableId}</span></div></td>
                  <td className="price-cell">{formatPrice(order.totalAmount)}</td>
                  <td>
                    {/* Badge trạng thái */}
                    <span className={`status-badge ${order.status === 'pending' ? 'pending' : order.status}`}>
                      {order.status === 'completed' ? 'Hoàn thành' : (order.status === 'pending' ? 'Chưa thanh toán' : 'Đã hủy')}
                    </span>
                  </td>
                  <td>
                    {/* QUAN TRỌNG: Phân chia nút bấm dựa theo trạng thái */}
                    {order.status === 'pending' ? (
                       <button className="btn-detail btn-pay" onClick={() => handleOpenPayment(order)}>
                         <FaMoneyBillWave /> Thanh toán
                       </button>
                    ) : (
                       <button className="btn-detail" onClick={() => setSelectedOrder(order)}>
                         <FaEye /> Xem
                       </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
          onPayOrder={() => handleOpenPayment(selectedOrder)}
        />
      )}

      {payingOrder && (
        <PaymentModal 
          isOpen={isPayModalOpen}
          onClose={() => setIsPayModalOpen(false)}
          totalAmount={payingOrder.totalAmount}
          onPaymentSuccess={handlePaymentComplete}
          tableName={`Thanh toán nợ: ${payingOrder.id}`}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;